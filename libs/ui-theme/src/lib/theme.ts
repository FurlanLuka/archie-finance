const colors = {
  black: '#081517',
  white: '#fff',
  neutralgray_800: '#263133',
  neutralgray_700: '#444e50',
  neutralgray_600: '#626a6c',
  neutralgray_500: '#818788',
  neutralgray_400: '#9fa3a4',
  neutralgray_300: '#bdc0c1',
  neutralgray_200: '#dbdcdd',
  neutralgray_100: '#f9f9f9',
  coral_800: '#46312f',
  coral_700: '#844d47',
  coral_600: '#c1695f',
  coral_500: '#ff8577',
  coral_400: '#fea298',
  coral_300: '#fcbfb8',
  coral_200: '#fbdcd9',
  teal_800: '#24464b',
  teal_700: '#40777f',
  teal_600: '#5ca8b3',
  teal_500: '#70d1df',
  teal_400: '#98e1ec',
  teal_300: '#b9e9f0',
  teal_200: '#d9f1f4',
  green_600: '#00c853',
  green_500: '#00e676',
  green_400: '#69f0ae',
  yellow_600: '#ffd600',
  yellow_500: '#ffea00',
  yellow_400: '#ffff8d',
  orange_600: '#ff6d00',
  orange_500: '#ff9100',
  orange_400: '#ffd180',
  red_600: '#d50000',
  red_500: '#ff1744',
  red_400: '#ff8a80',
  transparent: 'transparent',
};

export interface Theme {
  // font
  fontPrimary: string;
  // background
  backgroundPrimary: string;
  backgroundSecondary: string;
  backgroundDisabled: string;
  backgroundPositive: string;
  backgroundSuccess: string;
  backgroundAlert: string;
  backgroundWarning: string;
  backgroundDanger: string;
  // text
  textPrimary: string;
  textSecondary: string;
  textLight: string;
  textPositive: string;
  textHighlight: string;
  textDisabled: string;
  textSuccess: string;
  textWarning: string;
  textDanger: string;
  // button
  buttonPrimary: string;
  buttonOutline: string;
  buttonGhost: string;
  buttonLight: string;
  buttonDisabled: string;
  // input
  inputText: string;
  inputTextPlaceholder: string;
  inputRange: string;
  inputRangeFilled: string;
  // border
  borderPrimary: string;
  borderHighlight: string;
  // tooltip
  tooltipBackground: string;
  tooltipText: string;
  // loader
  loaderBackground: string;
  loaderBorder: string;
  loaderBorderTop: string;
  // table
  tableBorderOuther: string;
  tableBorderInner: string;
  // chars
  loanToValueDefault: string;
  loanToValueActive: string;
  nextPaymentDefault: string;
  nextPaymentActive: string;
  collateralValue: string;
  // status
  statusSettled: string;
  statusPending: string;
}

export const theme: Theme = {
  // font
  fontPrimary: 'Inter',
  // background
  backgroundPrimary: colors.white,
  backgroundSecondary: colors.neutralgray_100,
  backgroundDisabled: colors.neutralgray_200,
  backgroundPositive: colors.teal_400,
  backgroundSuccess: colors.green_500,
  backgroundAlert: colors.yellow_500,
  backgroundWarning: colors.orange_500,
  backgroundDanger: colors.red_500,
  // text
  textPrimary: colors.black,
  textSecondary: colors.neutralgray_400,
  textLight: colors.white,
  textPositive: colors.teal_500,
  textHighlight: colors.coral_500,
  textDisabled: colors.neutralgray_200,
  textSuccess: colors.green_500,
  textWarning: colors.orange_500,
  textDanger: colors.red_600,
  // button
  buttonPrimary: colors.coral_500,
  buttonOutline: colors.transparent,
  buttonGhost: colors.white,
  buttonLight: colors.white,
  buttonDisabled: colors.neutralgray_200,
  // input
  inputText: colors.black,
  inputTextPlaceholder: colors.neutralgray_300,
  inputRange: colors.coral_200,
  inputRangeFilled: colors.coral_500,
  // border
  borderPrimary: colors.neutralgray_200,
  borderHighlight: colors.coral_500,
  // tooltip
  tooltipBackground: colors.black,
  tooltipText: colors.white,
  // loader
  loaderBackground: colors.teal_800,
  loaderBorder: colors.neutralgray_300,
  loaderBorderTop: colors.neutralgray_400,
  // table
  tableBorderOuther: colors.neutralgray_500,
  tableBorderInner: colors.neutralgray_200,
  // chars
  loanToValueDefault: colors.teal_200,
  loanToValueActive: colors.green_500,
  nextPaymentDefault: colors.neutralgray_200,
  nextPaymentActive: colors.teal_500,
  collateralValue: colors.green_500,
  // status
  statusSettled: colors.green_500,
  statusPending: colors.black,
};
