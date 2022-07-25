import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useCreateCreditLine } from '@archie-webapps/shared/data-access-archie-api/credit/hooks/use-create-credit-line';
import { RequestState } from '@archie-webapps/shared/data-access-archie-api/interface';
import { ButtonPrimary, ButtonOutline, Modal, ParagraphM, ParagraphXS } from '@archie-webapps/shared/ui/design-system';

import imgCollateralReceived from '../../../../assets/img-collateral-received.png';

import { CollateralReceivedModalStyled } from './collateral-received.styled';

interface CollateralReceivedModalProps {
  onClose: () => void;
  onConfirm: () => void;
  collateralText: string;
  creditValue: number;
}

export const CollateralReceivedModal: FC<CollateralReceivedModalProps> = ({
  onClose,
  onConfirm,
  collateralText,
  creditValue,
}) => {
  const { t } = useTranslation();
  const createCreditLine = useCreateCreditLine();

  const handleConfirm = () => {
    if (createCreditLine.state === RequestState.IDLE) {
      createCreditLine.mutate({});
    }
    onConfirm();
  };

  return (
    <Modal isOpen={true} maxWidth="800px">
      <CollateralReceivedModalStyled>
        <div className="image">
          <img src={imgCollateralReceived} alt={t('collateral_received_modal.img_alt')} />
        </div>
        <div className="content">
          <ParagraphM weight={700}>{t('collateral_received_modal.title')}</ParagraphM>
          <ParagraphXS>
            {t('collateral_received_modal.text', {
              collateral: collateralText,
              credit_value: creditValue,
            })}
          </ParagraphXS>
          <div className="btn-group">
            <ButtonPrimary onClick={onClose} maxWidth="fit-content">
              {t('collateral_received_modal.btn')}
            </ButtonPrimary>
            <ButtonOutline onClick={handleConfirm} maxWidth="fit-content">
              {t('btn_next')}
            </ButtonOutline>
          </div>
        </div>
      </CollateralReceivedModalStyled>
    </Modal>
  );
};
