import { yupResolver } from '@hookform/resolvers/yup';
import { FC } from 'react';
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

import { WithdrawSchema } from './withdraw-form.schema';
import { WithdrawStyled } from './withdraw.styled';

interface WithdrawFormData {
  withdrawAmount: string;
}

export const WithdrawScreen: FC = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();
  const currentAsset = location.pathname.slice(location.pathname.lastIndexOf('/') + 1);

  const {
    handleSubmit,
    register,
    formState: { isDirty, errors },
  } = useForm<WithdrawFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      withdrawAmount: '',
    },
    resolver: yupResolver(WithdrawSchema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  // Temp data
  const creditLine = '$4,564.34';

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
              {t('dashboard_withdraw.label', { currentAsset })}
              <input placeholder={t('dashboard_withdraw.placeholder')} {...register('withdrawAmount')} />
              {errors.withdrawAmount?.message && (
                <ParagraphXS className="error" color={theme.textDanger}>
                  {t(errors.withdrawAmount.message)}
                </ParagraphXS>
              )}
            </InputText>
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
      </Card>
    </WithdrawStyled>
  );
};
