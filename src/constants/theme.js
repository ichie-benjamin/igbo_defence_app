import { Dimensions } from "react-native"

const { width, height } = Dimensions.get("window")

const COLORS = {
  light : {
    primary: "#FEEF04",
    success: "#20af13",
    bgSuccessLighter: "rgba(219, 255, 234, 1)",
    bgSuccessLighterDark: "rgba(68, 179, 115, 0.1)",

    bgSuccessLight: "rgba(204, 240, 254, 1)",
    bgSuccessLightDark: "rgba(25, 95, 184, 0.1)",

    bgSecondaryDark: "rgba(239, 93, 168, 0.15)",

    textColor: "#ffffff",

    textPrimaryColor: "#ffffff",
    textSecondaryColor: "#1F1F1F",

    textCaptionColor: "#8F94A3",

    bgActionSecondary: "#FCDDEC",

    secondary: "#FCDDEC",

    blue: "rgba(14, 6, 71, 1)",

    tertiary: "#63a3e3",
    lightPrimary: "rgb(220,112,99)",
    textPrimary: "#ED3237",
    btnColor: "#ED3237",
    danger: "#f00f0f",
    lightDanger: "#ce5d5d",

    transparentGray: "rgba(77,77,77, 0.8)",
    lightGray: "rgba(199,200,203,0.8)",

    gray: "#dccccc",


    inputBGColor: "#ffffff",

    borderColor: "#ccc",
    light_white: "#ccc",

    bg: "#000000",
    bgPrimary: "#FEEF04",
    bgPrimaryLight: "#e9e9f5",
    bgTransparentPrimary: "rgba(247, 247, 248, 0.5)",

    bgSecondary: "#ED3237",
    textSecondary: "#FBA83C",
    warning: "#FBA83C",
    white: "#ffffff",

    textWhite: "#FAFCFF",

    bg_trans : ['rgba(255, 255, 255, 1)', '#ffffff'],

    textGray: "rgba(63, 65, 68, 1)",

    // bgGradient : ['rgba(183, 9, 103, 1)','rgba(255, 113, 21, 1)'],
    bgGradient : ['rgba(183, 9, 103, 1)','rgba(255, 113, 21, 1)'],


    bgLightGradient : ['rgb(220,112,99)','rgb(220,112,99)'],

    // ['#FF7115', '#B70967']

    accent: "#0891b2",
    tint: "#111827",



    transparentBlack1: "rgba(2, 2, 2, 0.1)",
    transparentBlack2: "rgba(2, 2, 2, 0.3)",

    inverseColor : "#1f2937",
  },

  dark : {
    inverseColor : "#f7f7f8",

    gray: "#a39292",

    textGray: "rgb(150,154,159)",

    textCaptionColor: "#8F94A3",

    bgPrimary: "#1f2937",

    bgPrimaryLoading: "rgba(31, 41, 55, 0.5)",

    bgPrimaryLight: "rgba(15,20,25,0.45)",
    bgTransparentPrimary: "rgba(31, 41, 55, 0.5)",

    success: "#20af13",
    bgSuccessLighter: "rgb(71,106,85)",
    bgSuccessLighterDark: "rgba(68, 179, 115, 0.1)",

    bgActionSecondary: "#846f7a",

    textWhite: "#FAFCFF",

    bg_trans : [ '#6d7787', '#7f8795'],

    bgSuccessLight: "rgb(49,81,92)",
    bgSuccessLightDark: "rgba(25, 95, 184, 0.1)",

    borderColor: "#ccc",
    inputBGColor: "#111827",
    danger: "#f00f0f",
    lightDanger: "#f85353",

    // bgGradient : ['rgba(183, 9, 103, 1)','rgba(255, 113, 21, 1)'],
    bgGradient : ['rgb(4,32,48)','rgba(15,20,25,0.45)'],


    bgLightGradient : ['rgb(4,32,48)','rgba(15,20,25,0.45)'],


    transparentGray: "rgba(77,77,77, 0.8)",
    lightGray: "rgba(199,200,203,0.8)",



    primary: "#042030",
    bg: "#1f2937",
    black: "#1f2937",
    secondary: "#111827",
    textSecondary: "#FBA83C",
    white: "#6d7787",
    textColor: "#ffffff",
    tertiary: "#d1d5db",
    accent: "#0891b2",
    tint: "#f9fafb",
  },


  primary: "#0A8791",

  textSecondary : "rgba(255, 113, 21, 1)",


  black: "#111111",
  light_white: "#f7f7f8",
  // light_white: '#f7f7f8',
  link_color: "#626ABB",
  darkGreen: "#229879",
  white: "#FFFFFF",
  gray1: "#626262",
  accent: "#F54747",
  themeColor: "#626ABB",

  danger: "#f00f0f",
  lightBlue: "#CED6E1",
  // textColor: "#798494",

  textColor: "#3F4144",

  textCaptionColor: "#f00f0f",

  secondary: "rgba(0, 179, 174, 0.1)",
  darkBlue: "#1B293D",
  mainColor: "#121533",
  transparent: "transparent",

  transparentBlack1: "rgba(2, 2, 2, 0.1)",
  transparentBlack3: "rgba(2, 2, 2, 0.3)",
  transparentBlack5: "rgba(2, 2, 2, 0.5)",
  transparentBlack7: "rgba(2, 2, 2, 0.7)",
  transparentBlack9: "rgba(2, 2, 2, 0.9)",

  transparentGray: "rgba(77,77,77, 0.8)",
  transparentDarkGray: "rgba(20,20,20, 0.9)",

  white2: "#F9F9F9",
  blue: "#4096FE",
  gray: "#777777",
  gray2: "#F8F8F8",
  lightGray: "rgba(199,200,203,0.8)",
  lightGray2: "rgba(251,245,245,0.81)",

  secondary_text_color: "#767787",

  dark_gray_text: "#AAAAAA",
  text_color: "#121533",
}

