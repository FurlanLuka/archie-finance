import { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { calculateLedgerCreditValue } from '@archie/ui/dashboard/utils';
import { LedgerActionType } from '@archie/ui/shared/data-access/archie-api-dtos';
import { RequestState } from '@archie/ui/shared/data-access/archie-api/interface';
import { useGetLedger } from '@archie/ui/shared/data-access/archie-api/ledger/hooks/use-get-ledger';
import {
  LedgerUpdatedWsEvent,
  websocketInstance,
  WsEventTopic,
} from '@archie/ui/shared/data-access/websocket-instance';
import { Modal } from '@archie/ui/shared/design-system';
import { calculateLedgerTotalValue } from '@archie/ui/shared/utils';

import { CollateralReceived } from './blocks/collateral-received/collateral-received';

const COLLATERAL_DEPOSITED_HANDLER_ID = 'CollateralUpdatedModal.ledger-updated';

export const CollateralUpdatedModal: FC = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const getLedgerResponse = useGetLedger();

  // The query data gets changed instantly
  const handleLedgerUpdatedEvent = (event: LedgerUpdatedWsEvent): void => {
    if (event.data.action.type === LedgerActionType.DEPOSIT) {
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    websocketInstance.addHandler(
      WsEventTopic.LEDGER_UPDATED_TOPIC,
      COLLATERAL_DEPOSITED_HANDLER_ID,
      handleLedgerUpdatedEvent,
    );

    return () => {
      websocketInstance.removeHandler(
        WsEventTopic.LEDGER_UPDATED_TOPIC,
        COLLATERAL_DEPOSITED_HANDLER_ID,
      );
    };
  }, []);

  const ledgerCreditValue = useMemo(() => {
    if (getLedgerResponse.state !== RequestState.SUCCESS) {
      return '';
    }

    return calculateLedgerCreditValue(getLedgerResponse.data.accounts);
  }, [getLedgerResponse]);

  const ledgerTotalValue = useMemo(() => {
    if (getLedgerResponse.state !== RequestState.SUCCESS) {
      return '';
    }

    return calculateLedgerTotalValue(
      getLedgerResponse.data.accounts,
    ).toString();
  }, [getLedgerResponse]);

  if (isModalOpen) {
    return (
      <Modal isOpen={true} maxWidth="800px">
        <CollateralReceived
          onConfirm={() => {
            setIsModalOpen(false);
            navigate('/collateral');
          }}
          collateralValue={ledgerTotalValue}
          creditValue={ledgerCreditValue}
        />
      </Modal>
    );
  }

  return <></>;
};
