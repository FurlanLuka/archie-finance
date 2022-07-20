import { yupResolver } from '@hookform/resolvers/yup';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ButtonOutline, ButtonPrimary, InputText, ParagraphXS } from '@archie-webapps/ui-design-system';
import { theme } from '@archie-webapps/ui-theme';

import { SuccessfullWithdrawalModal } from '../modals/successfull-withdrawal/successfull-withdrawal';

import { WithdrawSchema } from './withdrawal-form.schema';
import * as Styled from './withdrawal-form.styled';

interface WithdrawFormData {
  withdrawAmount: string;
  withdrawAddress: string;
}

interface WithdrawalFormProps {
  currentAsset: string;
  maxAmount: number;
}
export const WithdrawalForm: FC<WithdrawalFormProps> = ({ currentAsset, maxAmount }) => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [successfullWithdrawalModalOpen, setSuccessfullWithdrawalModalOpen] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { isDirty, errors },
  } = useForm<WithdrawFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      withdrawAmount: '',
      withdrawAddress: '',
    },
    resolver: yupResolver(WithdrawSchema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    setSuccessfullWithdrawalModalOpen(true);
  });

  // Temp data
  const creditLine = '$4,564.34';
  const maxWithdrawAmount = 0.123456;

  return (
    <>
      <Styled.WithdrawalForm onSubmit={onSubmit}>
        <InputText>
          {t('dashboard_withdraw.label.amount', { currentAsset })}
          <input
            placeholder={t('dashboard_withdraw.placeholder.amount', { maxWithdrawAmount, currentAsset })}
            {...register('withdrawAmount')}
          />
          {errors.withdrawAmount?.message && (
            <ParagraphXS className="error" color={theme.textDanger}>
              {t(errors.withdrawAmount.message)}
            </ParagraphXS>
          )}
          <ParagraphXS color={theme.textSecondary} weight={500} className="credit-limit">
            Withdrawing this amount will reduce your Archie Collateral from $4,564.34 to $4,124. This reduces your
            credit limit from $3,424 to $3,093. {/*  TBD */}
          </ParagraphXS>
        </InputText>
        <div className="address">
          <div className="address-title">
            <ParagraphXS weight={700}>{t('dashboard_withdraw.address_title', { currentAsset })}</ParagraphXS>
          </div>
          <div className="address-input">
            <ParagraphXS weight={700}>{t('dashboard_withdraw.label.address', { currentAsset })}</ParagraphXS>
            <input placeholder={t('dashboard_withdraw.placeholder.address')} {...register('withdrawAddress')} />
            {errors.withdrawAddress?.message && (
              <ParagraphXS className="error" color={theme.textDanger}>
                {t(errors.withdrawAddress.message)}
              </ParagraphXS>
            )}
          </div>
        </div>
        <div className="btn-group">
          <ButtonOutline maxWidth="fit-content" onClick={() => navigate('/collateral')}>
            {t('btn_cancel')}
          </ButtonOutline>
          <ButtonPrimary maxWidth="fit-content" isDisabled={!isDirty}>
            {t('dashboard_withdraw.btn')}
          </ButtonPrimary>
        </div>
      </Styled.WithdrawalForm>
      <SuccessfullWithdrawalModal
        isOpen={successfullWithdrawalModalOpen}
        close={() => setSuccessfullWithdrawalModalOpen(false)}
        onConfirm={() => console.log('confirmed')}
      />
    </>
  );
};
