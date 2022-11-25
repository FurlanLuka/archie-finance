import {
  setupAmqpConnection,
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
import { CREDIT_LINE_BASE_URL } from '../config';

/*
 Required services:
   - Ledger api
   - Ltv api
   - Credit line api
   Each requires manually created database

 Before running the script:
   - Add ETH asset price to ledger-api database - asset_prices table (worth at least 1500 USD)
   - Uncomment one of the options (10k or 100k)
 After running the script:
   - Change ETH price to 1000
   - Port forward ledger api and call POST `/internal/ledger/recalculate`
*/

// **10k options**
// export const options = {
//   scenarios: {
//     ok_ltv: {
//       executor: 'per-vu-iterations',
//       vus: 10,
//       iterations: 700, // vus * iterations = total number of users created = 7000
//       maxDuration: '60m',
//       env: { LTV: '0.4' },
//     },
//     danger_ltv: {
//       executor: 'per-vu-iterations',
//       vus: 10,
//       iterations: 100, // 1000
//       maxDuration: '60m',
//       env: { LTV: '0.7' },
//     },
//     margin_call_ltv: {
//       executor: 'per-vu-iterations',
//       vus: 10,
//       iterations: 100, // 1000
//       maxDuration: '60m',
//       env: { LTV: '0.81' },
//     },
//     liquidation_ltv: {
//       executor: 'per-vu-iterations',
//       vus: 10,
//       iterations: 100, // 1000
//       maxDuration: '60m',
//       env: { LTV: '0.91' },
//     },
//   },
// };

// **100k options**
// export const options = {
//   scenarios: {
//     ok_ltv: {
//       executor: 'per-vu-iterations',
//       vus: 10,
//       iterations: 7000, // vus * iterations = total number of users created = 70_000
//       maxDuration: '60m',
//       env: { LTV: '0.4' },
//     },
//     danger_ltv: {
//       executor: 'per-vu-iterations',
//       vus: 10,
//       iterations: 1000, // 10_000
//       maxDuration: '60m',
//       env: { LTV: '0.7' },
//     },
//     margin_call_ltv: {
//       executor: 'per-vu-iterations',
//       vus: 10,
//       iterations: 1000, // 10_000
//       maxDuration: '60m',
//       env: { LTV: '0.81' },
//     },
//     liquidation_ltv: {
//       executor: 'per-vu-iterations',
//       vus: 10,
//       iterations: 1000, // 10_000
//       maxDuration: '60m',
//       env: { LTV: '0.91' },
//     },
//   },
// };

export function setup(): void {
  setupAmqpConnection();
}

function createCreditLine(accessToken: string): void {
  const response = httpPost({
    uri: `${CREDIT_LINE_BASE_URL}/v2/credit_lines`,
    accessToken,
  });

  if (response.status === 400) {
    // Retry until deposit event is handled
    createCreditLine(accessToken);
  }
}

const targetLedgerPrice = 1_000;

export default function (): void {
  const userId: string = uuidv4();
  const accessToken: string = createAccessToken(userId);

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
      availableCreditAmount: targetLedgerPrice * 0.65 - 10,
      creditLimitAmount: targetLedgerPrice * 0.65,
      utilizationAmount: Number(__ENV.LTV) * targetLedgerPrice,
    }),
  );
  console.log('User setup count: ', __ITER);
}
