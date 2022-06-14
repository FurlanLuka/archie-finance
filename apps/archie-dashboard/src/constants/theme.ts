export const colors: { [color: string]: string } = {
  black: "#081517",
  white: "#fff",
  coral: "#ff8577",
  coral_400: "#fea298",
  coral_300: "#fcbfb8",
  coral_200: "#fbdcd9",
  alabaster: "#d8e2dc",
  teal: "#70d1df",
  teal_800: "#24464b",
  neutralgray: "#9fa3a4",
  neutralgray_300: "#bdc0c1",
  neutralgray_200: "#dbdcdd",
  neutralgray_100: "#f9f9f9",
  yellow_500: "#ffea00",
  red_600: "#d50000",
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
  // text
  textPrimary: colors.black,
  textSecondary: colors.neutralgray,
  textLight: colors.white,
  textPositive: colors.teal,
  textHighlight: colors.coral,
  textDisabled: colors.neutralgray_200,
  textDanger: colors.red_600,
  // button
  buttonPrimary: colors.coral,
  buttonOutline: colors.transparent,
  buttonGhost: colors.neutralgray_300,
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
};
