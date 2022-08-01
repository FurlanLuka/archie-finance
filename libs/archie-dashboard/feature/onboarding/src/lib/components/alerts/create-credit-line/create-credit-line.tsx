import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useCreateCreditLine } from '@archie-webapps/shared/data-access/archie-api/credit/hooks/use-create-credit-line';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { ButtonLight, ParagraphXS } from '@archie-webapps/shared/ui/design-system';

import { CreateCreditLineStyled } from './create-credit-line.styled';

interface CreateCreditLineProps {
  collateralText: string;
  creditValue: number;
}

export const CreateCreditLine: FC<CreateCreditLineProps> = ({ collateralText, creditValue }) => {
  const createCreditLine = useCreateCreditLine();
  const { t } = useTranslation();

  const handleClick = () => {
    if (createCreditLine.state === RequestState.IDLE) {
      createCreditLine.mutate({});
    }
  };

  return (
    <CreateCreditLineStyled>
      <ParagraphXS weight={700} className="text">
        {t('collateral_credit_line_popup.text', {
          collateral: collateralText,
          credit_value: creditValue,
        })}
      </ParagraphXS>
      <ButtonLight small maxWidth="fit-content" onClick={handleClick}>
        {t('collateral_credit_line_popup.button_text')}
      </ButtonLight>
    </CreateCreditLineStyled>
  );
};
