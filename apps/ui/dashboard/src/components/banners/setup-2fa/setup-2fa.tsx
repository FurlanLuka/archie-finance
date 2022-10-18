import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  MutationQueryResponse,
  RequestState,
} from '@archie-webapps/shared/data-access/archie-api/interface';
import { usePollMfaEnrollment } from '@archie-webapps/shared/data-access/archie-api/user/hooks/use-poll-mfa-enrollment';
import { useStartMfaEnrollment } from '@archie-webapps/shared/data-access/archie-api/user/hooks/use-start-mfa-enrollment';
import {
  ButtonGhost,
  BodyL,
  BodyM,
} from '@archie-microservices/ui/shared/ui/design-system';

import img2fa from '../../../assets/images/img-2fa.png';

import { Setup2faBannerStyled } from './setup-2fa.styled';

export const Setup2faBanner: FC = () => {
  const { t } = useTranslation();
  const [shouldPollMfaEnrollment, setShouldPollMfaEnrollment] = useState(false);
  const startMfaEnrollmentResponse: MutationQueryResponse =
    useStartMfaEnrollment();

  usePollMfaEnrollment(shouldPollMfaEnrollment);

  useEffect(() => {
    if (startMfaEnrollmentResponse.state === RequestState.SUCCESS) {
      if (shouldPollMfaEnrollment === false) {
        window.open(startMfaEnrollmentResponse.data.ticket_url, '_blank');
      }

      setShouldPollMfaEnrollment(true);
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
          <BodyL weight={800}>{t('setup_2fa_banner.title')}</BodyL>
          <BodyM>{t('setup_2fa_banner.text')}</BodyM>
        </div>
        <ButtonGhost onClick={handleClick} isDisabled={shouldPollMfaEnrollment}>
          {t('btn_continue')}
        </ButtonGhost>
      </div>
    </Setup2faBannerStyled>
  );
};
