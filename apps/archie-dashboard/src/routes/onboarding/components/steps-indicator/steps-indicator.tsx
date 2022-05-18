import { FC } from 'react';
import {
  SubtitleS,
  ParagraphS,
  ParagraphXXS,
} from '../../../../components/_generic/typography/typography.styled';
import { StepsIndicatorStyled } from './steps-indicator.styled';

interface StepsIndicatorProps {
  title: string;
  subtitle: string;
  currentStep: string;
}

export const StepsIndicator: FC<StepsIndicatorProps> = ({
  title,
  subtitle,
  currentStep,
}) => (
  <StepsIndicatorStyled>
    <SubtitleS weight={800}>{title}</SubtitleS>
    <ParagraphS>{subtitle}</ParagraphS>
    <div className="steps">
      <div className="step">
        <div className="circle"></div>
        <ParagraphXXS>Sign-up</ParagraphXXS>
      </div>
      <div className="step">
        <div className="circle"></div>
        <ParagraphXXS>Collateralize</ParagraphXXS>
      </div>
      <div className="step">
        <div className="circle"></div>
        <ParagraphXXS>Get Archie Card</ParagraphXXS>
      </div>
    </div>
  </StepsIndicatorStyled>
);
