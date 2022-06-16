import styled from 'styled-components';
import { NAV_WIDTH } from '../../constants/ui/elements'

export const IndexStyled = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  .content {
    width: 100%;
    max-width: 930px;
    margin: 3rem 0 3rem ${NAV_WIDTH};
  }

  .title {
    margin-bottom: 0.5rem;
  }

  .subtitle {
    margin-bottom: 3rem;
    letter-spacing: 0.02em;
  }

  .section-cards {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .table-title {
    margin-bottom: 1rem;
  }

  .table-btn {
    margin-bottom: 2rem;
  }

  .card-data {
    position: absolute;
    top: 45%;
    left: 1.5rem;
    transform: translateY(-45%);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    letter-spacing: 0.15em;
  }

  .card-data-group {
    display: flex;
    gap: 1.5rem;

    span {
      font-size: 0.75rem;
      margin-right: 0.25rem;
    }
  }

  .card-status {
    position: absolute;
    bottom: 1.25rem;
    left: 0;
    transform: translateY(-10%);
    letter-spacing: 0.02em;
    text-transform: uppercase;
    background-color: ${({ theme }) => theme.backgroundSuccess};
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    padding: 0.5rem 1.5rem;
  }
`

