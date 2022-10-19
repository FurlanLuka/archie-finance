import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useRemoveAutopay } from '@archie/ui/shared/data-access/archie-api/autopay/hooks/use-remove-autopay';
import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import {
  BodyM,
  ButtonPrimary,
  TitleS,
} from '@archie/ui/shared/ui/design-system';

import { AutopayRemoveStyled } from './autopay-remove.styled';

interface AutopayRemoveProps {
  close: VoidFunction;
}

export const AutopayRemove: FC<AutopayRemoveProps> = ({ close }) => {
  const { t } = useTranslation();
  const removeAutopayMutation = useRemoveAutopay();

  const handleConfirmClick = () => {
    if (removeAutopayMutation.state === RequestState.IDLE) {
      removeAutopayMutation.mutate({});
    }
  };

  useEffect(() => {
    if (removeAutopayMutation.state === RequestState.SUCCESS) {
      close();
    }
  }, [close, removeAutopayMutation.state]);

  return (
    <AutopayRemoveStyled>
      <TitleS className="modal-title">{t('autopay_modal.remove.title')}</TitleS>
      <BodyM className="modal-text">{t('autopay_modal.remove.text')}</BodyM>
      <ButtonPrimary
        width="10rem"
        onClick={handleConfirmClick}
        isLoading={removeAutopayMutation.state === RequestState.LOADING}
        disabled={removeAutopayMutation.state !== RequestState.IDLE}
      >
        {t('autopay_modal.remove.btn_confirm')}
      </ButtonPrimary>
    </AutopayRemoveStyled>
  );
};
