import { WS_URL } from '@archie-webapps/shared/constants';

import { WsEvent, WsEventTopic } from './events';
import { getConnectionToken } from './get-connection-token/get-connection-token';
import { parseWsEvent } from './helpers/event-handler';

// TODO: Map of handlers for events
// TODO: Reconnect on token rotate?
class WebsocketInstance {
  private connection: WebSocket | undefined = undefined;
  private accessToken: string | undefined = undefined;
  public connected = false;
  private handlers: Map<WsEventTopic, (event: WsEvent) => void> = new Map();

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
        const parsedEvent = parseWsEvent(JSON.parse(message.data));

        if (parsedEvent !== undefined) {
          const eventHandler = this.handlers.get(parsedEvent.topic);
          eventHandler?.(parsedEvent);
        }
        console.log('bruh', message.data, this.handlers);
      };
    } catch (error: any) {
      console.error('Error while trying to set up WS connection', error);
      // Wat do, graciously fail?
    }
  }

  // TODO figure out wtf is going on with event typing
  public addHandler(event: WsEventTopic, handler: (event: any) => void): void {
    this.handlers.set(event, handler);
  }

  public removeHandler(event: WsEventTopic): void {
    this.handlers.delete(event);
  }
}

const websocketInstance = new WebsocketInstance();

export { websocketInstance };
