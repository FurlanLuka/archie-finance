import { WS_URL } from '@archie-webapps/shared/constants';

import { WsEventType } from './events';
import { getConnectionToken } from './get-connection-token/get-connection-token';

// TODO: Map of handlers for events
// TODO: Reconnect on token rotate?
class WebsocketInstance {
  private connection: WebSocket | undefined = undefined;
  private accessToken: string | undefined = undefined;
  public connected = false;
  private handlers: Map<WsEventType, VoidFunction> = new Map();

  public setToken(accessToken: string): void {
    this.accessToken = accessToken;
  }

  public async connect(): Promise<void> {
    if (this.accessToken === undefined) {
      console.warn('Access token not set yet');
      return;
    }

    try {
      const { authToken } = await getConnectionToken(this.accessToken);
      console.log;
      this.connection = new WebSocket(`${WS_URL}?authToken=${authToken}`);
      this.connected = true;

      this.connection.onmessage = (message) => {
        console.log('bruh', message.data, this.handlers);
      };
    } catch (error: any) {
      console.error('Error while trying to set up WS connection', error);
      // Wat do, graciously fail?
    }
  }

  public addHandler(event: WsEventType, handler: VoidFunction): void {
    this.handlers.set(event, handler);
  }

  public removeHandler(event: WsEventType): void {
    this.handlers.delete(event);
  }
}

const websocketInstance = new WebsocketInstance();

export { websocketInstance };
