import { WsAdapter as BaseWsAdapter } from '@nestjs/platform-ws';
import { WebSocket, WebSocketServer } from 'ws';

export class WsAdapter extends BaseWsAdapter {
  private wsServer;
  DEFAULT_PING_INTERVAL_IN_MS = 25_000;

  public create(
    port: number,
    options?: Record<string, any> & {
      namespace?: string;
      server?: any;
      pingInterval?: number;
    },
  ): WebSocketServer {
    this.wsServer = super.create(port, options);

    setInterval(
      this.pingAll.bind(this),
      options?.pingInterval ?? this.DEFAULT_PING_INTERVAL_IN_MS,
    );

    return this.wsServer;
  }

  public bindErrorHandler(server: any): void {
    return super.bindErrorHandler(server);
  }

  public bindClientConnect(
    server: any,
    callback: (client: WebSocket, ...args: any) => void,
  ): void {
    return super.bindClientConnect(server, (client, ...args) => {
      client.isAlive = true;
      client.on('pong', () => {
        client.isAlive = true;
      });

      callback(client, ...args);
    });
  }

  private pingAll(): void {
    this.wsServer.clients.forEach((client) => {
      if (client.isAlive === false) return client.terminate();

      client.isAlive = false;
      client.ping();
    });
  }
}
