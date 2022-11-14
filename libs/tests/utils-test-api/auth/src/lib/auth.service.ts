import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/tests/utils-test-api/constants';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  PRIVATE_SIGNING_KEY =
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
  PUBLIC_JWK = {
    keys: [
      {
        kty: 'RSA',
        e: 'AQAB',
        use: 'sig',
        kid: 'Ezd13nkOWwg1aL8JX6kFp04-_M6l59zEWbQw7GQZ3no',
        alg: 'RS256',
        n: 'qyfmsC9h0HpBu9y_rKZVYAyk5YRZo_gBwgp9avo_FG4CDqQlphdHLOtcJiBp7rl4iZ_Wt-KJ-2hfAdqz9nFnhc4S83lzVxzL_FOhO2vJsqJtM5oxhBjaHnkAG8L6MMxEPmenA7Lxj-whmbfbGBrIl9yRYugPkVlIgvnJh8bS0vpI4scp6kKUC2oXd2v_org9I6snqjmiZhlvHp1Ga10pcBirxr23uo4POXziS5rsWBLeeJSZghfw-13Rwqa78uFvOeJX2m87tSfIwUPs8VI9Pg3_ZwW3RETUfQwqH6aPC4HEkFQ4mcS2ygcsjMh3_DQnpmOeQThAmF_TeEzKkrHXzw',
      },
    ],
  };

  public createToken(userId: string): string {
    return sign(
      {
        scope: 'openid profile email mfa',
      },
      this.PRIVATE_SIGNING_KEY,
      {
        expiresIn: 86400,
        audience: this.configService.get(ConfigVariables.AUTH0_AUDIENCE),
        issuer: `${this.configService.get(ConfigVariables.AUTH0_DOMAIN)}/`,
        subject: userId,
        algorithm: 'RS256',
        keyid: this.PUBLIC_JWK.keys[0].kid,
      },
    );
  }

  public getPublicKey(): object {
    return this.PUBLIC_JWK;
  }
}
