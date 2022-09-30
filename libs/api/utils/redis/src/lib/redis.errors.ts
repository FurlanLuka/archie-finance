import { HttpException } from '@nestjs/common';

export class LockedResourceError extends HttpException {
  constructor() {
    super('RESOURCE_IS_LOCKED', 423);
  }
}
