import { yupResolver } from '@hookform/resolvers/yup';
import { templateFormatter, templateParser, parseDigit } from 'input-format';
import ReactInput from 'input-format/react';
import { FC } from 'react';
import Autocomplete from 'react-google-autocomplete';
import { Controller, FieldErrors, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { RequestState } from '@archie-webapps/shared/data-access-archie-api/interface';
import { useCreateKyc } from '@archie-webapps/shared/data-access-archie-api/kyc/hooks/use-create-kyc';
import { ButtonPrimary, InputText, ParagraphS, ParagraphXS, SubtitleM } from '@archie-webapps/ui-design-system';
import { Icon } from '@archie-webapps/ui-icons';
import { theme } from '@archie-webapps/ui-theme';

import { KycSchema } from './kyc-form.schema';
import { parseDate } from './kyc-step.helpers';
import { KycStepStyled } from './kyc-step.styled';

interface GooglePlace {
  address_components: Array<{
    types: string[];
    long_name: string;
    short_name: string;
  }>;
  formatted_address: string;
}

interface Address {
  addressStreet: string;
  addressStreetNumber: string;
  addressLocality: string;
  addressRegion: string;
  addressPostalCode: string;
  addressCountry: string;
}

interface KycFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: Address;
  phoneNumber: string;
  ssn: string;
}

export function getAddressError(errors: FieldErrors<Address>): string {
  return Object.values(errors)[0].message ?? '';
}

const addAddress = (place: GooglePlace): Partial<Address> => {
  const streetNumberComponent = place.address_components.find((item) => item.types.includes('street_number'));
  const streetNameComponent = place.address_components.find((item) => item.types.includes('route'));
  const localityComponent = place.address_components.find((item) => item.types.includes('locality'));
  const countryComponent = place.address_components.find((item) => item.types.includes('country'));
  const postalCodeComponent = place.address_components.find((item) => item.types.includes('postal_code'));
  const postalTownComponent = place.address_components.find((item) => item.types.includes('postal_town'));
  const regionComponent = place.address_components.find((item) => item.types.includes('administrative_area_level_1'));

  const addr: Partial<Address> = {
    addressStreet: streetNameComponent?.long_name,
    addressStreetNumber: streetNumberComponent?.long_name,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    addressLocality: localityComponent ? localityComponent.short_name : postalTownComponent!.long_name,
    addressCountry: countryComponent?.short_name,
    addressRegion: regionComponent?.short_name,
    addressPostalCode: postalCodeComponent?.short_name,
  };

  return addr;
};

export const KycStep: FC = () => {
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
      phoneNumber: '',
      ssn: '',
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
        phoneNumber: data.phoneNumber,
        ssn: data.ssn,
        phoneNumberCountryCode,
        ...data.address,
      });
    }
  });

  return (
    <KycStepStyled>
      <SubtitleM className="title">{t('kyc_step.title')}</SubtitleM>
      <ParagraphXS className="subtitle">{t('kyc_step.subtitle')}</ParagraphXS>
      <form onSubmit={onSubmit}>
        <div className="input-group">
          <InputText>
            {t('kyc_step.label.first_name')}
            <input placeholder={t('kyc_step.placeholder.first_name')} {...register('firstName')} />
            {errors.firstName?.message && (
              <ParagraphXS className="error" color={theme.textDanger}>
                {t(errors.firstName.message)}
              </ParagraphXS>
            )}
          </InputText>
          <InputText>
            {t('kyc_step.label.last_name')}
            <input placeholder={t('kyc_step.placeholder.last_name')} {...register('lastName')} />
            {errors.lastName?.message && (
              <ParagraphXS className="error" color={theme.textDanger}>
                {t(errors.lastName.message)}
              </ParagraphXS>
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
            <ParagraphXS className="error" color={theme.textDanger}>
              {t(errors.dateOfBirth.message)}
            </ParagraphXS>
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
                  <ParagraphXS className="error" color={theme.textDanger}>
                    {!value ? t('kyc_step.error.required_field') : t(getAddressError(errors.address))}
                  </ParagraphXS>
                )}
              </>
            )}
          />
        </InputText>
        <InputText>
          {t('kyc_step.label.phone_number')}
          <div className="phone-number">
            <ParagraphS weight={700}>+1</ParagraphS>
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
            <ParagraphXS className="error" color={theme.textDanger}>
              {t(errors.phoneNumber.message)}
            </ParagraphXS>
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
            <ParagraphXS className="error" color={theme.textDanger}>
              {t(errors.ssn.message)}
            </ParagraphXS>
          )}
        </InputText>
        <hr className="divider" />
        <ButtonPrimary type="submit" isLoading={mutationRequest.state === RequestState.LOADING}>
          {t('btn_next')}
          <Icon name="arrow-right" fill={theme.textLight} />
        </ButtonPrimary>
      </form>
    </KycStepStyled>
  );
};
