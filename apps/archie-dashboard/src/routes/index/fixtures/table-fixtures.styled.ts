import styled from 'styled-components'
import { Status } from '../../../constants/transactions-status';

interface StatusCellStyledProps {
  status: Status;
}

export const StatusCellStyled = styled.div<StatusCellStyledProps>`
  color: ${({ theme, status }) => status === Status.SETTLED ? theme.statusSettled : theme.statusPending};  
`

export const DescriptionCellStyled = styled.div`
  .description-title {
    font-size: 1rem;
  }

  .description-code {
    color: ${({ theme }) => theme.textSecondary};  
  }
`