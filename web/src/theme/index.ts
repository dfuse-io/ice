import emotionStyled, { CreateStyled } from "@emotion/styled";
import { colors } from "./colors";
import { fonts } from "./fonts";
import { breakpoints, fontSizes, lineHeights, shadows, space } from "./scales";

export const theme = {
  breakpoints,
  fontSizes,
  lineHeights,
  space,
  colors,
  fonts,
  shadows,

  Link: {
    color: colors.primary5,
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export type ThemeInterface = typeof theme;

export const styled = emotionStyled as CreateStyled<ThemeInterface>;