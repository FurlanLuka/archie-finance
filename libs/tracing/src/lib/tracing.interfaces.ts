export interface RequestWithUser extends Request {
  user?: {
    sub: string;
  };
}
