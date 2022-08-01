import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonPrimary, ParagraphM, SubtitleM } from '@archie-webapps/shared/ui/design-system';

import errorImg from '../../assets/bell-alert.png';

import { ErrorCardStyled } from './error-screen.styled';

interface ErrorScreenProps {
  description?: string;
}
export const ErrorScreen: FC<ErrorScreenProps> = ({ description }) => {
  const { t } = useTranslation();

  return (
    <ErrorCardStyled padding="3rem 0" column alignItems="center">
      <SubtitleM>{t('dashboard_error.title')}</SubtitleM>
      {description && <ParagraphM className="subtitle">{description}</ParagraphM>}
      <img src={errorImg} className="error-image" alt={t('dashboard_error.error_image_alt')} />
      <ButtonPrimary
        maxWidth="fit-content"
        onClick={() => {
          window.location.reload();
        }}
      >
        {t('dashboard_error.btn_reload')}
      </ButtonPrimary>
    </ErrorCardStyled>
  );
};
