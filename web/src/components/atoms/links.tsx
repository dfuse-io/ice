import { Link as RouterLink } from 'react-router-dom';
import * as React from 'react';
import { textStyle, TextStyleProps } from '@dfuse/explorer';
import { styled, colors } from '../../theme';

const StyledLink = styled(RouterLink)<TextStyleProps>`
  ${(props) => textStyle(props)}
`;

export const Link = styled.a<TextStyleProps>`
  ${(props) => textStyle({ hover: 'opacity: 0.8;', ...props, hoverable: true })}
`;

export const InternalLink: React.FC<RouterLink['props'] & TextStyleProps> = ({
  to,
  children,
  ...rest
}) => {
  return (
    // @ts-ignore
    <StyledLink
      to={to}
      display='inline'
      color={colors.link400}
      hover='opacity: 0.8;'
      {...rest}
    >
      {children}
    </StyledLink>
  );
};

export const ExternalLink: React.FC<React.ComponentProps<typeof Link>> = (
  props
) => <Link target='_top' {...props} />;
