import { Body, Controller, Post } from '@nestjs/common';
import { PeachWebhookService } from './peach.service';
import { WebhookPaymentPayload } from '@archie/api/webhook-api/data-transfer-objects';

@Controller('internal/webhook/peach')
export class PeachWebhookController {
  constructor(private peachWebhookService: PeachWebhookService) {}

  @Post('confirmed_payments')
  public async paymentConfirmedHandler() {
    await this.peachWebhookService.handlePaymentConfirmedEvent();
  }

  // Currently used to test the flow as in sandbox confirmed event is not triggered
  @Post('/test/confirmed_payments')
  // BODY example
  // {
  //       accrualDate: null,
  //       amount: 11.0,
  //       caseExternalId: null,
  //       caseId: null,
  //       caseTypeId: null,
  //       companyId: 'CP-25K9-4GJ6',
  //       createdAt: '2022-08-09T22:31:15.172543+00:00',
  //       creatingMessageId: 'cbpe0cr24te00332aql0',
  //       currency: 'USD',
  //       deletedAt: null,
  //       discriminator: '',
  //       effectiveAt: '2022-08-09T22:26:24.610294+00:00',
  //       eventClass: 'PaymentAppliedEvent',
  //       eventType: 'payment.applied',
  //       id: 'EV-KZ1L-NVX9',
  //       interactionId: null,
  //       isExternal: false,
  //       loanExternalId: null,
  //       loanId: 'LN-MJ1M-XPOB',
  //       loanTypeId: 'LT-GDB3-WEBO',
  //       maintenanceDate: null,
  //       object: 'event',
  //       parentId: '0',
  //       paymentInstrumentExternalId: null,
  //       paymentInstrumentId: 'PT-5K93-PGK6',
  //       paymentInstrumentType: 'bankAccount',
  //       personExternalId: null,
  //       personId: 'BO-2KVY-MMXK',
  //       requestId: 'cbpe0cr24te00332aqkg',
  //       sessionId: null,
  //       transactionExternalId: null,
  //       transactionId: 'TX-VK2E-E4VJ',
  //       updatedAt: null,
  //       userId: 'UR-G2K6-VB45',
  //     }
  public async paymentAppliedHandler(@Body() body: WebhookPaymentPayload) {
    await this.peachWebhookService.publishPaymentConfirmedEvent(body);
  }
}
