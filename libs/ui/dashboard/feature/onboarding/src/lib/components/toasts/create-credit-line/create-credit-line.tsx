import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useCreateCreditLine } from '@archie/ui/shared/data-access/archie-api/credit_line/hooks/use-create-credit-line';
import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import {
  Toast,
  ToastList,
  ButtonLight,
  BodyM,
} from '@archie/ui/shared/design-system';

interface CreateCreditLineProps {
  collateralText: string;
  creditValue: string;
}

export const CreateCreditLine: FC<CreateCreditLineProps> = ({
  collateralText,
  creditValue,
}) => {
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
        <BodyM weight={700}>
          {t('collateral_credit_line_toast.text', {
            collateral: collateralText,
            creditValue: creditValue,
          })}
        </BodyM>
        <div className="btn-group">
          <ButtonLight small onClick={handleClick}>
            {t('btn_continue')}
          </ButtonLight>
        </div>
      </Toast>
    </ToastList>
  );
};
