import styled from 'styled-components';

export const StoriesTitleStyled = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${({ theme }) => theme.borderPrimary};
  gap: 0.25rem;
  padding-bottom: 0.75rem;
  margin-bottom: 2rem;
`;
