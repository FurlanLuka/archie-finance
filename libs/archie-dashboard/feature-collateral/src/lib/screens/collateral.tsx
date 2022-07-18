import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, Table, Badge, SubtitleS, ParagraphM, ParagraphXS } from '@archie-webapps/ui-design-system';
import { theme } from '@archie-webapps/ui-theme';
import { LoanToValueColor, LoanToValueText } from '@archie-webapps/util-constants';

import { tableData } from '../constants/table-data';
import { tableColumns } from '../fixtures/table-fixture';

import { CollateralStyled } from './collateral.styled';

export const CollateralScreen: FC = () => {
  const { t } = useTranslation();

  const columns = useMemo(() => tableColumns, []);
  const data = useMemo(() => tableData, []);

  // Temp data
  const total = '4,564.34';
  const ltv = 22;
  const good = 'good';

  return (
    <CollateralStyled>
      <div className="section-table">
        <Card column alignItems="flex-start" padding="2rem 1.5rem 2.5rem">
          <ParagraphM weight={800} className="title">
            {t('dashboard_collateral.table_section.title')}
          </ParagraphM>
          <SubtitleS weight={400} className="total">
            ${total}
          </SubtitleS>
          <div className="title-group">
            <div className="ltv-group">
              <ParagraphXS weight={700} color={theme.textSecondary}>
                {t('ltv')}:
              </ParagraphXS>
              <ParagraphM>{ltv}%</ParagraphM>
            </div>
            <Badge statusColor={LoanToValueColor[good]}>{LoanToValueText[good]}</Badge>
          </div>

          <Table columns={columns} data={data} />
        </Card>
      </div>
    </CollateralStyled>
  );
};
