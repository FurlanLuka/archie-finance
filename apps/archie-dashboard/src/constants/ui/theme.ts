const colors: { [color: string]: string } = {
  black: "#081517",
  white: "#fff",
  coral: "#ff8577",
  coral_400: "#fea298",
  coral_300: "#fcbfb8",
  coral_200: "#fbdcd9",
  alabaster: "#d8e2dc",
  teal_800: "#24464b",
  teal_700: "#40777f",
  teal_600: "#5ca8b3",
  teal_500: "#70d1df",
  teal_400: '98e1ec',
  teal_300: 'b9e9f0',
  teal_200: "#d9f1f4",
  green_600: '#00c853',
  green_500: '#00e676',
  green_400: '#69f0ae',
  neutralgray: "#9fa3a4",
  neutralgray_500: '#818788',
  neutralgray_300: "#bdc0c1",
  neutralgray_200: "#dbdcdd",
  neutralgray_100: "#f9f9f9",
  yellow_500: "#ffea00",
  red_600: "#d50000",
  red_500: "#ff1744",
  red_400: "ff8a80",
  transparent: "transparent",
};

export const theme: { [key: string]: string } = {
  // font
  fontPrimary: "Inter",
  // background
  backgroundPrimary: colors.white,
  backgroundSecondary: colors.neutralgray_100,
  backgroundDisabled: colors.neutralgray_200,
  backgroundAlert: colors.yellow_500,
  backgroundNegative: colors.red_500,
  backgroundSuccess: colors.green_500,
  // text
  textPrimary: colors.black,
  textSecondary: colors.neutralgray,
  textLight: colors.white,
  textPositive: colors.teal_500,
  textHighlight: colors.coral,
  textDisabled: colors.neutralgray_200,
  textDanger: colors.red_600,
  // button
  buttonPrimary: colors.coral,
  buttonOutline: colors.transparent,
  buttonGhost: colors.neutralgray_300,
  buttonLight: colors.white,
  // input
  inputText: colors.black,
  inputTextPlaceholder: colors.neutralgray_300,
  inputRange: colors.coral_200,
  inputRangeFilled: colors.coral,
  // border
  borderPrimary: colors.alabaster,
  borderHighlight: colors.coral,
  borderDisabled: colors.neutralgray_200,
  // tooltip
  tooltipBackground: colors.black,
  tooltipText: colors.white,
  // loader
  loaderBackground: colors.teal_800,
  // table
  tableBorderOuther: colors.neutralgray_500,
  tableBorderInner: colors.neutralgray_200,
  // chars
  loanToValueDefault: colors.teal_200,
  loanToValueActive: colors.green_500,
  // status
  statusSettled: colors.green_500,
  statusPending: colors.black,
};
