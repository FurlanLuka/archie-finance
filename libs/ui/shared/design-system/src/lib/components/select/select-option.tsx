import { PropsWithChildren } from 'react';

import { SelectOptionStyled } from './select.styled';

export interface SelectOptionProps<T> extends PropsWithChildren {
  className?: string;
  value: T;
}

export function SelectOption<T>({ className, children }: SelectOptionProps<T>) {
  return (
    <SelectOptionStyled className={className}>{children}</SelectOptionStyled>
  );
}
