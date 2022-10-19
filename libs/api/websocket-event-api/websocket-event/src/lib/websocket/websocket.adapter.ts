import { WsAdapter as BaseWsAdapter } from '@nestjs/platform-ws';
import { WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { ExtendedWebSocket } from './websocket.interfaces';
import { v4 } from 'uuid';

export class WsAdapter extends BaseWsAdapter {
  DEFAULT_PING_INTERVAL_IN_MS = 25_000;
  DEFAULT_PING_TIMEOUT_IN_MS = 20_000;
  private pingOptions: {
    interval: number;
    timeout: number;
  };

  public create(
    port: number,
    options?: Record<string, unknown> & {
      namespace?: string;
      server?: WebSocketServer;
      pingInterval?: number;
      pingTimeout?: number;
    },
  ): WebSocketServer {
    this.pingOptions = {
      interval: options?.pingInterval ?? this.DEFAULT_PING_INTERVAL_IN_MS,
      timeout: options?.pingTimeout ?? this.DEFAULT_PING_TIMEOUT_IN_MS,
    };

    return super.create(port, options);
  }

  public bindClientConnect(
    server: WebSocketServer,
    callback: (
      client: ExtendedWebSocket,
      message: IncomingMessage,
      ...args: unknown[]
    ) => void,
  ): void {
    return super.bindClientConnect(
      server,
      (client: ExtendedWebSocket, message: IncomingMessage, ...args) => {
        client.id = v4();
        this.setPingInterval(client);

        client.on('pong', () => {
          this.setPingInterval(client);
        });

        callback(client, message, ...args);
      },
    );
  }

  private setPingInterval(client: ExtendedWebSocket): void {
    this.clearPingTimeout(client);

    client.pingIntervalTimer = setTimeout(() => {
      client.ping();
      this.resetPingTimeout(client);
    }, this.pingOptions.interval);
  }

  private resetPingTimeout(client: ExtendedWebSocket): void {
    this.clearPingTimeout(client);

    client.pingTimeoutTimer = setTimeout(() => {
      if (
        client.readyState !== client.CLOSING &&
        client.readyState !== client.CLOSED
      ) {
        client.terminate();
      }
    }, this.pingOptions.timeout);
  }

  private clearPingTimeout(client: ExtendedWebSocket): void {
    clearTimeout(client.pingTimeoutTimer);
  }
}
