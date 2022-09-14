import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Statement } from '@archie-webapps/shared/data-access/archie-api/payment/api/get-statements';
import { Icon } from '@archie-webapps/shared/ui/icons';
import { ButtonOutline, Select, SelectOption, BodyS } from '@archie-webapps/shared/ui/design-system';

import { useDownloadStatement } from './use-download-statement';

interface StatementDownloadProps {
  statements: Statement[];
}

export const StatementDownload: FC<StatementDownloadProps> = ({ statements }) => {
  const { t } = useTranslation();

  const [selectedStatement, setSelectedStatement] = useState<Statement>(statements[0]);

  const { isLoading, downloadDocument } = useDownloadStatement(selectedStatement.documentDescriptorId);

  const header = (
    <BodyS>
      {selectedStatement.billingCycleStartDate} - {selectedStatement.billingCycleEndDate}
    </BodyS>
  );

  const options = statements.map((statement) => (
    <SelectOption key={statement.id} value={statement}>
      {statement.billingCycleStartDate} - {statement.billingCycleEndDate}
    </SelectOption>
  ));

  return (
    <>
      <Select
        id="statements"
        small
        minWidth="240px"
        header={header}
        onChange={(statement: Statement) => setSelectedStatement(statement)}
      >
        {options}
      </Select>
      <ButtonOutline small maxWidth="175px" isLoading={isLoading} onClick={downloadDocument}>
        {t('dashboard_history.statements_download')} <Icon name="download" />
      </ButtonOutline>
    </>
  );
};
