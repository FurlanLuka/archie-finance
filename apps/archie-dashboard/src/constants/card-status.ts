import { theme } from "../constants/ui/theme"

export enum CardStatus {
  ACTIVE = "active",
  FROZEN = "frozen",
  WARING = "warning",
  MARGIN_CALL = "margin_call",
}

export const CardText = {
  [CardStatus.ACTIVE]: "Active",
  [CardStatus.FROZEN]: "Frozen",
  [CardStatus.WARING]: "Warning",
  [CardStatus.MARGIN_CALL]: "Margin Call",
}

export const CardColor = {
  [CardStatus.ACTIVE]: theme.textSuccess,
  [CardStatus.FROZEN]: theme.textSecondary,
  [CardStatus.WARING]: theme.textWarning,
  [CardStatus.MARGIN_CALL]: theme.textDanger,
}
