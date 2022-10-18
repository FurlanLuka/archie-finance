import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Statement } from '@archie-webapps/shared/data-access/archie-api/payment/api/get-statements';
import { theme } from '@archie-webapps/shared/ui/theme';
import { Icon } from '@archie-webapps/shared/ui/icons';
import {
  ButtonOutline,
  Select,
  SelectOption,
  BodyM,
  BodyS,
} from '@archie-webapps/shared/ui/design-system';

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
        {t('dashboard_history.btn_statements')} <Icon name="download" />
      </ButtonOutline>
    </>
  );
};
