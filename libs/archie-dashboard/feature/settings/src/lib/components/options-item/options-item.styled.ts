import styled from 'styled-components';

export const OptionsItemStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.backgroundPrimary};
  border-bottom: 1px solid ${({ theme }) => theme.borderPrimary};
  width: 100%;
  padding: 1rem;
  transition: background-color 0.3s ease;
  cursor: pointer;

  :hover {
    background-color: ${({ theme }) => theme.backgroundSecondary};
  }

  .content {
    display: flex;
    flex-direction: column;
    min-height: 46px;
  }

  .item-title {
    margin-bottom: 0.25rem;
  }

  .item-subtitle {
    letter-spacing: 0.02em;
  }
`;
