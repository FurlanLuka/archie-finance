import { ValueTransformer } from 'typeorm';
import { BigNumber } from 'bignumber.js';

export class BigNumberTrimEndingZerosTransformer implements ValueTransformer {
  public from(value: string): string {
    return BigNumber(value).toString();
  }

  public to(value: string): string {
    return value;
  }
}
