import { ReactElement, useState } from 'react';

import { Icon } from '@archie-webapps/shared/ui/icons';

import { SelectOptionProps } from './select-option';
import { SelectStyled } from './select.styled';

interface SelectProps<T> {
  id: string;
  header: ReactElement;
  onChange: (value: T) => void;
  children: ReactElement<SelectOptionProps<T>>[];
  disabled?: boolean;
}

export function Select<T>({ disabled, id, header, onChange, children }: SelectProps<T>) {
  const [selectOpen, setSelectOpen] = useState(false);

  const handleSelect = (value: T) => {
    onChange(value);
    setSelectOpen(false);
  };

  return (
    <SelectStyled id={id}>
      <div className={`select-header ${disabled && 'disabled'}`} onClick={() => setSelectOpen(!selectOpen)}>
        {header}
        <Icon name="caret" className={selectOpen ? 'select-header-caret open' : 'select-header-caret'} />
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
