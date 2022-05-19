import { FC } from 'react';
import { ParagraphM, ParagraphS } from '../typography/typography.styled';
import { InputRangeStyled } from './input-range.styled';

interface InputRangeProps {
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
        <ParagraphS weight={700}>{label}</ParagraphS>
        <ParagraphM>${value}</ParagraphM>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(e.target.valueAsNumber)} />
    </InputRangeStyled>
  );
};
