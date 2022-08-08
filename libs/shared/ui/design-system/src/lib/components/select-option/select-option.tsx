import { PropsWithChildren } from 'react';

export type SelectOptionProps<T> = PropsWithChildren<{
  className?: string;
  value: T;
}>;

export function SelectOption<T>({ className, children }: PropsWithChildren<SelectOptionProps<T>>) {
  return <div className={className}>{children}</div>;
}
