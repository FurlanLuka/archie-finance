import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useCreateCreditLine } from '@archie-webapps/shared/data-access/archie-api/credit/hooks/use-create-credit-line';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { Toast, ToastList, ParagraphXS, ButtonLight } from '@archie-webapps/shared/ui/design-system';

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
    <ToastList>
      <Toast>
        <ParagraphXS weight={700}>
          {t('collateral_credit_line_popup.text', {
            collateral: collateralText,
            creditValue: creditValue.toFixed(2),
          })}
        </ParagraphXS>
        <div className="btn-group">
          <ButtonLight small maxWidth="fit-content" onClick={handleClick}>
            {t('btn_continue')}
          </ButtonLight>
        </div>
      </Toast>
    </ToastList>
  );
};
