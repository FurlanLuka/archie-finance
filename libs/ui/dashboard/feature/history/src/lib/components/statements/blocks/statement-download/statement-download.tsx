import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Statement } from '@archie/api/peach-api/data-transfer-objects/types';
import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetStatementDocument } from '@archie/ui/shared/data-access/archie-api/payment/hooks/use-get-statement-document';
import {
  ButtonOutline,
  Select,
  SelectOption,
  BodyM,
  BodyS,
} from '@archie/ui/shared/design-system';
import { Icon } from '@archie/ui/shared/icons';
import { theme } from '@archie/ui/shared/theme';

import { StatementDocumentLink } from './statement-download.styled';

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

  const getStatementDocumentResponse = useGetStatementDocument(
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

  // TODO add link to design system and stop using button
  const getDownloadLink = () => {
    if (getStatementDocumentResponse.state === RequestState.LOADING) {
      return (
        <ButtonOutline small width="175px" isLoading>
          {t('dashboard_history.btn_statements')}{' '}
          <Icon name="download" fill={theme.textDisabled} />
        </ButtonOutline>
      );
    }

    if (getStatementDocumentResponse.state === RequestState.SUCCESS) {
      return (
        <StatementDocumentLink
          href={getStatementDocumentResponse.data.url}
          download
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('dashboard_history.btn_statements')}{' '}
          <Icon name="download" fill={theme.textHighlight} />
        </StatementDocumentLink>
      );
    }

    return (
      <ButtonOutline small width="175px" isDisabled>
        {t('dashboard_history.btn_statements')}{' '}
        <Icon name="download" fill={theme.textDisabled} />
      </ButtonOutline>
    );
  };

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
      {getDownloadLink()}
    </>
  );
};
