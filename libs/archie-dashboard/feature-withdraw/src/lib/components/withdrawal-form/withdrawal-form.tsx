import { yupResolver } from '@hookform/resolvers/yup';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { CollateralValue } from '@archie-webapps/shared/data-access-archie-api/collateral/api/get-collateral-value';
import { ButtonOutline, ButtonPrimary, InputText, ParagraphXS } from '@archie-webapps/ui-design-system';
import { theme } from '@archie-webapps/ui-theme';

import { calculateCollateralCreditValue, calculateCollateralTotalValue } from '../../helpers/collateral';
import { SuccessfullWithdrawalModal } from '../modals/successfull-withdrawal/successfull-withdrawal';

import { getUpdatedCreditAndTotal } from './withdrawal-form.helpers';
import { getWithdrawSchema } from './withdrawal-form.schema';
import * as Styled from './withdrawal-form.styled';

interface WithdrawFormData {
  withdrawAmount: number;
  withdrawAddress: string;
}

interface WithdrawalFormProps {
  currentAsset: string;
  collateral: CollateralValue[];
  maxAmount: number;
}
export const WithdrawalForm: FC<WithdrawalFormProps> = ({ currentAsset, collateral, maxAmount }) => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [successfullWithdrawalModalOpen, setSuccessfullWithdrawalModalOpen] = useState(false);
  const WithdrawSchema = getWithdrawSchema(maxAmount);

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isValid },
  } = useForm<WithdrawFormData>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      withdrawAmount: 0,
      withdrawAddress: '',
    },
    resolver: yupResolver(WithdrawSchema),
  });

  const withdrawalAmount = watch('withdrawAmount');
  console.log('dvigamo', withdrawalAmount);

  const initialCreditValue = calculateCollateralCreditValue(collateral);
  const initialCollateralValue = calculateCollateralTotalValue(collateral);

  const { updatedCollateralValue, updatedCreditValue } = getUpdatedCreditAndTotal({
    asset: currentAsset,
    collateral,
    withdrawalAmount,
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    setSuccessfullWithdrawalModalOpen(true);
  });

  return (
    <>
      <Styled.WithdrawalForm onSubmit={onSubmit}>
        <InputText>
          <input
            placeholder={t('dashboard_withdraw.form.amount_placeholder', {
              maxWithdrawAmount: maxAmount,
              currentAsset,
            })}
            type="number"
            defaultValue={0}
            min={0}
            max={maxAmount}
            {...register('withdrawAmount')}
          />
          {errors.withdrawAmount?.message && (
            <ParagraphXS className="error" color={theme.textDanger}>
              {t(errors.withdrawAmount.message)}
            </ParagraphXS>
          )}
          {withdrawalAmount > 0 && withdrawalAmount <= maxAmount && (
            <ParagraphXS color={theme.textSecondary} weight={500} className="credit-limit">
              {t('dashboard_withdraw.form.credit_change', {
                initialCollateralValue,
                initialCreditValue,
                updatedCollateralValue,
                updatedCreditValue,
              })}
            </ParagraphXS>
          )}
        </InputText>
        <div className="address">
          <div className="address-title">
            <ParagraphXS weight={700}>{t('dashboard_withdraw.address_title', { currentAsset })}</ParagraphXS>
          </div>
          <div className="address-input">
            <label htmlFor="withdrawAddress">
              <ParagraphXS weight={700}>{t('dashboard_withdraw.form.address_label', { currentAsset })}</ParagraphXS>
            </label>
            <input
              id="withdrawAddress"
              placeholder={t('dashboard_withdraw.form.address_placeholder')}
              {...register('withdrawAddress')}
            />
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
          <ButtonPrimary maxWidth="fit-content" isDisabled={!isValid}>
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
