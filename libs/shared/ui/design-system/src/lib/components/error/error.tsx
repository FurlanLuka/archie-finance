import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ButtonPrimary, ParagraphM, SubtitleM } from '@archie-webapps/shared/ui/design-system';

import errorImg from '../../../assets/bell-alert.png';

import { ErrorStyled } from './error.styled';

export interface ErrorProps {
  prevPath?: string;
  description?: string;
}

export const Error: FC<ErrorProps> = ({ prevPath, description }) => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  return (
    <ErrorStyled>
      <SubtitleM className="title">{t('error_indicator.title')}</SubtitleM>
      {description && <ParagraphM className="subtitle">{description}</ParagraphM>}
      <div className="error-img">
        <img src={errorImg} alt={t('error_indicator.error_image_alt')} />
      </div>
      <ButtonPrimary maxWidth="fit-content" onClick={() => (prevPath ? navigate(prevPath) : window.location.reload())}>
        {t('error_indicator.btn_reload')}
      </ButtonPrimary>
    </ErrorStyled>
  );
};
