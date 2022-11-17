import { ReactElement, useState } from 'react';

import { Icon } from '@archie/ui/shared/icons';
import { theme } from '@archie/ui/shared/theme';

import { SelectOptionProps } from './select-option';
import { SelectStyled } from './select.styled';

export interface SelectProps<T> {
  id: string;
  header: ReactElement;
  onChange: (value: T) => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  width?: string;
  small?: boolean;
  children: ReactElement<SelectOptionProps<T>>[];
}

export function Select<T>({
  id,
  header,
  onChange,
  isLoading,
  isDisabled,
  width,
  small,
  children,
}: SelectProps<T>) {
  const [selectOpen, setSelectOpen] = useState(false);

  const handleSelect = (value: T) => {
    onChange(value);
    setSelectOpen(false);
  };

  return (
    <SelectStyled
      id={id}
      isLoading={isLoading}
      isDisabled={isDisabled}
      width={width}
      small={small}
    >
      <div className="select-header" onClick={() => setSelectOpen(!selectOpen)}>
        {header}
        <Icon
          name="caret"
          fill={
            isLoading || isDisabled ? theme.textDisabled : theme.textHighlight
          }
          className={
            selectOpen ? 'select-header-caret open' : 'select-header-caret'
          }
        />
      </div>
      {selectOpen && (
        <div className="select-list">
          {children.map((child, index) => (
            <div
              className="select-option"
              id={`${id}-option-${index}`}
              key={`${id}-option-${index}`}
              onClick={() => handleSelect(child.props.value)}
            >
              {child}
            </div>
          ))}
        </div>
      )}
    </SelectStyled>
  );
}
