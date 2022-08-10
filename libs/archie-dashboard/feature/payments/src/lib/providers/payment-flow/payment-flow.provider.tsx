import { createContext, FC, PropsWithChildren, useReducer, Dispatch } from 'react';

import { PaymentFlowAction, PaymentFlowState } from './payment-flow.interfaces';
import { initialState, paymentFlowReducer } from './payment-flow.reducer';

const PaymentFlowContext = createContext<PaymentFlowState>(initialState);
const PaymentFlowDispatchContext = createContext<Dispatch<PaymentFlowAction> | null>(null);

type PaymentFlowProviderProps = PropsWithChildren<Record<string, never>>;

export const PaymentFlowProvider: FC<PaymentFlowProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(paymentFlowReducer, initialState);

  return (
    <PaymentFlowDispatchContext.Provider value={dispatch}>
      <PaymentFlowContext.Provider value={state}>{children}</PaymentFlowContext.Provider>
    </PaymentFlowDispatchContext.Provider>
  );
};
