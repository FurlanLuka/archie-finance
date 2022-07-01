import styled from 'styled-components';

export const LoanToValueStyled = styled.div`
  position: relative;
  height: 216px;
  width: 216px;

  .centered-metrics {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .status-label {
    font-size: 0.625rem;
    color: ${({ theme }) => theme.loanToValueActive};
    font-weight: 700;
    line-height: 1.6;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border: 1px solid ${({ theme }) => theme.loanToValueActive};
    border-radius: 0.5rem;
    max-width: fit-content;
    padding: 0 1rem;
    margin-top: 0.25rem;
  }
`;
