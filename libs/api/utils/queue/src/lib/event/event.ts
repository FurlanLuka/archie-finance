import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv';

export interface EventMetadata<T> {
  routingKey: string;
  version: number;
  schema: JSONSchemaType<T>;
}

export interface EventOptions {
  exchange?: string;
}

export class Event<T> {
  private routingKey: string;
  private version: number;
  private schema: JSONSchemaType<T>;
  private options?: EventOptions;

  private ajv: Ajv = new Ajv();

  private validateFn: ValidateFunction<T>;

  constructor(
    routingKey: string,
    version: number,
    schema: JSONSchemaType<T>,
    options?: EventOptions,
  ) {
    this.routingKey = routingKey;
    this.version = version;
    this.schema = schema;
    this.validateFn = this.ajv.compile(schema);
    this.options = options;
  }

  public validate(data: T): data is T {
    return this.validateFn(data);
  }

  public getRoutingKey(): string {
    return this.routingKey;
  }

  public getVersion(): number {
    return this.version;
  }

  public getMetadata(): EventMetadata<T> {
    return {
      routingKey: this.routingKey,
      version: this.version,
      schema: this.schema,
    };
  }

  public getExhange(): string | null {
    if (this.options?.exchange !== undefined) {
      return this.options.exchange;
    }

    return null;
  }
}
