import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ToastList, BodyM } from '@archie/ui/shared/design-system';

import { LimitedFunctionalityStyled } from './limited-functionality.styled';

export const LimitedFunctionalityToast: FC = () => {
  const { t } = useTranslation();

  return (
    <ToastList>
      <LimitedFunctionalityStyled>
        <BodyM weight={800} className="title">
          {t('limited_functionality_toast.title')}
        </BodyM>
        <BodyM weight={600}>{t('limited_functionality_toast.text')}</BodyM>
      </LimitedFunctionalityStyled>
    </ToastList>
  );
};
