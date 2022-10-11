export interface EventOptions {
  exchange?: string;
}

export class Event<T> {
  private routingKey: string;
  private version: number;

  constructor(
    routingKey: string,
    version: number,
  ) {
    this.routingKey = routingKey;
    this.version = version;
  }

  public getRoutingKey(): string {
    return `${this.routingKey}.v${this.version}`;
  }

  public getVersion(): number {
    return this.version;
  }
}
