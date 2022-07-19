import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MutationQueryResponse, RequestState } from '@archie-webapps/shared/data-access-archie-api/interface';
import { usePollMfaEnrollment } from '@archie-webapps/shared/data-access-archie-api/user/hooks/use-poll-mfa-enrollment';
import { useStartMfaEnrollment } from '@archie-webapps/shared/data-access-archie-api/user/hooks/use-start-mfa-enrollment';
import { ButtonGhost, ParagraphS, ParagraphXS } from '@archie-webapps/ui-design-system';

import img2fa from '../../../assets/images/img-2fa.png';

import { Setup2faBannerStyled } from './setup-2fa.styled';

export const Setup2faBanner: FC = () => {
  const { t } = useTranslation();
  const [shouldPollMfaEnrollment, setShouldPollMfaEnrollment] = useState(false);
  const startMfaEnrollmentResponse: MutationQueryResponse = useStartMfaEnrollment();

  usePollMfaEnrollment(shouldPollMfaEnrollment);

  useEffect(() => {
    if (startMfaEnrollmentResponse.state === RequestState.SUCCESS) {
      setShouldPollMfaEnrollment(true);

      window.open(startMfaEnrollmentResponse.data.ticket_url, '_blank');
    }
  }, [startMfaEnrollmentResponse]);

  const handleClick = () => {
    if (startMfaEnrollmentResponse.state === RequestState.IDLE) {
      startMfaEnrollmentResponse.mutate({});
    }
  };

  return (
    <Setup2faBannerStyled>
      <div className="image">
        <img src={img2fa} alt={t('setup_2fa_banner.img_alt')} />
      </div>
      <div className="content">
        <div className="text">
          <ParagraphS weight={800}>{t('setup_2fa_banner.title')}</ParagraphS>
          <ParagraphXS>{t('setup_2fa_banner.text')}</ParagraphXS>
        </div>
        <ButtonGhost maxWidth="fit-content" onClick={handleClick}>
          {t('btn_continue')}
        </ButtonGhost>
      </div>
    </Setup2faBannerStyled>
  );
};
