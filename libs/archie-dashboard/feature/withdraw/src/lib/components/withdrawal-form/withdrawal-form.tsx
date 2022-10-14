import { yupResolver } from '@hookform/resolvers/yup';
import { BigNumber } from 'bignumber.js';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { calculateLedgerCreditValue } from '@archie-webapps/archie-dashboard/utils';
import { CollateralAssets } from '@archie-webapps/shared/constants';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { Ledger } from '@archie-webapps/shared/data-access/archie-api/ledger/api/get-ledger';
import { useCreateWithdrawal } from '@archie-webapps/shared/data-access/archie-api/ledger/hooks/use-create-withdrawal';
import { getMaxWithdrawalAmountQueryKey } from '@archie-webapps/shared/data-access/archie-api/ledger/hooks/use-get-max-withdrawal-amount';
import { ButtonOutline, ButtonPrimary, InputText, BodyM } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

import { SuccessfullWithdrawalModal } from '../modals/successfull-withdrawal/successfull-withdrawal';

import { getUpdatedCreditAndTotal } from './withdrawal-form.helpers';
import { getWithdrawSchema } from './withdrawal-form.schema';
import { WithdrawalFormStyled } from './withdrawal-form.styled';

interface WithdrawFormData {
  withdrawAmount: string;
  withdrawAddress: string;
}

interface WithdrawalFormProps {
  currentAsset: string;
  ledger: Ledger;
  maxAmount: string;
}

export const WithdrawalForm: FC<WithdrawalFormProps> = ({ currentAsset, ledger, maxAmount }) => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const createWithdrawal = useCreateWithdrawal();
  const maxAmountBN = BigNumber(maxAmount);
  const WithdrawSchema = getWithdrawSchema(maxAmountBN);
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

  const initialCreditValue = calculateLedgerCreditValue(ledger.accounts);

  const { updatedLedgerValue, updatedCreditValue } = getUpdatedCreditAndTotal({
    asset: currentAsset,
    ledgerAccounts: ledger.accounts,
    withdrawalAmount,
  });

  const onSubmit = handleSubmit((data) => {
    if (createWithdrawal.state === RequestState.IDLE) {
      createWithdrawal.mutate({
        assetId: currentAsset,
        amount: data.withdrawAmount,
        destinationAddress: data.withdrawAddress,
      });
    }
  });

  return (
    <>
      <WithdrawalFormStyled onSubmit={onSubmit}>
        <InputText>
          <label htmlFor="withdrawAmount">
            {maxAmountBN.isGreaterThan(0)
              ? t('dashboard_withdraw.form.amount_label', { currentAsset, maxAmount })
              : t('dashboard_withdraw.form.amount_label_empty', { currentAsset })}
          </label>
          <input
            id="withdrawAmount"
            type="tel"
            step="any"
            pattern="^\d+((.)|(.\d{0,18})?)$"
            disabled={maxAmountBN.isLessThanOrEqualTo(0)}
            {...register('withdrawAmount', { valueAsNumber: false })}
          />
          {errors.withdrawAmount?.message && (
            <BodyM className="error" color={theme.textDanger}>
              {t(errors.withdrawAmount.message, { maxAmount })}
            </BodyM>
          )}
          {maxAmountBN.isGreaterThan(0) && maxAmountBN.isGreaterThanOrEqualTo(withdrawalAmount) && (
            <BodyM color={theme.textSecondary} weight={500} className="credit-limit">
              {t('dashboard_withdraw.form.credit_change', {
                initialCollateralValue: ledger.value,
                initialCreditValue: initialCreditValue,
                updatedCollateralValue: updatedLedgerValue,
                updatedCreditValue: updatedCreditValue,
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
              disabled={maxAmountBN.isLessThanOrEqualTo(0)}
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
