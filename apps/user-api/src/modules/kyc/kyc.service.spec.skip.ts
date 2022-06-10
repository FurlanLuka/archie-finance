// import { Test } from '@nestjs/testing';
// import { getMockConnectionProvider } from '../../../test/unit-test-utils/mock.connection.utils';
// import { getMockRepositoryProvider } from '../../../test/unit-test-utils/mock.repository.utils';
// import { Kyc } from './kyc.entity';
// import { KycService } from './kyc.service';
// import { Repository } from 'typeorm';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { when } from 'jest-when';
// import { user } from '../../../test/test-data/user.data';
// import { BadRequestException, NotFoundException } from '@nestjs/common';
// import {
//   getEncryptedKycEntityData,
//   getKycEntityData,
// } from './__data__/kyc.service.data';
// import { VaultService } from '@archie-microservices/vault';

// describe('KycService', () => {
//   let service: KycService;
//   let vaultService: VaultService;

//   let kycRepository: Repository<Kyc>;

//   beforeEach(async () => {
//     const module = await Test.createTestingModule({
//       providers: [
//         KycService,
//         {
//           provide: VaultService,
//           useClass: VaultServiceMock,
//         },
//         getMockRepositoryProvider(Kyc),
//         getMockConnectionProvider(),
//       ],
//     }).compile();

//     service = module.get(KycService);
//     vaultService = module.get(VaultService);

//     kycRepository = module.get(getRepositoryToken(Kyc));
//   });

//   describe('getKyc', () => {
//     it('should throw not found exception because KYC record does not exist for the user', async () => {
//       when(kycRepository.findOneBy)
//         .calledWith({
//           userId: user.id,
//         })
//         .mockResolvedValue(undefined);

//       await expect(service.getKyc(user.id)).rejects.toThrowError(
//         NotFoundException,
//       );
//     });

//     it('should return kyc record for the user', async () => {
//       const encryptedKycRecord: Kyc = getEncryptedKycEntityData(user.id);
//       const kycRecord: Kyc = getKycEntityData(user.id);

//       when(kycRepository.findOneBy)
//         .calledWith({
//           userId: user.id,
//         })
//         .mockResolvedValue(encryptedKycRecord);

//       when(vaultService.decryptStrings)
//         .calledWith([
//           encryptedKycRecord.firstName,
//           encryptedKycRecord.lastName,
//           encryptedKycRecord.dateOfBirth,
//           encryptedKycRecord.address,
//           encryptedKycRecord.phoneNumberCountryCode,
//           encryptedKycRecord.phoneNumber,
//           encryptedKycRecord.ssn,
//         ])
//         .mockResolvedValue([
//           kycRecord.firstName,
//           kycRecord.lastName,
//           kycRecord.dateOfBirth,
//           kycRecord.address,
//           kycRecord.phoneNumberCountryCode,
//           kycRecord.phoneNumber,
//           kycRecord.ssn,
//         ]);

//       await expect(service.getKyc(user.id)).resolves.toStrictEqual({
//         firstName: kycRecord.firstName,
//         lastName: kycRecord.lastName,
//         dateOfBirth: kycRecord.dateOfBirth,
//         address: kycRecord.address,
//         phoneNumberCountryCode: kycRecord.phoneNumberCountryCode,
//         phoneNumber: kycRecord.phoneNumber,
//         ssn: kycRecord.ssn,
//       });
//     });
//   });

//   describe('createKyc', () => {
//     const encryptedKycRecord: Kyc = getEncryptedKycEntityData(user.id);
//     const kycRecord: Kyc = getKycEntityData(user.id);

//     beforeEach(() => {
//       when(vaultService.encryptStrings)
//         .calledWith([
//           kycRecord.firstName,
//           kycRecord.lastName,
//           kycRecord.dateOfBirth,
//           kycRecord.address,
//           kycRecord.phoneNumberCountryCode,
//           kycRecord.phoneNumber,
//           kycRecord.ssn,
//         ])
//         .mockResolvedValue([
//           encryptedKycRecord.firstName,
//           encryptedKycRecord.lastName,
//           encryptedKycRecord.dateOfBirth,
//           encryptedKycRecord.address,
//           encryptedKycRecord.phoneNumberCountryCode,
//           encryptedKycRecord.phoneNumber,
//           encryptedKycRecord.ssn,
//         ]);
//     });

//     it('should throw bad request exception because KYC record already exists for the user', async () => {
//       when(kycRepository.findOneBy)
//         .calledWith({
//           userId: user.id,
//         })
//         .mockResolvedValue(getKycEntityData(user.id));

//       await expect(
//         service.createKyc(
//           kycRecord.firstName,
//           kycRecord.lastName,
//           kycRecord.dateOfBirth,
//           kycRecord.address,
//           kycRecord.phoneNumberCountryCode,
//           kycRecord.phoneNumber,
//           kycRecord.ssn,
//           user.id,
//         ),
//       ).rejects.toThrowError(BadRequestException);
//     });
//   });
// });
