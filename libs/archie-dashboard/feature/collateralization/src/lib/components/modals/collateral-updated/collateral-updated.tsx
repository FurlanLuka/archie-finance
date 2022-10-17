import { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { calculateLedgerCreditValue } from '@archie-webapps/archie-dashboard/utils';
import { Modal } from '@archie-webapps/shared/ui/design-system';

import { CollateralReceived } from './blocks/collateral-received/collateral-received';
import { useGetLedger } from '@archie-webapps/shared/data-access/archie-api/ledger/hooks/use-get-ledger';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';
import { calculateLedgerTotalValue } from '@archie-webapps/shared/utils';
import {
  LedgerUpdatedWsEvent,
  websocketInstance,
  WsEventTopic,
} from '@archie-webapps/shared/data-access/websocket-instance';
import { LedgerActionType } from '@archie-webapps/shared/data-access/archie-api-dtos';

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
      websocketInstance.removeHandler(WsEventTopic.LEDGER_UPDATED_TOPIC, COLLATERAL_DEPOSITED_HANDLER_ID);
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

    return calculateLedgerTotalValue(getLedgerResponse.data.accounts).toString();
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
