import {
  createAmqpConnection,
  getOptions,
  publishQueueMessage,
  uuidv4,
  group,
  httpGet,
  check,
} from '../utils';
import { SERVICE_QUEUE_NAME } from '@archie/api/onboarding-api/constants';
import {
  EMAIL_VERIFIED_TOPIC,
  KYC_SUBMITTED_TOPIC,
  MFA_ENROLLED_TOPIC,
} from '@archie/api/user-api/constants';
import { CREDIT_LINE_CREATED_TOPIC } from '@archie/api/credit-line-api/constants';
import { CARD_ACTIVATED_TOPIC } from '@archie/api/credit-api/constants';
import {
  emailVerifiedDataFactory,
  kycSubmittedDataFactory,
  mfaEnrolledDataFactory,
} from '@archie/api/user-api/test-data';
import { creditLineCreatedDataFactory } from '@archie/api/credit-line-api/test-data';
import { cardActivatedDataFactory } from '@archie/api/credit-api/test-data';
import { sign } from 'jsonwebtoken';
var randomBytes = require('randombytes');

export let options = getOptions();

const privateKey: string =
  '-----BEGIN RSA PRIVATE KEY-----\n' +
  'MIIEowIBAAKCAQEAqyfmsC9h0HpBu9y/rKZVYAyk5YRZo/gBwgp9avo/FG4CDqQl\n' +
  'phdHLOtcJiBp7rl4iZ/Wt+KJ+2hfAdqz9nFnhc4S83lzVxzL/FOhO2vJsqJtM5ox\n' +
  'hBjaHnkAG8L6MMxEPmenA7Lxj+whmbfbGBrIl9yRYugPkVlIgvnJh8bS0vpI4scp\n' +
  '6kKUC2oXd2v/org9I6snqjmiZhlvHp1Ga10pcBirxr23uo4POXziS5rsWBLeeJSZ\n' +
  'ghfw+13Rwqa78uFvOeJX2m87tSfIwUPs8VI9Pg3/ZwW3RETUfQwqH6aPC4HEkFQ4\n' +
  'mcS2ygcsjMh3/DQnpmOeQThAmF/TeEzKkrHXzwIDAQABAoIBAGdAevpumyOZnW4n\n' +
  'jbop3fdDqXaMkUdJpkXY7jBLJyK7+qG6hLvd7yI6Gi0mAMHzQbREqNPl5je0jxwf\n' +
  'Q9G4OCuQVf5rlhlHVgeyq+Gc9OC+/AHVU2nNVEht1pLo3OXzVHgRL8Abg36/hMWn\n' +
  'FJVGEx0KAusX88xLgGMDLYCrgSOkvSOz+1doQSdkYTS7pi0SsHMD5T0eq6sdUOYs\n' +
  'COMkTFP63/U2N6jPbAJ1lsQ4wuRIaEb5PydT+lw53CWTYLTq0O8aCZxMkBBV1w4t\n' +
  'xrQIoJwZ/JWN3/RpDEi/GZHQ/jiQ4B3lwzXlqQ2AZ3fNya07Gq8f4EbtYQSzkEZc\n' +
  'N2MDtQECgYEA0rKCecTaBF8XRFnxXVP81BMExxvU81Pod21JPBi5FpBW6myhI9Yh\n' +
  'R5JxEbMuMkNWfNq+osS3zbKMrHuCax1SMfXl5F209T9CGnikA1OuJ9AOF8yzokVq\n' +
  '2OUV6nNghk4KFGsvTe53DHo9fMl5VyegBwmgx6QdXJSBJRYdVr2YVkkCgYEAz/Tl\n' +
  'sQE6ZyrJFQzsUXESCZxhbbUC7jRs4AyEiDRNxuFeKyD8sEkUet8VmOXRfD/33vqM\n' +
  'rX1UUPi0mdVj4vZuJwfTeNVe7AlIx6Pd1bZn9vCtLJrFWulzhCEOlIRRiKBcfPlI\n' +
  'V2AieFrqZH6w0KzDu6NSvr3BOUQSwrqUlRf0XVcCgYAJ7lIKDUY9aIH/PcILpRbI\n' +
  'pDDYda5e3biaUHNgOsYWky0VlZMuzjv5VKSxseFeix/7eI/9ugnzzxOkWZn3FIW4\n' +
  'Rx/T2LrbyGSEPOV2Jq6Rv9O6OXLKFj2IBZw31cJZ8jm1ZqvvH2tLEkPtqs1mVz7K\n' +
  'tiB26Hxdzb4ckmNFoGAayQKBgFEmObOWzRmRIqKqRlWJkAZcFdDfv+MAZjQP7m/Q\n' +
  'KUGglES0PKb1/Z3tC9p8ZADeXXWPw/G3ZH2sb51QHghlLZrhfO48JSxqexIcqeZJ\n' +
  'pcxBIvKy+qx9SOyYkb323HI6UZ0bEdW21/yrTagloA3uPPstwo5YMdyM6d0/Pdfo\n' +
  'Xx1FAoGBANDFLf7nqU+KnA0P4bvtDPD1J2AmP3XyvigkCI2/wrE5CY8gSa9chOl0\n' +
  'ftu5i2jVwMDdGL4rJrpG1kslEay85lfH7MQKLyCnRMetk8ALi98vMgPX+EzdcagX\n' +
  'O8eoy+DHo+Kij9tizKzzjbklODthu59D8tEm50V+avbCpe7lyrW/\n' +
  '-----END RSA PRIVATE KEY-----\n';

