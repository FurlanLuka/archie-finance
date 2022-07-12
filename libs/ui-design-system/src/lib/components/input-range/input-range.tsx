import { FC } from 'react';

import { ParagraphS, ParagraphXS } from '../typography/typography.styled';

import { InputRangeStyled } from './input-range.styled';

export interface InputRangeProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

export const InputRange: FC<InputRangeProps> = ({ label, min, max, value, onChange }) => {
  const getBackgroundSize = () => ((value - min) * 100) / (max - min) + '% 100%';

  return (
    <InputRangeStyled backgroundSize={getBackgroundSize()}>
      <div className="label">
        <ParagraphXS weight={700}>{label}</ParagraphXS>
        <ParagraphS>${value}</ParagraphS>
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
