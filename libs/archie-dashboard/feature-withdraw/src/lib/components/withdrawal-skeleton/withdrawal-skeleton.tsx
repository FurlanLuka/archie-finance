import { FC } from 'react';

import { Skeleton } from '@archie-webapps/ui-design-system';

import { WithdrawalSkeletonStyled } from './withdrawal-skeleton.styled';

export const WithdrawalSkeleton: FC = () => (
  <WithdrawalSkeletonStyled>
    <Skeleton className="credit-subtitle" />
    <Skeleton className="input-label" />
    <Skeleton className="input" />
    <Skeleton className="credit-info" />
    <Skeleton className="address" />
  </WithdrawalSkeletonStyled>
);
