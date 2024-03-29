import BigNumber from 'bignumber.js';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { MIN_LINE_OF_CREDIT } from '@archie/ui/dashboard/constants';
import { Toast, ToastList, BodyM } from '@archie/ui/shared/design-system';

interface NotEnoughCollateralProps {
  creditValue: string;
}

export const NotEnoughCollateral: FC<NotEnoughCollateralProps> = ({
  creditValue,
}) => {
  const { t } = useTranslation();

  return (
    <ToastList>
      <Toast>
        <BodyM weight={700}>
          {t('not_enough_collateral_toast.text', {
            creditValue: creditValue,
            difference: BigNumber(MIN_LINE_OF_CREDIT)
              .minus(creditValue)
              .decimalPlaces(2, BigNumber.ROUND_DOWN)
              .toString(),
          })}
        </BodyM>
      </Toast>
    </ToastList>
  );
};
