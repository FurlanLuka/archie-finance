import styled from 'styled-components';

export const Setup2faBannerStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 3rem;
  background-color: ${({ theme }) => theme.backgroundPositive};
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.08);
  width: 100%;
  padding: 1rem;

  .image {
    line-height: 1;
    max-width: 44px;
  }
`;
