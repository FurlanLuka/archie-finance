export class VaultServiceMock {
  public getVaultToken: jest.Mock = jest.fn();
  public encryptStrings: jest.Mock = jest.fn();
  public decryptStrings: jest.Mock = jest.fn();
}
