import { Injectable } from '@nestjs/common';

@Injectable()
export class MathUtilService {
  public getDifference(value: number, comparingValue: number): number {
    return (
      (Math.abs(value - comparingValue) / ((value + comparingValue) / 2)) * 100
    );
  }
}
