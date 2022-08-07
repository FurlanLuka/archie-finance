import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { MIN_LINE_OF_CREDIT } from '@archie-webapps/archie-dashboard/constants';
import { ButtonPrimary, Modal, ParagraphM, ParagraphXS } from '@archie-webapps/shared/ui/design-system';

import imgNotEnoughCollateral from '../../../../assets/img-not-enough-collateral.png';

import { NotEnoughCollateralModalStyled } from './not-enough-collateral.styled';

interface NotEnoughCollateralModalProps {
  onClose: () => void;
  collateralText: string;
  creditValue: number;
}

export const NotEnoughCollateralModal: FC<NotEnoughCollateralModalProps> = ({
  onClose,
  collateralText,
  creditValue,
}) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={true} maxWidth="800px">
      <NotEnoughCollateralModalStyled>
        <div className="image">
          <img src={imgNotEnoughCollateral} alt={t('not_enough_collateral_modal.img_alt')} />
        </div>
        <div className="content">
          <ParagraphM weight={700}>{t('not_enough_collateral_modal.title')}</ParagraphM>
          <ParagraphXS>
            {t('not_enough_collateral_modal.text', {
              collateral: collateralText,
              credit_value: creditValue,
              min_value: MIN_LINE_OF_CREDIT,
              difference: MIN_LINE_OF_CREDIT - creditValue,
            })}
          </ParagraphXS>
          <ButtonPrimary onClick={onClose} maxWidth="fit-content">
            {t('not_enough_collateral_modal.btn')}
          </ButtonPrimary>
        </div>
      </NotEnoughCollateralModalStyled>
    </Modal>
  );
};
