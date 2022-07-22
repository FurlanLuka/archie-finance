import styled from 'styled-components';

export const TableStyled = styled.div`
  width: 100%;
  overflow-x: scroll;

  table {
    border-spacing: 0;
    width: 100%;

    tbody {
      tr {
        transition: background-color 0.3s ease;

        :hover {
          background-color: ${({ theme }) => theme.backgroundSecondary};
        }
      }
    }

    tr {
      background-color: ${({ theme }) => theme.backgroundPrimary};

      :last-child {
        td {
          border-bottom: 1px solid ${({ theme }) => theme.tableBorderOuther};
        }
      }
    }

    th {
      font-size: 0.875rem;
      font-weight: 700;
      color: ${({ theme }) => theme.textSecondary};
      letter-spacing: 0.02em;
      text-align: left;
      padding: 0.5rem 1.5rem;
      border-bottom: 1px solid ${({ theme }) => theme.tableBorderOuther};
    }

    td {
      font-size: 0.875rem;
      font-weight: 500;
      color: ${({ theme }) => theme.textPrimary};
      line-height: 1.2;
      text-align: left;
      padding: 0.75rem 1.5rem;
      border-bottom: 1px solid ${({ theme }) => theme.tableBorderInner};
    }
  }
`;
