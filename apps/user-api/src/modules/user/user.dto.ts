import * as userI from './user.interfaces';
import * as i from '@archie-microservices/api-interfaces/user';

export class GetEmailVerificationResponse implements userI.GetEmailVerificationResponse {
    isVerified: boolean;
}

export class GetEmailAddressResponse implements i.GetEmailAddressResponse {
    email: string;
}