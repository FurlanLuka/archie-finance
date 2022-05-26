export class CollateralServiceMock {
  public createDeposit: jest.Mock = jest.fn();
  public getUserCollateral: jest.Mock = jest.fn();
}
