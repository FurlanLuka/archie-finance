import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@archie/api/utils/auth0';
import { LedgerService } from './ledger.service';
import {
  InitiateLedgerRecalculationCommandPayload,
  Ledger,
} from '@archie/api/ledger-api/data-transfer-objects';
import { Subscribe } from '@archie/api/utils/queue/decorators/subscribe';
import {
  INITIATE_LEDGER_RECALCULATION_COMMAND,
  SERVICE_QUEUE_NAME,
} from '@archie/api/ledger-api/constants';
import { QueueService } from '@archie/api/utils/queue';
import { Logger } from '@nestjs/common';

@Controller('v1/ledger')
export class LedgerController {
  constructor(private ledgerService: LedgerService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getLedger(@Req() request): Promise<Ledger> {
    return this.ledgerService.getLedger(request.user.sub);
  }
}

@Controller('internal/ledger')
export class InternalLedgerController {
  constructor(private ledgerService: LedgerService, private queueService: QueueService) {}

  @Post('recalculate')
  async recaltulateLedgers(): Promise<void> {
    return this.ledgerService.initiateLedgerRecalculation();
  }

  @Get()
  async test(): Promise<void> {
    this.queueService.publishEvent(INITIATE_LEDGER_RECALCULATION_COMMAND, {
      userIds: []
    })
  }
}

@Controller()
export class LedgerQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-ledger`;

  constructor(private ledgerService: LedgerService) {}

  @Subscribe(
    INITIATE_LEDGER_RECALCULATION_COMMAND,
    LedgerQueueController.CONTROLLER_QUEUE_NAME,
    {
      useIdempotency: true,
    },
  )
  async recalculationCommandHandler(
    payload: InitiateLedgerRecalculationCommandPayload,
  ): Promise<void> {
    Logger.log('sup bitchessss')
    return this.ledgerService.initiateLedgerRecalcuationCommandHandler(payload);
  }
}
