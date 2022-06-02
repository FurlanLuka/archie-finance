export interface StartVerificationPayload {
  datapoint_type: 'phone';
  datapoint: {
    data_type: 'phone';
    country_code: string;
    phone_number: string;
  };
}

export interface StartVerificationResponse {
  type: string;
  verification_type: 'phone';
  verification_mechanism: 'phone';
  verification_id: string;
  status: string;
}

export interface CompleteVerificationPayload {
  secret: string;
}

export interface CompleteVerificationResponse {
  type: string;
  verification_id: string;
  status: string;
  verification_type: string;
  verification_mechanism: string;
  secondary_credential: {
    type: string;
    verification_id: string;
    status: string;
    verification_type: string;
  };
}

export enum DataType {
  PHONE = 'phone',
  EMAIL = 'email',
  BIRTHDATE = 'birthdate',
  NAME = 'name',
  ADDRESS = 'address',
  ID_DOCUMENT = 'id_document',
}

export interface PhoneDataPoint {
  type: DataType.PHONE;
  verification: {
    verification_id: string;
  };
  country_code: string;
  phone_number: string;
}

export interface EmailDataPoint {
  type: DataType.EMAIL;
  email: string;
}

export interface BirthdateDataPoint {
  type: DataType.BIRTHDATE;
  date: string;
}

export interface NameDataPoint {
  type: DataType.NAME;
  first_name: string;
  last_name: string;
}

export interface AddressDataPoint {
  type: DataType.ADDRESS;
  street_one: string;
  street_two?: string;
  locality: string;
  region: string;
  postal_code: string;
  country: string;
}

export interface IdDocumentDataPoint {
  data_type: DataType.ID_DOCUMENT;
  value: string;
  country: string;
  doc_type: string;
}

export interface CreateUserResponse {
  type: string;
  user_id: string;
  user_token: string;
  user_data: object;
  metadata: string;
}

export interface CardApplicationResponse {
  type: string;
  id: string;
  status: string;
  application_type: string;
  workflow_object_id: string;
  next_action: {
    action_id: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
