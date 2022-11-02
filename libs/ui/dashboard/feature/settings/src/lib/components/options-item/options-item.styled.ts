import styled from 'styled-components';

interface OptionsItemStyledProps {
  isDisabled?: boolean;
}

export const OptionsItemStyled = styled.div<OptionsItemStyledProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme, isDisabled }) => isDisabled ? theme.backgroundSecondary : theme.backgroundPrimary};
  border-bottom: 1px solid ${({ theme }) => theme.borderPrimary};
  width: 100%;
  padding: 1rem;
  transition: background-color 0.3s ease;
  cursor: pointer;
  pointer-events: ${({ isDisabled }) =>  isDisabled ? "none" : "auto"};

  :hover {
    background-color: ${({ theme }) => theme.backgroundSecondary};
  }

  .item-title {
    color: ${({ theme, isDisabled }) => isDisabled ? theme.textSecondary : theme.textPrimary};
  }

  svg {
    opacity: ${({ isDisabled }) => isDisabled ? 0.2 : 1};
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