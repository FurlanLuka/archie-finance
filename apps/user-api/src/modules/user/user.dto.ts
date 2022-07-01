import { GetEmailVerificationResponse } from './user.interfaces';
import { GetEmailAddressResponse } from '@archie-microservices/api-interfaces/user';

export class GetEmailVerificationResponseDto
  implements GetEmailVerificationResponse
{
  isVerified: boolean;
}

export class GetEmailAddressResponseDto implements GetEmailAddressResponse {
  email: string;
}
