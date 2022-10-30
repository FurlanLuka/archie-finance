import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import errorImg from '../../../assets/bell-alert.png';
import { ButtonPrimary } from '../button/button.styled';
import { TitleL, TitleS } from '../typography/typography.styled';

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
      <TitleL className="title">{t('error_indicator.title')}</TitleL>
      {description && (
        <TitleS weight={400} className="subtitle">
          {description}
        </TitleS>
      )}
      <div className="error-img">
        <img src={errorImg} alt={t('error_indicator.error_image_alt')} />
      </div>
      <ButtonPrimary
        onClick={() =>
          prevPath ? navigate(prevPath) : window.location.reload()
        }
      >
        {t('error_indicator.btn_reload')}
      </ButtonPrimary>
    </ErrorStyled>
  );
};
