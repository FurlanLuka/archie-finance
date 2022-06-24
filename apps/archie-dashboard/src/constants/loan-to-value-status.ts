import { theme } from "../constants/ui/theme"

export enum LoanToValueStatus {
  GOOD = "good",
  OK = "ok",
  WARING = "warning",
  MARGIN_CALL = "margin_call",
}

export const LoanToValueText = {
  [LoanToValueStatus.GOOD]: "Good",
  [LoanToValueStatus.OK]: "Ok",
  [LoanToValueStatus.WARING]: "Warning",
  [LoanToValueStatus.MARGIN_CALL]: "Margin Call",
}

export const LoanToValueColor = {
  [LoanToValueStatus.GOOD]: theme.textSuccess,
  [LoanToValueStatus.OK]: theme.textWarning,
  [LoanToValueStatus.WARING]: theme.textWarning,
  [LoanToValueStatus.MARGIN_CALL]: theme.textDanger,
}
