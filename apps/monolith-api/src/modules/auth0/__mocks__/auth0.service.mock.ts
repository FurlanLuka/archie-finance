export class Auth0ServiceMock {
  public getUser: jest.Mock = jest.fn();
  public sendEmailVerification: jest.Mock = jest.fn();

  getManagmentClient() {
    return {
      getUser: this.getUser,
      sendEmailVerification: this.sendEmailVerification,
    };
  }
}
