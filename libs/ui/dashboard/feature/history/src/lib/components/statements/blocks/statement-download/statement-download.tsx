import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Statement } from '@archie/api/peach-api/data-transfer-objects/types';
import {
  ButtonOutline,
  Select,
  SelectOption,
  BodyM,
  BodyS,
} from '@archie/ui/shared/design-system';
import { Icon } from '@archie/ui/shared/icons';
import { theme } from '@archie/ui/shared/theme';

import { useDownloadStatement } from './use-download-statement';

interface StatementDownloadProps {
  statements: Statement[];
}

export const StatementDownload: FC<StatementDownloadProps> = ({
  statements,
}) => {
  const { t } = useTranslation();

  const [selectedStatement, setSelectedStatement] = useState<Statement>(
    statements[0],
  );

  const { isLoading, downloadDocument } = useDownloadStatement(
    selectedStatement.documentDescriptorId,
  );

  const header = (
    <BodyS weight={600} color={theme.textHighlight}>
      {selectedStatement.billingCycleStartDate} -{' '}
      {selectedStatement.billingCycleEndDate}
    </BodyS>
  );

  const options = statements.map((statement) => (
    <SelectOption key={statement.id} value={statement}>
      <BodyM weight={500}>
        {statement.billingCycleStartDate} - {statement.billingCycleEndDate}
      </BodyM>
    </SelectOption>
  ));

  return (
    <>
      <Select
        id="statements"
        small
        width="220px"
        header={header}
        onChange={(statement: Statement) => setSelectedStatement(statement)}
      >
        {options}
      </Select>
      <ButtonOutline
        small
        width="175px"
        isLoading={isLoading}
        onClick={downloadDocument}
      >
        {t('dashboard_history.btn_statements')}{' '}
        <Icon name="download" fill={theme.textHighlight} />
      </ButtonOutline>
    </>
  );
};
