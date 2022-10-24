import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { usePollMfaEnrollment } from '@archie/ui/shared/data-access/archie-api/user/hooks/use-poll-mfa-enrollment';
import { useStartMfaEnrollment } from '@archie/ui/shared/data-access/archie-api/user/hooks/use-start-mfa-enrollment';
import { ButtonGhost, BodyL, BodyM } from '@archie/ui/shared/design-system';

import img2fa from '../../../assets/images/img-2fa.png';

import { Setup2faBannerStyled } from './setup-2fa.styled';

export const Setup2faBanner: FC = () => {
  const { t } = useTranslation();
  const startMfaEnrollmentMutation = useStartMfaEnrollment();

  const [shouldPollMfaEnrollment, setShouldPollMfaEnrollment] = useState(false);

  usePollMfaEnrollment(shouldPollMfaEnrollment);

  useEffect(() => {
    if (startMfaEnrollmentMutation.state === RequestState.SUCCESS) {
      if (shouldPollMfaEnrollment === false) {
        window.open(startMfaEnrollmentMutation.data.ticket_url, '_blank');
      }

      setShouldPollMfaEnrollment(true);
    }
  }, [startMfaEnrollmentMutation]);

  const handleClick = () => {
    if (startMfaEnrollmentMutation.state === RequestState.IDLE) {
      startMfaEnrollmentMutation.mutate({});
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
