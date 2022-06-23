import { FC } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { theme } from '../../../../../constants/ui/theme';
import { SubtitleM, ParagraphXXS } from '../../../../../components/_generic/typography/typography.styled';
import { LoanToValueStyled } from './loan-to-value.styled';

const data = [
  {
    id: 'good',
    value: 20,
    color: theme.loanToValueActive,
  },
  {
    id: 'not-good',
    value: 80,
    color: theme.loanToValueDefault,
  },
];

export const LoanToValue: FC = () => (
  <LoanToValueStyled>
    <ResponsivePie
      data={data}
      innerRadius={0.9}
      padAngle={0.5}
      cornerRadius={50}
      colors={{ datum: 'data.color' }}
      enableArcLabels={false}
      enableArcLinkLabels={false}
      animate={true}
    />
    <div className="centered-metrics">
      <ParagraphXXS weight={700}>Loan-to-value</ParagraphXXS>
      <SubtitleM weight={400} color={theme.loanToValueActive}>
        20%
      </SubtitleM>
      <div className="status-label">GOOD</div>
    </div>
  </LoanToValueStyled>
);
