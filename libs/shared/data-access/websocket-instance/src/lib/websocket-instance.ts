import { WS_URL } from '@archie-webapps/shared/constants';

import { WsEvent, WsEventTopic } from './events';
import { getConnectionToken } from './get-connection-token/get-connection-token';
import { parseWsEvent } from './helpers/event-handler';

const BACKOFF_TIME = 1000;
const MAX_RETRIES = 5;

function waitFor(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// TODO: Map of handlers for events
class WebsocketInstance {
  private connection: WebSocket | undefined = undefined;
  private accessToken: string | undefined = undefined;
  public connected = false;
  private handlers: Map<WsEventTopic, Array<{ id: string; handler: (event: WsEvent) => void }>> = new Map();

  public setToken(accessToken: string): void {
    this.accessToken = accessToken;
  }

  public async connect(onConnect: VoidFunction, onFail: VoidFunction): Promise<void> {
    const connectToWs = async (retryCount = 0): Promise<void> => {
      try {
        if (this.accessToken === undefined) {
          console.warn('Access token not set yet');
          return;
        }

        if (retryCount > 0) {
          const timeToWait = retryCount * BACKOFF_TIME;
          await waitFor(timeToWait);
        }

        const { authToken } = await getConnectionToken(this.accessToken);
        this.connection = new WebSocket(`${WS_URL}?authToken=${authToken}`);
        onConnect();
        this.connected = true;

        this.connection.onmessage = (message) => {
          const parsedEvent = parseWsEvent(JSON.parse(message.data));

          if (parsedEvent !== undefined) {
            const eventHandlers = this.handlers.get(parsedEvent.topic);
            eventHandlers?.forEach(({ handler }) => handler(parsedEvent));
          }
        };
      } catch (error: unknown) {
        console.error('Error while trying to set up WS connection', error);
        onFail();

        if (retryCount <= MAX_RETRIES) {
          return connectToWs(retryCount + 1);
        }

        console.warn('Max retries reached, no websocket connection established');
      }
    };

    await connectToWs();
  }

  // TODO figure out wtf is going on with event typing
  public addHandler(event: WsEventTopic, id: string, handler: (event: any) => void): void {
    const eventHandlers = this.handlers.get(event) || [];
    this.handlers.set(event, [...eventHandlers, { id, handler }]);
  }

  public removeHandler(event: WsEventTopic, id: string): void {
    const updatedHandlers = (this.handlers.get(event) || []).filter((h) => h.id !== id);

    this.handlers.set(event, updatedHandlers);
  }
}

const websocketInstance = new WebsocketInstance();

export { websocketInstance };
