import { FC } from 'react';

import { ResetPassword } from './blocks/reset-password/reset-password';
import { Change2FA } from './blocks/change-2fa/change-2fa';
import { Autopay } from './blocks/autopay/autopay';
import { ContactSupport } from './blocks/contact-support/contact-support';
import { ManageWitelist } from './blocks/manage-whitelist/manage-whitelist';
import { OptionsHandlerStyled } from './options-handler.styled';

export const OptionsHandler: FC = () => (
  <OptionsHandlerStyled>
    <ResetPassword />
    <Change2FA />
    <Autopay />
    <ContactSupport />
    <ManageWitelist />
  </OptionsHandlerStyled>
);
