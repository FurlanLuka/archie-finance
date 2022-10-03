import { yupResolver } from '@hookform/resolvers/yup';
import { templateFormatter, templateParser, parseDigit } from 'input-format';
import ReactInput from 'input-format/react';
import { FC } from 'react';
import Autocomplete from 'react-google-autocomplete';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { useCreateKyc } from '@archie-webapps/shared/data-access/archie-api/kyc/hooks/use-create-kyc';
import { ButtonPrimary, Card, InputText, TitleL, BodyL, BodyM } from '@archie-webapps/shared/ui/design-system';
import { Icon } from '@archie-webapps/shared/ui/icons';
import { theme } from '@archie-webapps/shared/ui/theme';

import { parseDate, addAddress, getAddressError, Address } from './kyc-form.helpers';
import { KycSchema } from './kyc-form.schema';
import { KycScreenStyled } from './kyc-screen.styled';

interface KycFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: Address;
  aptUnit: string;
  phoneNumber: string;
  ssn: string;
  income: number;
}

const a = 3;
export const KycScreen: FC = () => {
  const { t } = useTranslation();

  const mutationRequest = useCreateKyc();

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<KycFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      address: undefined,
      aptUnit: '',
      phoneNumber: '',
      ssn: '',
      income: undefined,
    },
    resolver: yupResolver(KycSchema),
  });

  const phoneNumberCountryCode = '+1';

  const onSubmit = handleSubmit((data) => {
    if (mutationRequest.state === RequestState.IDLE) {
      mutationRequest.mutate({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: parseDate(data.dateOfBirth).toISOString(),
        ...data.address,
        aptUnit: data.aptUnit,
        phoneNumberCountryCode,
        phoneNumber: data.phoneNumber,
        ssn: data.ssn,
        income: data.income,
      });
    }
  });

  return (
    <KycScreenStyled>
      <Card column alignItems="center" padding="1.5rem">
        <TitleL className="title">{t('kyc_step.title')}</TitleL>
        <BodyM className="subtitle">{t('kyc_step.subtitle')}</BodyM>
        <form onSubmit={onSubmit}>
          <div className="input-group">
            <InputText>
              {t('kyc_step.label.first_name')}
              <input placeholder={t('kyc_step.placeholder.first_name')} {...register('firstName')} />
              {errors.firstName?.message && (
                <BodyM className="error" color={theme.textDanger}>
                  {t(errors.firstName.message)}
                </BodyM>
              )}
            </InputText>
            <InputText>
              {t('kyc_step.label.last_name')}
              <input placeholder={t('kyc_step.placeholder.last_name')} {...register('lastName')} />
              {errors.lastName?.message && (
                <BodyM className="error" color={theme.textDanger}>
                  {t(errors.lastName.message)}
                </BodyM>
              )}
            </InputText>
          </div>
          <InputText>
            {t('kyc_step.label.date_of_birth')}
            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field: { onChange, value } }) => (
                <ReactInput
                  value={value}
                  placeholder={t('kyc_step.placeholder.date_of_birth')}
                  onChange={onChange}
                  parse={templateParser('xx-xx-xxxx', parseDigit)}
                  format={templateFormatter('xx-xx-xxxx')}
                />
              )}
            />
            {errors.dateOfBirth?.message && (
              <BodyM className="error" color={theme.textDanger}>
                {t(errors.dateOfBirth.message)}
              </BodyM>
            )}
          </InputText>
          <InputText>
            {t('kyc_step.label.address')}
            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, value } }) => (
                <>
                  <Autocomplete
                    apiKey="AIzaSyA-k_VEX0soa2kljYKTjtFUg4irF3hKZwQ"
                    onPlaceSelected={(place) => {
                      const add = addAddress(place);
                      onChange(add);
                    }}
                    placeholder={t('kyc_step.placeholder.address')}
                    options={{ types: ['address'] }}
                  />
                  {errors.address && (
                    <BodyM className="error" color={theme.textDanger}>
                      {!value ? t('kyc_step.error.required_field') : t(getAddressError(errors.address))}
                    </BodyM>
                  )}
                </>
              )}
            />
          </InputText>
          <InputText>
            {t('kyc_step.label.apt_unit')}
            <input placeholder={t('kyc_step.placeholder.apt_unit')} {...register('aptUnit')} />
            {errors.aptUnit?.message && (
              <BodyM className="error" color={theme.textDanger}>
                {t(errors.aptUnit.message)}
              </BodyM>
            )}
          </InputText>
          <InputText>
            {t('kyc_step.label.phone_number')}
            <div className="phone-number">
              <BodyL weight={700}>+1</BodyL>
              <Controller
                control={control}
                name="phoneNumber"
                render={({ field: { onChange, value } }) => (
                  <ReactInput
                    value={value}
                    placeholder={t('kyc_step.placeholder.phone_number')}
                    onChange={onChange}
                    parse={templateParser('(xxx) xxx-xxxx', parseDigit)}
                    format={templateFormatter('(xxx) xxx-xxxx')}
                  />
                )}
              />
            </div>
            {errors.phoneNumber?.message && (
              <BodyM className="error" color={theme.textDanger}>
                {t(errors.phoneNumber.message)}
              </BodyM>
            )}
          </InputText>
          <InputText>
            {t('kyc_step.label.ssn')}
            <Controller
              control={control}
              name="ssn"
              render={({ field: { onChange, value } }) => (
                <ReactInput
                  value={value}
                  onChange={onChange}
                  placeholder={t('kyc_step.placeholder.ssn')}
                  parse={templateParser('xxx-xx-xxxx', parseDigit)}
                  format={templateFormatter('xxx-xx-xxxx')}
                />
              )}
            />
            {errors.ssn?.message && (
              <BodyM className="error" color={theme.textDanger}>
                {t(errors.ssn.message)}
              </BodyM>
            )}
          </InputText>
          <InputText>
            {t('kyc_step.label.income')}
            <input
              type="number"
              placeholder={t('kyc_step.placeholder.income')}
              // prevent value change on scroll
              onWheel={(e) => e.currentTarget.blur()}
              className="income"
              {...register('income')}
            />
            {errors.income?.message && (
              <BodyM className="error" color={theme.textDanger}>
                {t(errors.income.message)}
              </BodyM>
            )}
          </InputText>
          <hr className="divider" />
          <ButtonPrimary type="submit" maxWidth="100%" isLoading={mutationRequest.state === RequestState.LOADING}>
            {t('btn_next')}
            <Icon name="arrow-right" fill={theme.textLight} />
          </ButtonPrimary>
        </form>
      </Card>
    </KycScreenStyled>
  );
};
