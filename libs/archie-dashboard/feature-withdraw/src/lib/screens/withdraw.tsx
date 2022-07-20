import { yupResolver } from '@hookform/resolvers/yup';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  ButtonOutline,
  ButtonPrimary,
  Card,
  InputText,
  ParagraphM,
  ParagraphS,
  ParagraphXS,
} from '@archie-webapps/ui-design-system';
import { theme } from '@archie-webapps/ui-theme';

import { SuccessfullWithdrawalModal } from '../components/modals/successfull-withdrawal/successfull-withdrawal';

import { WithdrawSchema } from './withdraw-form.schema';
import { WithdrawStyled } from './withdraw.styled';

interface WithdrawFormData {
  withdrawAmount: string;
  withdrawAddress: string;
}

export const WithdrawScreen: FC = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();
  const currentAsset = location.pathname.slice(location.pathname.lastIndexOf('/') + 1);

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
    <WithdrawStyled>
      <Card column alignItems="center" padding="2.5rem 1.5rem 3.5rem">
        <ParagraphM weight={800} className="title">
          {t('dashboard_withdraw.title', { currentAsset })}
        </ParagraphM>
        <ParagraphS className="subtitle">{t('dashboard_withdraw.subtitle', { creditLine })}</ParagraphS>
        <div className="section-form">
          <form onSubmit={onSubmit}>
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
                <ParagraphXS weight={700}>
                  {t('dashboard_withdraw.label.address', { withdrawAmount: 0.12, currentAsset })}
                </ParagraphXS>
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
          </form>
        </div>
        <SuccessfullWithdrawalModal
          isOpen={successfullWithdrawalModalOpen}
          close={() => setSuccessfullWithdrawalModalOpen(false)}
          onConfirm={() => console.log('confirmed')}
        />
      </Card>
    </WithdrawStyled>
  );
};
