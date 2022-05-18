export const colors: { [color: string]: string } = {
  black: "#081517",
  white: "#fff",
  coral: "#ff8577",
  coral_400: "#fea298",
  coral_300: "#fcbfb8",
  coral_200: "#fbdcd9",
  alabaster: "#d8e2dc",
  teal: "#70d1df",
  neutralgray: "#9fa3a4",
  lightgray: "#bdc0c1",
  yellow: "#ffea00",
  transparent: "transparent",
};

export const theme: { [key: string]: string } = {
  // font
  fontPrimary: "Inter",
  // background
  backgroundPrimary: colors.white,
  backgroundAlert: colors.yellow,
  // text
  textPrimary: colors.black,
  textSecondary: colors.neutralgray,
  textLight: colors.white,
  textHighlight: colors.coral,
  // button
  buttonPrimary: colors.coral,
  buttonOutline: colors.transparent,
  // input
  inputText: colors.black,
  inputTextPlaceholder: colors.lightgray,
  inputRange: colors.coral_200,
  inputRangeFilled: colors.coral,
  // border
  borderPrimary: colors.alabaster,
  borderHighlight: colors.coral,
};
