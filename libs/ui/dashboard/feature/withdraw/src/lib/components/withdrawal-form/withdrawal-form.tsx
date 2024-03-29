import { yupResolver } from '@hookform/resolvers/yup';
import { BigNumber } from 'bignumber.js';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Ledger } from '@archie/api/ledger-api/data-transfer-objects/types';
import { calculateLedgerCreditValue } from '@archie/ui/dashboard/utils';
import { CollateralAssets } from '@archie/ui/shared/constants';
import { MutationState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useCreateWithdrawal } from '@archie/ui/shared/data-access/archie-api/ledger/hooks/use-create-withdrawal';
import {
  ButtonOutline,
  ButtonPrimary,
  InputText,
  BodyM,
} from '@archie/ui/shared/design-system';
import { theme } from '@archie/ui/shared/theme';

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

export const WithdrawalForm: FC<WithdrawalFormProps> = ({
  currentAsset,
  ledger,
  maxAmount,
}) => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const createWithdrawal = useCreateWithdrawal();
  const maxAmountBN = BigNumber(maxAmount);
  const WithdrawSchema = getWithdrawSchema(maxAmountBN);

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
    if (createWithdrawal.state === MutationState.SUCCESS) {
      setIsSuccessModalOpen(true);
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
    if (createWithdrawal.state === MutationState.IDLE) {
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
              ? t('dashboard_withdraw.form.amount_label', {
                  currentAsset,
                  maxAmount,
                })
              : t('dashboard_withdraw.form.amount_label_empty', {
                  currentAsset,
                })}
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
          {maxAmountBN.isGreaterThan(0) &&
            maxAmountBN.isGreaterThanOrEqualTo(withdrawalAmount) && (
              <BodyM
                color={theme.textSecondary}
                weight={500}
                className="credit-limit"
              >
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
            <BodyM weight={700}>
              {t('dashboard_withdraw.address_title', { currentAsset })}
            </BodyM>
          </div>
          <div className="address-input">
            <label htmlFor="withdrawAddress">
              <BodyM weight={700}>
                {t('dashboard_withdraw.form.address_label', { currentAsset })}
              </BodyM>
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
          <ButtonOutline onClick={() => navigate('/collateral')}>
            {t('btn_cancel')}
          </ButtonOutline>
          <ButtonPrimary
            isDisabled={!isValid}
            isLoading={createWithdrawal.state === MutationState.LOADING}
          >
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
