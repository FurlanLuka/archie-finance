import { ResponsivePie } from '@nivo/pie';
import { FC } from 'react';

import { LtvStatus } from '@archie/api/ltv-api/data-transfer-objects/types';
import { LTVText, LTVColor } from '@archie/ui/shared/constants';
import { Badge, TitleL, BodyS } from '@archie/ui/shared/design-system';
import { theme } from '@archie/ui/shared/theme';

import { LoanToValueChartStyled } from './loan-to-value.styled';

interface LoanToValueChartProps {
  ltv: number;
  status: LtvStatus;
}

export const LoanToValueChart: FC<LoanToValueChartProps> = ({
  ltv,
  status,
}) => {
  const data = [
    {
      id: LtvStatus.good,
      value: ltv.toFixed(2),
      color: LTVColor[status],
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
        <BodyS weight={700}>Loan-to-value</BodyS>
        <TitleL weight={400} color={LTVColor[status]}>
          {ltv.toFixed(2)}%
        </TitleL>
        <Badge statusColor={LTVColor[status]} className="status-label">
          {LTVText[status]}
        </Badge>
      </div>
    </LoanToValueChartStyled>
  );
};
