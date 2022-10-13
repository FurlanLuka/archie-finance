import styled from 'styled-components';

export const ConsentCheckStyled = styled.div`
  .radio-label-btn {
    color: ${({ theme }) => theme.textHighlight};
    font-size: inherit;
    font-weight: inherit;
    background: none;
    border: 0;
    padding: 0;
    margin: 0;
    cursor: pointer;
  }

  .document-inner {
    max-height: 60vh;
    margin-bottom: 2rem;
    overflow-y: auto;

    .page-content {
      padding: 0;
    }
  }
`;
