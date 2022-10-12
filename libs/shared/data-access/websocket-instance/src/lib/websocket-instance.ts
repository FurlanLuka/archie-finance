import { WS_URL } from '@archie-webapps/shared/constants';

import { EventType } from './events';
import { getConnectionToken } from './get-connection-token/get-connection-token';

// TODO: Map of handlers for events
// TODO: Reconnect on token rotate?
class WebsocketInstance {
  private connection: WebSocket | undefined = undefined;
  private accessToken: string | undefined = undefined;
  public connected = false;
  private handlers: Map<EventType, VoidFunction> = new Map();

  public setToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  public async connect(onConnect: VoidFunction) {
    if (this.accessToken === undefined) {
      console.warn('Access token not set yet');
      return;
    }

    try {
      const { authToken } = await getConnectionToken(this.accessToken);
      console.log;
      this.connection = new WebSocket(`${WS_URL}?authToken=${authToken}`);
      this.connected = true;

      this.connection.onmessage = (event) => {
        console.log('bruh', event, this.handlers);
      };

      onConnect();
    } catch (error: any) {
      console.error('Error while trying to set up WS connection');
      // Wat do, graciously fail?
      onConnect();
    }
  }

  public addHandler(event: EventType, handler: VoidFunction) {
    this.handlers.set(event, handler);
  }

  public removeHandler(event: EventType) {
    this.handlers.delete(event);
  }
}

const websocketInstance = new WebsocketInstance();

export { websocketInstance };
