import { PropsWithChildren } from 'react';

import { SelectOptionStyled } from './select-option.styled';

export type SelectOptionProps<T> = PropsWithChildren<{
  className?: string;
  value: T;
}>;

export function SelectOption<T>({ className, children }: PropsWithChildren<SelectOptionProps<T>>) {
  return <SelectOptionStyled className={className}>{children}</SelectOptionStyled>;
}
