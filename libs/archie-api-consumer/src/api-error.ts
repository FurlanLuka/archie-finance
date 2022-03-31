export class ApiError extends Error {
  constructor(errorMessage: string) {
    super(errorMessage);
  }
}

export class UnauthenticatedApiError extends Error {
  constructor() {
    super();
  }
}

export type ApiErrors = ApiError | UnauthenticatedApiError;
