import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';
import {
  createConfigurableDynamicRootModule,
  IConfigurableDynamicRootModule,
} from '@golevelup/nestjs-modules';
import {
  AmqpConnection,
  AmqpConnectionManager,
  RABBIT_ARGS_METADATA,
  RABBIT_CONFIG_TOKEN,
  RABBIT_HANDLER,
  RabbitHandlerConfig,
  RabbitMQConfig,
  RabbitRpcParamsFactory,
} from '@golevelup/nestjs-rabbitmq';
import {
  DynamicModule,
  Module,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ExternalContextCreator } from '@nestjs/core/helpers/external-context-creator';
import { groupBy } from 'lodash';
import { RABBIT_RETRY_HANDLER } from '@archie/api/utils/queue';

// COPIED from https://github.com/golevelup/nestjs/blob/1d26ad53cd2cfae7be9b1d8b6b87ff2ef5f9758d/packages/rabbitmq/src/rabbitmq.module.ts

declare const placeholder: IConfigurableDynamicRootModule<
  RabbitMQCustomModule,
  RabbitMQConfig
>;

@Module({
  imports: [DiscoveryModule],
})
export class RabbitMQCustomModule
  extends createConfigurableDynamicRootModule<
    RabbitMQCustomModule,
    RabbitMQConfig
  >(RABBIT_CONFIG_TOKEN, {
    providers: [
      {
        provide: AmqpConnectionManager,
        useFactory: async (
          config: RabbitMQConfig,
        ): Promise<AmqpConnectionManager> => {
          await RabbitMQCustomModule.AmqpConnectionFactory(config);
          return RabbitMQCustomModule.connectionManager;
        },
        inject: [RABBIT_CONFIG_TOKEN],
      },
      {
        provide: AmqpConnection,
        useFactory: async (
          config: RabbitMQConfig,
          connectionManager: AmqpConnectionManager,
        ): Promise<AmqpConnection> => {
          return connectionManager.getConnection(
            config.name || 'default',
          ) as AmqpConnection;
        },
        inject: [RABBIT_CONFIG_TOKEN, AmqpConnectionManager],
      },
      RabbitRpcParamsFactory,
    ],
    exports: [AmqpConnectionManager, AmqpConnection],
  })
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(RabbitMQCustomModule.name);

  private static connectionManager = new AmqpConnectionManager();
  private static bootstrapped = false;

  constructor(
    private readonly discover: DiscoveryService,
    private readonly externalContextCreator: ExternalContextCreator,
    private readonly rpcParamsFactory: RabbitRpcParamsFactory,
    private readonly connectionManager: AmqpConnectionManager,
  ) {
    super();
  }

  static async AmqpConnectionFactory(config: RabbitMQConfig) {
    const connection = new AmqpConnection(config);
    this.connectionManager.addConnection(connection);
    await connection.init();
    const logger = config.logger || new Logger(RabbitMQCustomModule.name);
    logger.log('Successfully connected to RabbitMQ');
    return connection;
  }

  public static build(config: RabbitMQConfig): DynamicModule {
    const logger = config.logger || new Logger(RabbitMQCustomModule.name);
    logger.warn(
      'build() is deprecated. use forRoot() or forRootAsync() to configure RabbitMQ',
    );
    return {
      module: RabbitMQCustomModule,
      providers: [
        {
          provide: AmqpConnection,
          useFactory: async (): Promise<AmqpConnection> => {
            return RabbitMQCustomModule.AmqpConnectionFactory(config);
          },
        },
        RabbitRpcParamsFactory,
      ],
      exports: [AmqpConnection],
    };
  }

  public static attach(connection: AmqpConnection): DynamicModule {
    return {
      module: RabbitMQCustomModule,
      providers: [
        {
          provide: AmqpConnection,
          useValue: connection,
        },
        RabbitRpcParamsFactory,
      ],
      exports: [AmqpConnection],
    };
  }

  async onApplicationShutdown() {
    this.logger.verbose('Closing AMQP Connections');

    await Promise.all(
      this.connectionManager
        .getConnections()
        .map((connection) => connection.managedConnection.close),
    );
  }

  public async onApplicationBootstrap() {
    if (RabbitMQCustomModule.bootstrapped) {
      return;
    }
    RabbitMQCustomModule.bootstrapped = true;

    for (const connection of this.connectionManager.getConnections()) {
      if (!connection.configuration.registerHandlers) {
        this.logger.log(
          'Skipping RabbitMQ Handlers due to configuration. This application instance will not receive messages over RabbitMQ',
        );

        continue;
      }

      this.logger.log('Initializing RabbitMQ Handlers');

      let rabbitMeta =
        await this.discover.providerMethodsWithMetaAtKey<RabbitHandlerConfig>(
          RABBIT_RETRY_HANDLER,
        );
      rabbitMeta = rabbitMeta.concat(
        await this.discover.providerMethodsWithMetaAtKey<RabbitHandlerConfig>(
          RABBIT_HANDLER,
        ),
      );

      if (connection.configuration.enableControllerDiscovery) {
        this.logger.log(
          'Searching for RabbitMQ Handlers in Controllers. You can not use NestJS HTTP-Requests in these controllers!',
        );
        rabbitMeta = rabbitMeta.concat(
          await this.discover.controllerMethodsWithMetaAtKey<RabbitHandlerConfig>(
            RABBIT_RETRY_HANDLER,
          ),
        );
        rabbitMeta = rabbitMeta.concat(
          await this.discover.controllerMethodsWithMetaAtKey<RabbitHandlerConfig>(
            RABBIT_HANDLER,
          ),
        );
      }

      const grouped = groupBy(
        rabbitMeta,
        (x) => x.discoveredMethod.parentClass.name,
      );

      const providerKeys = Object.keys(grouped);

      for (const key of providerKeys) {
        this.logger.log(`Registering rabbitmq handlers from ${key}`);
        await Promise.all(
          grouped[key].map(async ({ discoveredMethod, meta: config }) => {
            if (
              config.connection &&
              config.connection !== connection.configuration.name
            ) {
              return;
            }

            const handler = this.externalContextCreator.create(
              discoveredMethod.parentClass.instance,
              discoveredMethod.handler,
              discoveredMethod.methodName,
              RABBIT_ARGS_METADATA,
              this.rpcParamsFactory,
              undefined, // contextId
              undefined, // inquirerId
              undefined, // options
              'rmq', // contextType
            );

            const { exchange, routingKey, queue, queueOptions } = config;

            const handlerDisplayName = `${discoveredMethod.parentClass.name}.${
              discoveredMethod.methodName
            } {${config.type}} -> ${
              queueOptions?.channel ? `${queueOptions.channel}::` : ''
            }${exchange}::${routingKey}::${queue || 'amqpgen'}`;

            if (
              config.type === 'rpc' &&
              !connection.configuration.enableDirectReplyTo
            ) {
              this.logger.warn(
                `Direct Reply-To Functionality is disabled. RPC handler ${handlerDisplayName} will not be registered`,
              );
              return;
            }

            this.logger.log(handlerDisplayName);

            return config.type === 'rpc'
              ? connection.createRpc(handler, config)
              : connection.createSubscriber(
                  handler,
                  config,
                  discoveredMethod.methodName,
                );
          }),
        );
      }
    }
  }
}
