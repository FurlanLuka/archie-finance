import { FC } from 'react';
import { ArrowIndicatorRight } from '../../../../components/_generic/icons/arrow-indicator-right';
import { SubtitleS, ParagraphS, ParagraphXXS } from '../../../../components/_generic/typography/typography.styled';
import { StepsIndicatorStyled } from './steps-indicator.styled';

interface StepsIndicatorProps {
  title: string;
  subtitle: string;
  currentStep: string;
}

export const StepsIndicator: FC<StepsIndicatorProps> = ({ title, subtitle, currentStep }) => (
  <StepsIndicatorStyled>
    <SubtitleS weight={800}>{title}</SubtitleS>
    <ParagraphS>{subtitle}</ParagraphS>
    <div className="steps">
      <div className="step">
        <div className="circle"></div>
        <ParagraphXXS weight={700}>Sign-up</ParagraphXXS>
        <ArrowIndicatorRight className="arrow" />
      </div>
      <div className="step">
        <div className="circle"></div>
        <ParagraphXXS weight={700}>Collateralize</ParagraphXXS>
        <ArrowIndicatorRight className="arrow" />
      </div>
      <div className="step">
        <div className="circle"></div>
        <ParagraphXXS weight={700}>Get Archie Card</ParagraphXXS>
      </div>
    </div>
  </StepsIndicatorStyled>
);
