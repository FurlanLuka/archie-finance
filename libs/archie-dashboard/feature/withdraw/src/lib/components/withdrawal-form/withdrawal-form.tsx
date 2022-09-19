import { yupResolver } from '@hookform/resolvers/yup';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { calculateCollateralCreditValue, calculateCollateralTotalValue } from '@archie-webapps/archie-dashboard/utils';
import { CollateralAssets } from '@archie-webapps/shared/constants';
import { CollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-collateral-value';
import { useCreateWithdrawal } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-create-withdrawal';
import { getMaxWithdrawalAmountQueryKey } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-get-max-withdrawal-amount';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { ButtonOutline, ButtonPrimary, InputText, BodyM } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { SuccessfullWithdrawalModal } from '../modals/successfull-withdrawal/successfull-withdrawal';

import { getUpdatedCreditAndTotal } from './withdrawal-form.helpers';
import { getWithdrawSchema } from './withdrawal-form.schema';
import { WithdrawalFormStyled } from './withdrawal-form.styled';

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
  const createWithdrawal = useCreateWithdrawal();
  const WithdrawSchema = getWithdrawSchema(maxAmount);
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isValid },
  } = useForm<WithdrawFormData>({
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      withdrawAmount: maxAmount,
      withdrawAddress: '',
    },
    resolver: yupResolver(WithdrawSchema),
  });

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    if (createWithdrawal.state === RequestState.SUCCESS) {
      setIsSuccessModalOpen(true);
      // Invalidate max withdrawal amount query so it refetches
      queryClient.invalidateQueries(getMaxWithdrawalAmountQueryKey(currentAsset));
    }
  }, [createWithdrawal.state]);

  const withdrawalAmount = watch('withdrawAmount');
  const depositAddress = watch('withdrawAddress');

  const initialCreditValue = calculateCollateralCreditValue(collateral);
  const initialCollateralValue = calculateCollateralTotalValue(collateral);

  const { updatedCollateralValue, updatedCreditValue } = getUpdatedCreditAndTotal({
    asset: currentAsset,
    collateral,
    withdrawalAmount,
  });

  const onSubmit = handleSubmit((data) => {
    if (createWithdrawal.state === RequestState.IDLE) {
      createWithdrawal.mutate({
        asset: currentAsset,
        withdrawalAmount: data.withdrawAmount,
        destinationAddress: data.withdrawAddress,
      });
    }
  });

  return (
    <>
      <WithdrawalFormStyled onSubmit={onSubmit}>
        <InputText>
          <label htmlFor="withdrawAmount">
            {maxAmount > 0
              ? t('dashboard_withdraw.form.amount_label', { currentAsset, maxAmount })
              : t('dashboard_withdraw.form.amount_label_empty', { currentAsset })}
          </label>
          <input
            id="withdrawAmount"
            type="number"
            step="any"
            min={0}
            max={maxAmount}
            disabled={maxAmount <= 0}
            {...register('withdrawAmount', { valueAsNumber: true })}
          />
          {errors.withdrawAmount?.message && (
            <BodyM className="error" color={theme.textDanger}>
              {t(errors.withdrawAmount.message, { maxAmount })}
            </BodyM>
          )}
          {withdrawalAmount > 0 && withdrawalAmount <= maxAmount && (
            <BodyM color={theme.textSecondary} weight={500} className="credit-limit">
              {t('dashboard_withdraw.form.credit_change', {
                initialCollateralValue: initialCollateralValue.toFixed(2),
                initialCreditValue: initialCreditValue.toFixed(2),
                updatedCollateralValue: updatedCollateralValue.toFixed(2),
                updatedCreditValue: updatedCreditValue.toFixed(2),
              })}
            </BodyM>
          )}
        </InputText>
        <div className="address">
          <div className="address-title">
            <BodyM weight={700}>{t('dashboard_withdraw.address_title', { currentAsset })}</BodyM>
          </div>
          <div className="address-input">
            <label htmlFor="withdrawAddress">
              <BodyM weight={700}>{t('dashboard_withdraw.form.address_label', { currentAsset })}</BodyM>
            </label>
            <input
              id="withdrawAddress"
              placeholder={t('dashboard_withdraw.form.address_placeholder')}
              disabled={maxAmount <= 0}
              {...register('withdrawAddress')}
            />
            {errors.withdrawAddress?.message && (
              <BodyM className="error" color={theme.textDanger}>
                {t(errors.withdrawAddress.message)}
              </BodyM>
            )}
          </div>
        </div>
        <div className="btn-group">
          <ButtonOutline onClick={() => navigate('/collateral')}>{t('btn_cancel')}</ButtonOutline>
          <ButtonPrimary isDisabled={!isValid} isLoading={createWithdrawal.state === RequestState.LOADING}>
            {t('dashboard_withdraw.btn')}
          </ButtonPrimary>
        </div>
      </WithdrawalFormStyled>
      {isSuccessModalOpen && (
        <SuccessfullWithdrawalModal
          addressLink={`${CollateralAssets[currentAsset]?.url}/${depositAddress}`}
          onConfirm={() => setIsSuccessModalOpen(false)}
        />
      )}
    </>
  );
};
