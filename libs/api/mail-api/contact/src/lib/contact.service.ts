import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './contact.entity';
import { Repository } from 'typeorm';
import { CryptoService } from '@archie/api/utils/crypto';
import { DecryptedContact } from './contact.interfaces';

@Injectable()
export class ContactService {
  constructor(
    private cryptoService: CryptoService,
    @InjectRepository(Contact) private contactRepository: Repository<Contact>,
  ) {}

  public async saveFirstName(userId: string, firstName: string): Promise<void> {
    const encryptedFirstName: string = this.cryptoService.encrypt(firstName);

    await this.contactRepository.upsert(
      {
        userId,
        encryptedFirstName,
      },
      {
        conflictPaths: ['userId'],
      },
    );
  }

  public async saveEmail(userId: string, email: string): Promise<void> {
    const encryptedEmail: string = this.cryptoService.encrypt(email);

    await this.contactRepository.upsert(
      {
        userId,
        encryptedEmail,
      },
      {
        conflictPaths: ['userId'],
      },
    );
  }

  public async getContact(userId: string): Promise<DecryptedContact> {
    const contact: Contact = await this.contactRepository.findOneBy({
      userId,
    });

    const [firstName, email] = this.cryptoService.decryptMultiple([
      contact.encryptedFirstName,
      contact.encryptedEmail,
    ]);

    return { firstName, email };
  }
}
