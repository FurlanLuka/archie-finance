import styled from 'styled-components';

import { InputRadio } from '@archie-webapps/shared/ui/design-system';

export const ConsentCheckboxStyled = styled(InputRadio)`
  .disabled {
    color: 1px solid ${({ theme }) => theme.textDisabled};
  }

  .link {
    color: ${({ theme }) => theme.textHighlight};
    padding-left: 0.25rem;
  }
`;
