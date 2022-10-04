import styled from 'styled-components';

import { InputRadio } from '@archie-webapps/shared/ui/design-system';

export const ConsentCheckboxStyled = styled(InputRadio)`
  .disabled {
    color: 1px solid ${({ theme }) => theme.textDisabled};
  }

  .document-btn {
    color: ${({ theme }) => theme.textHighlight};
    padding: 0;
    margin: 0;
    border: none;
    background: none;
    font-weight: inherit;

    :hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
`;
