import { OnboardingUpdatedWsEvent, WsEvent, WsEventType } from '../events';

const isOnboardingUpdatedWsEvent = (event: any): event is OnboardingUpdatedWsEvent => {
  return event?.topic === WsEventType.LTV_UPDATED_TOPIC && event.data !== undefined;
};

export const parseEvent = (event: any): WsEvent | undefined => {
  if (!event?.topic) {
    console.warn('No topic on event');
    return;
  }

  // TODO make this nicer, check by topic and then typeguard is an if?? kinda fugly
  switch (event.topic) {
    case WsEventType.ONBOARDING_UPDATED_TOPIC:
      if (isOnboardingUpdatedWsEvent(event)) {
        return event;
      }

      return;
    default:
      console.warn('Unknown event', event);
      return;
  }
};
