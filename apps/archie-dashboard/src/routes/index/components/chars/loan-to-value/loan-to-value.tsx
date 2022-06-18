import { FC } from 'react';
import { Pie, ComputedDatum } from '@nivo/pie';
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

const colors = { good: 'red', 'not-good': 'green' };

export const LoanToValue: FC = () => (
  <LoanToValueStyled>
    <Pie
      data={data}
      height={216}
      width={216}
      innerRadius={0.9}
      padAngle={0.5}
      cornerRadius={50}
      colors={{ datum: 'data.color' }}
      enableArcLabels={false}
      enableArcLinkLabels={false}
      isInteractive={false}
      animate={false}
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
