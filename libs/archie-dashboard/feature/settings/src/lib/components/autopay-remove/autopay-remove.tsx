import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useRemoveAutopay } from '@archie-webapps/shared/data-access/archie-api/autopay/hooks/use-remove-autopay';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { BodyM, ButtonPrimary, TitleS } from '@archie-webapps/shared/ui/design-system';

import { AutopayRemoveStyled } from './autopay-remove.styled';

interface AutopayRemoveModalProps {
  close: VoidFunction;
}

export const AutopayRemoveModal: FC<AutopayRemoveModalProps> = ({ close }) => {
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
      <TitleS>{t('autopay_modal.remove.title')}</TitleS>
      <BodyM className="text-body">{t('autopay_modal.remove.body')}</BodyM>
      <ButtonPrimary
        onClick={handleConfirmClick}
        isLoading={removeAutopayMutation.state === RequestState.LOADING}
        disabled={removeAutopayMutation.state !== RequestState.IDLE}
      >
        {t('autopay_modal.remove.btn_confirm')}
      </ButtonPrimary>
    </AutopayRemoveStyled>
  );
};
