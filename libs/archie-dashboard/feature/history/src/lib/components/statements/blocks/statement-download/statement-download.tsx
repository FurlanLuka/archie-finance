import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Statement } from '@archie-webapps/shared/data-access/archie-api/payment/api/get-statements';
import { BodyS, ButtonPrimary, Select, SelectOption } from '@archie-webapps/shared/ui/design-system';

import { useDownloadStatement } from './use-download-statement';

interface StatementDownloadProps {
  statements: Statement[];
}

export const StatementDownload: FC<StatementDownloadProps> = ({ statements }) => {
  const { t } = useTranslation();
  const [selectedStatement, setSelectedStatement] = useState<Statement>(statements[0]);
  const { isLoading, downloadDocument } = useDownloadStatement(selectedStatement.documentDescriptorId);

  const options = statements.map((statement) => (
    <SelectOption key={statement.id} value={statement}>
      {statement.billingCycleStartDate} - {statement.billingCycleEndDate}
    </SelectOption>
  ));

  const header = (
    <BodyS>
      {selectedStatement.billingCycleStartDate} - ${selectedStatement.billingCycleEndDate}
    </BodyS>
  );

  return (
    <>
      <Select
        id="statements"
        header={header}
        onChange={(s: Statement) => {
          setSelectedStatement(s);
        }}
      >
        {options}
      </Select>
      <ButtonPrimary isLoading={isLoading} onClick={downloadDocument}>
        {t('dashboard_history.statements_download')}
      </ButtonPrimary>
    </>
  );
};
