import BigNumber from 'bignumber.js';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { MIN_LINE_OF_CREDIT } from '@archie-microservices/ui/dashboard/constants';
import {
  ButtonPrimary,
  Modal,
  TitleS,
  BodyM,
} from '@archie-microservices/ui/shared/ui/design-system';

import imgNotEnoughCollateral from '../../../../assets/img-not-enough-collateral.png';

import { NotEnoughCollateralModalStyled } from './not-enough-collateral.styled';

interface NotEnoughCollateralModalProps {
  onClose: () => void;
  creditValue: string;
}

export const NotEnoughCollateralModal: FC<NotEnoughCollateralModalProps> = ({
  onClose,
  creditValue,
}) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={true} maxWidth="800px">
      <NotEnoughCollateralModalStyled>
        <div className="image">
          <img
            src={imgNotEnoughCollateral}
            alt={t('not_enough_collateral_modal.img_alt')}
          />
        </div>
        <div className="content">
          <TitleS className="modal-title">
            {t('not_enough_collateral_modal.title')}
          </TitleS>
          <BodyM className="modal-text">
            {t('not_enough_collateral_modal.text', {
              creditValue: creditValue,
              minValue: MIN_LINE_OF_CREDIT,
              difference: BigNumber(MIN_LINE_OF_CREDIT)
                .minus(creditValue)
                .decimalPlaces(2, BigNumber.ROUND_DOWN)
                .toString(),
            })}
          </BodyM>
          <ButtonPrimary onClick={onClose}>
            {t('not_enough_collateral_modal.btn')}
          </ButtonPrimary>
        </div>
      </NotEnoughCollateralModalStyled>
    </Modal>
  );
};
