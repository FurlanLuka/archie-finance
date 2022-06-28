import { breakpoints, NAV_WIDTH } from '@archie-webapps/ui-theme';
import styled from 'styled-components';

export const IndexStyled = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  .content {
    width: 100%;
    max-width: calc(1000px + 4rem);
    margin-left: ${NAV_WIDTH};
    padding: 3rem 2rem;

    @media (max-width: ${breakpoints.screenMD}) {
      margin: 0;
    }

    @media (max-width: ${breakpoints.screenSM}) {
      padding: 1.5rem 1rem;
    }
  }

  .title {
    margin-bottom: 0.5rem;
  }

  .subtitle {
    letter-spacing: 0.02em;
    margin-bottom: 1.5rem;
  }

  .section-cards {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;

    @media (max-width: ${breakpoints.screenMD}) {
      flex-wrap: wrap;
    }
  }

  .archie-card {
    max-width: 420px;
    min-height: 240px;
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

