export const colors: { [color: string]: string } = {
  black: "#081517",
  white: "#fff",
  coral: "#ff8577",
  alabaster: "#d8e2dc",
  teal: "#70d1df",
  neutralgray: "#9fa3a4",
  lightgray: "#bdc0c1",
  transparent: "transparent",
};

export const theme: { [key: string]: string } = {
  // font
  fontPrimary: "Inter",
  // background
  backgroundPrimary: colors.white,
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
  inputPlaceholder: colors.lightgray,
  // border
  borderPrimary: colors.alabaster,
  borderHighlight: colors.coral,
};
