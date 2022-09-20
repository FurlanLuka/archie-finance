import { BigNumber } from 'bignumber.js';

export const equalToBigNumber = (exected: BigNumber | string | number) => ({
  asymmetricMatch: (actual: number | string) =>
    BigNumber(actual).isEqualTo(BigNumber(exected)),
});
