import {
  setupAmqpConnection,
  getOptions,
  createAccessToken,
  uuidv4,
  httpPost,
  publishQueueMessage,
} from '../utils';
import { COLLATERAL_DEPOSIT_TRANSACTION_COMPLETED_TOPIC } from '@archie/api/fireblocks-api/constants';
import { SERVICE_QUEUE_NAME as LEDGER_API_QUEUE_NAME } from '@archie/api/ledger-api/constants';
import { collateralDepositTransactionCompletedPayloadFactory } from '@archie/api/fireblocks-api/test-data';
import { CREDIT_BALANCE_UPDATED_TOPIC } from '@archie/api/peach-api/constants';
import { SERVICE_QUEUE_NAME as LTV_API_QUEUE_NAME } from '@archie/api/ltv-api/constants';
import { creditBalanceUpdatedFactory } from '@archie/api/peach-api/test-data';
/*
 Required services:
   - Ledger api
   - Ltv api
   - Credit line api

 Before running the script:
   - Add ETH asset price to ledger-api database - asset_prices table
 After running the script:
   - Change ETH price (Optional)
   - Port forward ledger api and call
*/

interface User {
  id: string;
  accessToken: string;
}

export const options = getOptions();

const paralelism = Number(__ENV.PARALLELISM ?? '1');

const numberOfUsers = 10_000 / paralelism;
let users: User[] = [];

function createCreditLine(accessToken: string) {
  const CREDIT_LINE_BASE_URL: string = __ENV.CREDIT_LINE_BASE_URL;

  // Setup credit line
  const response = httpPost({
    uri: `${CREDIT_LINE_BASE_URL}/v2/credit_lines`,
    accessToken,
  });

  if (response.status === 400) {
    createCreditLine(accessToken);
  }
}

export function setup(): void {
  setupAmqpConnection();
  const initialEthPrice = 1_000;

  // Setup x k users - env variable. Default is 10k
  for (let i = 0; i < numberOfUsers; i++) {
    const userId: string = uuidv4();
    const accessToken: string = createAccessToken(userId);
    users.push({
      id: userId,
      accessToken,
    });

    // Setup ledger api
    const ledgerApiDepositControllerQueuePrefix = `${LEDGER_API_QUEUE_NAME}-ledger`;
    publishQueueMessage(
      COLLATERAL_DEPOSIT_TRANSACTION_COMPLETED_TOPIC,
      ledgerApiDepositControllerQueuePrefix,
      collateralDepositTransactionCompletedPayloadFactory({
        userId,
        amount: '1',
        assetId: 'ETH',
      }),
    );

    // Setup credit line
    createCreditLine(accessToken);

    // Setup ltv api
    const ltvApiControllerQueuePrefix = `${LTV_API_QUEUE_NAME}-ledger`;
    publishQueueMessage(
      CREDIT_BALANCE_UPDATED_TOPIC,
      ltvApiControllerQueuePrefix,
      creditBalanceUpdatedFactory({
        userId,
        availableCreditAmount: initialEthPrice * 0.65 - 10,
        creditLimitAmount: initialEthPrice * 0.65,
        utilizationAmount: 10,
      }),
    );
    console.log('User setup count: ', i + 1);
  }

  // TODO: set new eth price
  // trigger ledger recalculation
}

export default function (): void {
  // trigger ledger recalculation
}
