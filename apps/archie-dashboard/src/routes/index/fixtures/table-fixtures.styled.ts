import styled from 'styled-components'
import { TransactionStatus } from '../../../constants/transactions-status';

interface StatusCellStyledProps {
  status: TransactionStatus;
}

export const StatusCellStyled = styled.div<StatusCellStyledProps>`
  color: ${({ theme, status }) => status === TransactionStatus.COMPLETED ? theme.statusSettled : theme.statusPending};  
`

export const DescriptionCellStyled = styled.div`
  .description-title {
    font-size: 1rem;
  }

  .description-code {
    color: ${({ theme }) => theme.textSecondary};  
  }
`