import { Credit } from './credit.entity';
import { GroupMap } from '@archie/api/utils/helpers';

export type CreditPerUser = GroupMap<Credit>;
