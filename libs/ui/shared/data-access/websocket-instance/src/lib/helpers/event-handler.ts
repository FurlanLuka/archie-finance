import {
  LedgerUpdatedWsEvent,
  LtvUpdatedWsEvent,
  OnboardingUpdatedWsEvent,
  WsEvent,
  WsEventTopic,
} from '../events';

const isOnboardingUpdatedWsEvent = (
  event: any,
): event is OnboardingUpdatedWsEvent => {
  return (
    event?.topic === WsEventTopic.ONBOARDING_UPDATED_TOPIC &&
    event.data !== undefined
  );
};

const isLtvUpdatedWsEvent = (event: any): event is LtvUpdatedWsEvent => {
  return (
    event?.topic === WsEventTopic.LTV_UPDATED_TOPIC && event.data !== undefined
  );
};

const isLedgerUpdatedWsEvent = (event: any): event is LedgerUpdatedWsEvent => {
  return (
    event?.topic === WsEventTopic.LEDGER_UPDATED_TOPIC &&
    event.data !== undefined
  );
};

const eventGuards = new Map<WsEventTopic, (event: any) => boolean>([
  [WsEventTopic.ONBOARDING_UPDATED_TOPIC, isOnboardingUpdatedWsEvent],
  [WsEventTopic.LTV_UPDATED_TOPIC, isLtvUpdatedWsEvent],
  [WsEventTopic.LEDGER_UPDATED_TOPIC, isLedgerUpdatedWsEvent],
]);

export const parseWsEvent = (event: any): WsEvent | undefined => {
  console.log('Handling event', event);
  if (!event?.topic) {
    console.warn('No topic on event');
    return;
  }

  const eventGuard = eventGuards.get(event.topic);

  // if we don't handle the event yet
  if (!eventGuard) {
    return;
  }

  if (eventGuard(event)) {
    return event;
  }

  console.warn('Malformed event structure', event);
  return;
};
