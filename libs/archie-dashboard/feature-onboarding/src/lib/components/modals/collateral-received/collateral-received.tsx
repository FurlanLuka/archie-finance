import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetAssetPrice } from '@archie-webapps/shared/data-access-archie-api/asset_price/hooks/use-get-asset-price';
import { Collateral } from '@archie-webapps/shared/data-access-archie-api/collateral/api/get-collateral';
import { RequestState } from '@archie-webapps/shared/data-access-archie-api/interface';
import {
  ButtonPrimary,
  ButtonOutline,
  Modal,
  ParagraphM,
  ParagraphXS,
  Loading,
} from '@archie-webapps/ui-design-system';

import imgCollateralReceived from '../../../../assets/img-collateral-received.png';
import { calculateCollateralValue, formatEntireCollateral } from '../../../helpers/collateral';

import { CollateralReceivedModalStyled } from './collateral-received.styled';
import { useCreateCreditLine } from '@archie-webapps/shared/data-access-archie-api/credit/hooks/use-create-credit-line';

interface CollateralReceivedModalProps {
  onClose: () => void;
  onConfirm: () => void;
  collateral: Collateral[];
}

export const CollateralReceivedModal: FC<CollateralReceivedModalProps> = ({ onClose, onConfirm, collateral }) => {
  const { t } = useTranslation();
  const getAssetPriceResponse = useGetAssetPrice();
  const createCreditLine = useCreateCreditLine();

  const handleConfirm = () => {
    if (createCreditLine.state === RequestState.IDLE) {
      createCreditLine.mutate({});
    }
    onConfirm();
  };

  function getModalContent() {
    switch (getAssetPriceResponse.state) {
      case RequestState.LOADING:
        return <Loading />;
      case RequestState.SUCCESS:
        return (
          <ParagraphXS>
            {t('collateral_received_modal.text', {
              collateral: formatEntireCollateral(collateral),
              credit_value: calculateCollateralValue(collateral, getAssetPriceResponse.data),
            })}
          </ParagraphXS>
        );
      default:
        return null;
    }
  }

  return (
    <Modal isOpen={true} close={onClose} maxWidth="800px">
      <CollateralReceivedModalStyled>
        <div className="image">
          <img src={imgCollateralReceived} alt={t('collateral_received_modal.img_alt')} />
        </div>
        <div className="content">
          <ParagraphM weight={700}>{t('collateral_received_modal.title')}</ParagraphM>
          {getModalContent()}
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
