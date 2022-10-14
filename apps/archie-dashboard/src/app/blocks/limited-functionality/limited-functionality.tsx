import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { BodyM, TitleS, ToastList } from '@archie-webapps/shared/ui/design-system';

import { LimitedFunctionalityStyled } from './limited-functionality.styled';

export const LimitedFunctionalityToast: FC = () => {
  const { t } = useTranslation();

  return (
    <ToastList>
      <LimitedFunctionalityStyled>
        <TitleS className="title">{t('limited_functionality_modal.title')}</TitleS>
        <BodyM weight={600}>{t('limited_functionality_modal.text')}</BodyM>
      </LimitedFunctionalityStyled>
    </ToastList>
  );
};
