import { Module, Global, DynamicModule } from '@nestjs/common';
import { SendgridOptions } from './sendgrid.interfaces';
import { SendgridService } from './sendgrid.service';

@Global()
@Module({
  controllers: [],
  providers: [SendgridService],
  exports: [SendgridService],
})
export class SendgridModule {
  static register(options: SendgridOptions): DynamicModule {
    return {
      module: SendgridModule,
      imports: [...options.imports],
      providers: [
        {
          inject: options.inject,
          provide: 'SENDGRID_CONFIG',
          useFactory: options.useFactory,
        },
        SendgridService,
      ],
      exports: [SendgridService],
      global: true,
    };
  }
}
