import { parse } from 'date-fns';

export const parseDate = (value: string) => parse(value, 'MMddyyyy', new Date());
