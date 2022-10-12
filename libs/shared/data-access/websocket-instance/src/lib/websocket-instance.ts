import { WS_URL } from '@archie-webapps/shared/constants';

import { getConnectionToken } from './get-connection-token/get-connection-token';

// TODO: Map of handlers for events
// TODO: Reconnect on token rotate?
class WebsocketInstance {
  private connection: WebSocket | undefined = undefined;
  private accessToken: string | undefined = undefined;
  public connected = false;

  public setToken(accessToken: string) {
    console.log('ajde token', accessToken);
    this.accessToken = accessToken;
  }

  public async connect(onConnect: VoidFunction) {
    console.log('kaj', this);
    if (this.accessToken === undefined) {
      console.warn('Access token not set yet');
      return;
    }

    try {
      const { accessToken } = await getConnectionToken(this.accessToken);
      this.connection = new WebSocket(`${WS_URL}?authToken=${accessToken}`);
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
