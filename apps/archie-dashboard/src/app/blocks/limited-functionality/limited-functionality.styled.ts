import styled from 'styled-components';

import { Toast } from '@archie-webapps/shared/ui/design-system';

export const LimitedFunctionalityStyled = styled(Toast)`
  background-color: ${({ theme }) => theme.backgroundWarning};
  box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;

  .title {
    margin-bottom: 1rem;
  }
`;
