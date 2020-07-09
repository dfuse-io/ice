export const STANDARD_PADDING = '20px 50px';
export const MOBILE_PADDING = '20px 12px';
export const STANDARD_SHADOW =
  '0 2px 4px rgba(0, 0, 0, .05), 0 2px 10px rgba(0, 0, 0, .05)';
export const RADIUS = '4px';

export const BREAKPOINTS = {
  small: 768,
  medium: 1280,
  large: 1440,
};

export const MEDIA_QUERIES = {
  smallOnly: `@media (max-width: ${BREAKPOINTS.small - 1}px)`,
  small: `@media (min-width: ${BREAKPOINTS.small}px)`,
  medium: `@media (min-width: ${BREAKPOINTS.medium}px)`,
  large: `@media (min-width: ${BREAKPOINTS.large}px)`,
};

export const SHADOWS = {
  small: '0 0 4px rgba(0, 0, 0, .125)',
  large: '0 0 24px rgba(0, 0, 0, .125)',
};
