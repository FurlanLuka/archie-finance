import { LtvUpdatedWsEvent, OnboardingUpdatedWsEvent, WsEvent, WsEventTopic } from '../events';

const isOnboardingUpdatedWsEvent = (event: any): event is OnboardingUpdatedWsEvent => {
  return event?.topic === WsEventTopic.ONBOARDING_UPDATED_TOPIC && event.data !== undefined;
};

const isLtvUpdatedWsEvent = (event: any): event is LtvUpdatedWsEvent => {
  return event?.topic === WsEventTopic.LTV_UPDATED_TOPIC && event.data !== undefined;
};

export const parseWsEvent = (event: any): WsEvent | undefined => {
  console.log('Handling event', event);
  if (!event?.topic) {
    console.warn('No topic on event');
    return;
  }

  // TODO make this nicer, check by topic and then typeguard is an if?? kinda fugly
  switch (event.topic) {
    case WsEventTopic.ONBOARDING_UPDATED_TOPIC:
      if (isOnboardingUpdatedWsEvent(event)) {
        return event;
      }

      return;
    case WsEventTopic.LTV_UPDATED_TOPIC:
      if (isLtvUpdatedWsEvent(event)) {
        return event;
      }

      return;
    default:
      console.warn('Unknown event', event);
      return;
  }
};
