import { ReactElement, useState } from 'react';

import { Icon } from '@archie-webapps/shared/ui/icons';

import { SelectOptionProps } from './select-option';
import { SelectStyled } from './select.styled';
import { theme } from '@archie-webapps/shared/ui/theme';

interface SelectProps<T> {
  id: string;
  header: ReactElement;
  onChange: (value: T) => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  minWidth?: string;
  small?: boolean;
  children: ReactElement<SelectOptionProps<T>>[];
}

// TODO: Refactor Select component to nest styled header and options and prevent passing many props
export function Select<T>({ id, header, onChange, isLoading, isDisabled, minWidth, small, children }: SelectProps<T>) {
  const [selectOpen, setSelectOpen] = useState(false);

  const handleSelect = (value: T) => {
    onChange(value);
    setSelectOpen(false);
  };

  return (
    <SelectStyled id={id} isLoading={isLoading} isDisabled={isDisabled} minWidth={minWidth} small={small}>
      <div className="select-header" onClick={() => setSelectOpen(!selectOpen)}>
        {header}
        <Icon
          name="caret"
          fill={theme.textHighlight}
          className={selectOpen ? 'select-header-caret open' : 'select-header-caret'}
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
