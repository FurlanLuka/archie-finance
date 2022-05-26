export class FireblocksServiceMock {
  public generateDepositAddress: jest.Mock = jest.fn();
  public getDepositAddresses: jest.Mock = jest.fn();
  public createVaultAccount: jest.Mock = jest.fn();
  public getVaultAccount: jest.Mock = jest.fn();
  public createVaultAsset: jest.Mock = jest.fn();
  public getVaultAccounts: jest.Mock = jest.fn();
}
