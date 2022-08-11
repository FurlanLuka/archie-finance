import styled from 'styled-components';

import { Card } from '@archie-webapps/shared/ui/design-system';

export const ConnectedAccountsStyled = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem;

  .title {
    margin-bottom: 1.5rem;
  }

  .add-account {
    align-self: flex-end;
    margin-bottom: 1rem;
  }

  .account-list {
    width: 100%;
    margin-top: 1rem;
  }
`;
