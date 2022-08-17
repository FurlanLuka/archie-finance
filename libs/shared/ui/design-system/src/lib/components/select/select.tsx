import { ReactElement, useState } from 'react';

import { Icon } from '@archie-webapps/shared/ui/icons';

import { SelectOptionProps } from '../select-option/select-option';

import { SelectStyled } from './select.styled';

interface SelectProps<T> {
  id: string;
  onChange: (value: T) => void;
  children: ReactElement<SelectOptionProps<T>>[];
  header: ReactElement;
}

export function Select<T>({ id, header, onChange, children }: SelectProps<T>) {
  const [selectOpen, setSelectOpen] = useState(false);

  const handleSelect = (value: T) => {
    onChange(value);
    setSelectOpen(false);
  };

  return (
    <SelectStyled id={id}>
      <div className="select-header" onClick={() => setSelectOpen(!selectOpen)}>
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
