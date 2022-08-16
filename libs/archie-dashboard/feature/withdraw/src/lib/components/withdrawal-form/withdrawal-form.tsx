import { yupResolver } from '@hookform/resolvers/yup';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { calculateCollateralCreditValue, calculateCollateralTotalValue } from '@archie-webapps/archie-dashboard/utils';
import { CollateralAssets } from '@archie-webapps/shared/constants';
import { CollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-collateral-value';
import { useCreateWithdrawal } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-create-withdrawal';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { ButtonOutline, ButtonPrimary, InputText, ParagraphXS } from '@archie-webapps/shared/ui/design-system';
import { theme } from '@archie-webapps/shared/ui/theme';

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
  const createWithdrawal = useCreateWithdrawal();
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
      withdrawAmount: maxAmount,
      withdrawAddress: '',
    },
    resolver: yupResolver(WithdrawSchema),
  });

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    if (createWithdrawal.state === RequestState.SUCCESS) {
      setIsSuccessModalOpen(true);
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
      <Styled.WithdrawalForm onSubmit={onSubmit}>
        <InputText>
          <label htmlFor="withdrawAmount">
            {t('dashboard_withdraw.form.amount_label', { currentAsset, maxAmount })}
          </label>
          <input
            id="withdrawAmount"
            placeholder={t('dashboard_withdraw.form.amount_placeholder', {
              maxWithdrawAmount: maxAmount,
              currentAsset,
            })}
            type="number"
            step="any"
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
                initialCollateralValue: initialCollateralValue.toFixed(2),
                initialCreditValue: initialCreditValue.toFixed(2),
                updatedCollateralValue: updatedCollateralValue.toFixed(2),
                updatedCreditValue: updatedCreditValue.toFixed(2),
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
          <ButtonPrimary
            maxWidth="fit-content"
            isDisabled={!isValid}
            isLoading={createWithdrawal.state === RequestState.LOADING}
          >
            {t('dashboard_withdraw.btn')}
          </ButtonPrimary>
        </div>
      </Styled.WithdrawalForm>
      {isSuccessModalOpen && (
        <SuccessfullWithdrawalModal
          addressLink={`${CollateralAssets[currentAsset]?.url}/${depositAddress}`}
          onConfirm={() => {
            setIsSuccessModalOpen(false);
            navigate('/collateral');
          }}
        />
      )}
    </>
  );
};
