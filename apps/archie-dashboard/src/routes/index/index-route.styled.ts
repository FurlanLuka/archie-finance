import styled from 'styled-components';

export const IndexStyled = styled.div`
  display: flex;
  width: 100%;

  .content {
    width: 100%;
    max-width: 930px;
    margin: 3rem auto;
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
    top: 50%;
    left: 1.5rem;
    transform: translateY(-50%);
  }

  .card-status {
    position: absolute;
    bottom: 10%;
    left: 0;
    transform: translateY(-10%);
  }
`

