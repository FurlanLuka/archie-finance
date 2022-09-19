import { BigNumber } from 'bignumber.js';

export const equalToBigNumber = (exected: BigNumber) => ({
  asymmetricMatch: (actual: number | string) =>
    BigNumber(actual).isEqualTo(BigNumber(exected)),
});
