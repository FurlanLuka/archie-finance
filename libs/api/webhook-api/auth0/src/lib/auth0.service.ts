import { Injectable, Logger } from '@nestjs/common';
import { QueueService } from '@archie/api/utils/queue';
import { Auth0Events, Auth0Log, Auth0Logs } from './auth0.interfaces';
import {
  EMAIL_VERIFIED_TOPIC,
  MFA_ENROLLED_TOPIC,
} from '@archie/api/user-api/constants';

@Injectable()
export class Auth0Service {
  constructor(private queueService: QueueService) {}

  public webhookHandler(payload: Auth0Logs): void {
    payload.logs.forEach((log: Auth0Log) => {
      try {
        if (log.data.type === Auth0Events.EMAIL_VERIFIED) {
          this.queueService.publishEvent(EMAIL_VERIFIED_TOPIC, {
            userId: log.data.details.query.user_id,
            email: log.data.details.query.email,
          });
        } else if (log.data.type === Auth0Events.MFA_ENROLLED) {
          this.queueService.publishEvent(MFA_ENROLLED_TOPIC, {
            userId: log.data.details.query.user_id,
          });
        }
      } catch {
        Logger.error('Failed processing auth0 webhook');
      }
    });
  }
}
