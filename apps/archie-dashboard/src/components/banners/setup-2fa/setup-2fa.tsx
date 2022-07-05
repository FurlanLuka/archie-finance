import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonGhost, ParagraphS, ParagraphXS } from '@archie-webapps/ui-design-system';

import img2fa from '../../../assets/images/img-2fa.png';

import { Setup2faBannerStyled } from './setup-2fa.styled';

export const Setup2faBanner: FC = () => {
  const { t } = useTranslation();

  const handleClick = () => {
    console.log('clicked');
  };

  return (
    <Setup2faBannerStyled>
      <div className="image">
        <img src={img2fa} alt={t('setup_2fa_alert.img_alt')} />
      </div>
      <div className="content">
        <div className="text">
          <ParagraphS weight={800}>{t('setup_2fa_alert.title')}</ParagraphS>
          <ParagraphXS>{t('setup_2fa_alert.text')}</ParagraphXS>
        </div>
        <ButtonGhost maxWidth="fit-content" onClick={handleClick}>
          {t('btn_continue')}
        </ButtonGhost>
      </div>
    </Setup2faBannerStyled>
  );
};
