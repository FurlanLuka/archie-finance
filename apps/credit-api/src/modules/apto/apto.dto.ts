import {
  StartPhoneVerificationResponse,
  CompletePhoneVerificationResponse,
} from './apto.interfaces';
import {
  CreateUserResponse,
  IssueCardResponse,
} from './api/apto_api.interfaces';

export class StartPhoneVerificationResponseDto
  implements StartPhoneVerificationResponse
{
  verificationId: string;
  status: string;
}

export class CompletePhoneVerificationResponseDto
  implements CompletePhoneVerificationResponse
{
  verificationId: string;
  status: string;
}

export class CreateUserResponseDto implements CreateUserResponse {
  type: string;
  user_id: string;
  user_token: string;
  user_data: object;
  metadata: string;
}

export class IssueCardResponseDto implements IssueCardResponse {
  type: string;
  account_id: string;
  lastFour: string;
  cardNetwork: string;
  card_brand: string;
  expiration: string;
  pan: string;
  ccv: string;
  kyc_status: string;
  kyc_reason: string;
  cardholder_first_name: string;
  cardholder_last_name: string;
  issued_at: string;
  name_on_card: string;
}