const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  // font sizes
  largeTitle: 40,
  h1: 30,
  h2: 22,
  small_h2: 20,
  h3: 16,
  h4: 14,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
  body5: 12,

  // app dimensions
  width,
  height,
}

const FONTS = {
  H1: {
    fontFamily: "RobotoBold",
    fontSize: 48,
    lineHeight: 48 * 1.2,
  },
  H2: {
    fontFamily: "RobotoBold",
    fontSize: 30,
    lineHeight: 30 * 1.2,
  },
  H3: {
    fontFamily: "RobotoBold",
    fontSize: 24,
    lineHeight: 24 * 1.2,
  },
  H4: {
    fontFamily: "RobotoRegular",
    fontSize: 20,
    lineHeight: 20 * 1.2,
  },
  H5: {
    fontFamily: "RobotoBold",
    fontSize: 16,
    lineHeight: 16 * 1.6,
  },
  bodyText: {
    fontFamily: "RobotoRegular",
    fontSize: 16,
    height: 16 * 1.6,
  },

  Font_Reguler: "RobotoRegular",
  Font_Semibold: "RobotoMedium",
  Font_Bold: "RobotoBold",
  smallText: {
    fontFamily: "RobotoRegular",
    fontSize: 12,
    lineHeight: 10 * 1.6,
  },
  h2: { fontFamily: "RobotoRegular", fontSize: SIZES.h2, lineHeight: 30 },
  small_h2: { fontFamily: "RobotoRegular", fontSize: SIZES.small_h2, lineHeight: 28 },
  h3: { fontFamily: "RobotoRegular", fontSize: SIZES.h3, lineHeight: 25 },
  h4: { fontFamily: "RobotoBold", fontSize: SIZES.h4, lineHeight: 20 * 1.2 },
}

const theme = {
  COLORS,
  FONTS,
}

export { theme, COLORS, FONTS, SIZES }
