import { FC } from 'react';

import { BodyL, BodyM } from '../typography/typography.styled';

import { InputRangeStyled } from './input-range.styled';

export interface InputRangeProps {
  className?: string;
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

export const InputRange: FC<InputRangeProps> = ({ className, label, min, max, value, onChange }) => {
  const getBackgroundSize = () => ((value - min) * 100) / (max - min) + '% 100%';

  return (
    <InputRangeStyled backgroundSize={getBackgroundSize()} className={className}>
      <div className="label">
        <BodyM weight={700}>{label}</BodyM>
        <BodyL>${value}</BodyL>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        step="50"
        onChange={(e) => onChange(e.target.valueAsNumber)}
      />
    </InputRangeStyled>
  );
};
