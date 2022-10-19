import { BigNumber } from 'bignumber.js';

export const equalToBigNumber = (
  exected: BigNumber | string | number,
): jest.AsymmetricMatcher => ({
  asymmetricMatch: (actual: number | string): boolean =>
    BigNumber(actual).isEqualTo(BigNumber(exected)),
});
