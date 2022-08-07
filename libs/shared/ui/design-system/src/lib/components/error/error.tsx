import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonPrimary, ParagraphM, SubtitleM } from '@archie-webapps/shared/ui/design-system';

import errorImg from '../../../assets/bell-alert.png';

import { ErrorStyled } from './error.styled';

export interface ErrorProps {
  description?: string;
}

export const Error: FC<ErrorProps> = ({ description }) => {
  const { t } = useTranslation();

  return (
    <ErrorStyled>
      <SubtitleM className="title">{t('error_indicator.title')}</SubtitleM>
      {description && <ParagraphM className="subtitle">{description}</ParagraphM>}
      <div className="error-img">
        <img src={errorImg} alt={t('error_indicator.error_image_alt')} />
      </div>
      <ButtonPrimary
        maxWidth="fit-content"
        onClick={() => {
          window.location.reload();
        }}
      >
        {t('error_indicator.btn_reload')}
      </ButtonPrimary>
    </ErrorStyled>
  );
};
