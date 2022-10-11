import { getConnectionToken } from './get-connection-token/get-connection-token';

// TODO: Map of handlers for events
class WebsocketInstance {
  private connection: WebSocket | undefined = undefined;
  private accessToken: string | undefined = undefined;
  public connected = false;

  public setToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  public async connect(onConnect: VoidFunction) {
    if (this.accessToken === undefined) {
      console.warn('Access token not set yet');
      return;
    }

    try {
      const { accessToken } = await getConnectionToken(this.accessToken);
      this.connection = new WebSocket(`wss://ws.dev.archie.finance/?authToken=${accessToken}`);
      this.connected = true;

      onConnect();
    } catch (error: any) {
      console.error('Error while trying to set up WS connection');
      // Wat do, graciously fail?
      onConnect();
    }
  }
}

const websocketInstance = new WebsocketInstance();

export { websocketInstance };
