import { ResponsivePie } from '@nivo/pie';
import { FC } from 'react';

import { SubtitleM, ParagraphXXS } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

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
