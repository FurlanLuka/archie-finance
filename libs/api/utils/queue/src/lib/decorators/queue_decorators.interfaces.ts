export interface QueueMessageMeta {
  properties?: {
    headers?: Record<string, string>;
  };
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type AppliedDecorator = <TFunction extends Function, Y>(
  target: object | TFunction,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Y>,
) => void;
