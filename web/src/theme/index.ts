import emotionStyled, { CreateStyled } from '@emotion/styled';
import { colors } from './colors';
import { fonts } from './fonts';
export * from './colors';
export * from './scales';

export const theme = {
  fonts,
  Link: {
    color: colors.primary5,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export type ThemeInterface = typeof theme;

export const styled = emotionStyled as CreateStyled<ThemeInterface>;
