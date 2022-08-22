import { ResponsivePie } from '@nivo/pie';
import { FC } from 'react';

import { LoanToValueStatus, LoanToValueColor, LoanToValueText } from '@archie-webapps/shared/constants';
import { Badge, SubtitleM, ParagraphXXS } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { LoanToValueChartStyled } from './loan-to-value.styled';

interface LoanToValueChartProps {
  ltv: number;
  status: LoanToValueStatus;
}

export const LoanToValueChart: FC<LoanToValueChartProps> = ({ ltv, status }) => {
  const data = [
    {
      id: LoanToValueStatus.GOOD,
      value: ltv.toFixed(2),
      color: LoanToValueColor[status],
    },
    {
      id: 'until_margin_call',
      value: (100 - ltv).toFixed(2),
      color: theme.loanToValueDefault,
    },
  ];

  return (
    <LoanToValueChartStyled>
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
        <SubtitleM weight={400} color={LoanToValueColor[status]}>
          {ltv.toFixed(2)}%
        </SubtitleM>
        <Badge statusColor={LoanToValueColor[status]} className="status-label">
          {LoanToValueText[status]}
        </Badge>
      </div>
    </LoanToValueChartStyled>
  );
};
