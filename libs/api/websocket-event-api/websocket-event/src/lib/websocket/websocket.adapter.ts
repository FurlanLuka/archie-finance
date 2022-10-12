import { WsAdapter as BaseWsAdapter } from '@nestjs/platform-ws';
import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';

interface WebsocketWithPingIntervals extends WebSocket {
  pingIntervalTimer: NodeJS.Timer;
  pingTimeoutTimer: NodeJS.Timer;
}

export class WsAdapter extends BaseWsAdapter {
  DEFAULT_PING_INTERVAL_IN_MS = 25_000;
  DEFAULT_PING_TIMEOUT_IN_MS = 20_000;
  private pingOptions: {
    interval: number;
    timeout: number;
  };

  public create(
    port: number,
    options?: Record<string, any> & {
      namespace?: string;
      server?: any;
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
    server: any,
    callback: (
      client: WebSocket,
      message: IncomingMessage,
      ...args: any
    ) => void,
  ): void {
    return super.bindClientConnect(
      server,
      (
        client: WebsocketWithPingIntervals,
        message: IncomingMessage,
        ...args
      ) => {
        this.setPingInterval(client);

        client.on('pong', () => {
          this.setPingInterval(client);
        });

        callback(client, message, ...args);
      },
    );
  }

  private setPingInterval(client: WebsocketWithPingIntervals): void {
    this.clearPingTimeout(client);

    client.pingIntervalTimer = setTimeout(() => {
      client.ping();
      this.resetPingTimeout(client);
    }, this.pingOptions.interval);
  }

  private resetPingTimeout(client: WebsocketWithPingIntervals): void {
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

  private clearPingTimeout(client: WebsocketWithPingIntervals): void {
    clearTimeout(client.pingTimeoutTimer);
  }
}
