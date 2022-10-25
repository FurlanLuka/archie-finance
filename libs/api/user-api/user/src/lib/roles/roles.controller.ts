import { Controller } from '@nestjs/common';
import {
  DEFAULT_ROLE_MIGRATION_TOPIC,
  KYC_SUBMITTED_TOPIC,
  SERVICE_QUEUE_NAME,
} from '@archie/api/user-api/constants';
import { Subscribe } from '@archie/api/utils/queue/decorators/subscribe';
import { KycSubmittedPayload } from '@archie/api/user-api/data-transfer-objects';
import { RolesService } from './roles.service';

@Controller()
export class RolesQueueController {
  constructor(private rolesService: RolesService) {}

  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-roles`;

  @Subscribe(KYC_SUBMITTED_TOPIC, RolesQueueController.CONTROLLER_QUEUE_NAME)
  async handleKycSubmittedEvent(payload: KycSubmittedPayload): Promise<void> {
    return this.rolesService.addDefaultRole(payload.userId);
  }

  @Subscribe(
    DEFAULT_ROLE_MIGRATION_TOPIC,
    RolesQueueController.CONTROLLER_QUEUE_NAME,
    {
      autoDelete: true,
      useIdempotency: false,
      requeueOnError: false,
    },
  )
  async handleDefaultRoleMigration(_payload: unknown): Promise<void> {
    return this.rolesService.addDefaultRoleToAllExistingUsers();
  }
}