export function setup() {
  // console.log(JSON.stringify(randomBytes, null, 2));
  // console.log(
  //   'randombyres',
  //   randomBytes.randomBytes(16, (payload: string) => {
  //     console.log(payload);
  //   }),
  // );
  createAmqpConnection();
}

function generateUserAccessToken(userId: string): string {
  return sign(
    {
      scope: 'openid profile email',
    },
    privateKey,
    {
      expiresIn: 1800,
      audience: 'test-audience',
      issuer: 'test-issuer',
      subject: userId,
      algorithm: 'RS256',
      keyid: 'Ezd13nkOWwg1aL8JX6kFp04-_M6l59zEWbQw7GQZ3no',
      // header: {
      //   alg: 'RS256',
      //   typ: 'JWT',
      //   kid: 'Ezd13nkOWwg1aL8JX6kFp04-_M6l59zEWbQw7GQZ3no',
      // },
    },
  );
}

export default function () {
  const userId: string = uuidv4();
  console.log('before', new Date());
  const accessToken = generateUserAccessToken(userId);
  console.log('after', new Date());
  console.log(accessToken);

  group('Onboarding flow', () => {
    const controllerQueuePrefix: string = `${SERVICE_QUEUE_NAME}-onboarding`;

    group('Create onboarding record', () => {
      const response = httpGet({
        uri: 'http://localhost:90/v1/onboarding',
        token: accessToken,
      });

      check(response, {
        'is status 200': (r) => r.status === 200,
      });
    });

    return;

    group('KYC completed', () => {
      publishQueueMessage(
        KYC_SUBMITTED_TOPIC,
        controllerQueuePrefix,
        kycSubmittedDataFactory({
          userId,
        }),
      );
    });

    group('Email verified', () => {
      publishQueueMessage(
        EMAIL_VERIFIED_TOPIC,
        controllerQueuePrefix,
        emailVerifiedDataFactory({
          userId,
        }),
      );
    });

    group('MFA enrolled', () => {
      publishQueueMessage(
        MFA_ENROLLED_TOPIC,
        controllerQueuePrefix,
        mfaEnrolledDataFactory({
          userId,
        }),
      );
    });

    group('Collaterization stage', () => {
      publishQueueMessage(
        CREDIT_LINE_CREATED_TOPIC,
        controllerQueuePrefix,
        creditLineCreatedDataFactory({
          userId,
        }),
      );
    });

    group('Card activated', () => {
      publishQueueMessage(
        CARD_ACTIVATED_TOPIC,
        controllerQueuePrefix,
        cardActivatedDataFactory({
          userId,
        }),
      );
    });
  });
}

// onboarding - api - queue - archie.microservice.tx_credit.card.activated.v1;
// onboarding -
//   api -
//   queue -
//   onboarding -
//   archie.microservice.tx_credit.card.activated.v1;
