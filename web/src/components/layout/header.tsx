import React from 'react';
import { Sider, SiderMenu } from '@dfuse/explorer';
import { WidthWrapper } from '../atoms/width-wrapper';
import {
  styled,
  colors,
  STANDARD_SHADOW,
  MEDIA_QUERIES,
  STANDARD_PADDING,
  MOBILE_PADDING,
} from '../../theme';

import { LogoDfuse, IconGitHub } from '../svg';
import { ExternalLink } from '../atoms/links';
import { Avatar } from '../../components/ual/avatar';

const RightContent = styled.div`
  display: flex;
  float: right;
  height: auto;
  margin-left: auto;
  overflow: hidden;
`;

const HeaderFullWidthWrapper = styled.div`
  display: flex;
  width: 100%;
  margin: 10px 0px;
  padding: 25px 0px;
  padding: ${STANDARD_PADDING};
  position: relative;
  ${MEDIA_QUERIES.smallOnly} {
    padding: ${MOBILE_PADDING};
    margin: 0px;
  }
  div {
    padding: 0px;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  top: 0;
  left: 0;
  background-color: ${colors.ternary900};
  color: white;
  box-shadow: ${STANDARD_SHADOW};

  ${MEDIA_QUERIES.smallOnly} {
    position: relative;
    min-height: 0;
    padding-top: 0px;
  }
`;

const Tagline = styled.span`
  justify-self: flex-start;
  font-size: 11px;
  line-height: 14px;
  margin-left: 16px;
  text-transform: uppercase;
  text-align: left;
  padding-top: 5px;
  letter-spacing: 1px;

  ${MEDIA_QUERIES.smallOnly} {
    display: none;
  }

  ${MEDIA_QUERIES.small} {
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;

  ${MEDIA_QUERIES.smallOnly} {
    margin-bottom: 20px;
    flex-direction: row;
    margin-bottom: 0px;
    svg {
      height: 40px;
    }
  }
`;

const DfuseBar = styled.div`
  background-color: ${colors.ternary1000};
  padding: 10px 20px;
  ${MEDIA_QUERIES.smallOnly} {
    padding: 10px 14px;
  }
`;

const HeaderWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 5fr 2fr;
  ${MEDIA_QUERIES.smallOnly} {
    grid-template-columns: 1fr 5fr;
    grid-gap: 15px;
  }
`;

export const Header: React.FC = ({ children }) => {
  return (
    <HeaderContainer>
      <DfuseBar>
        <Sider>
          <ExternalLink href='https://dfuse.io' hover='opacity: 0.8;'>
            <LogoDfuse fill='white' height='20px' />
          </ExternalLink>
          <SiderMenu>
            <ExternalLink href='https://docs.dfuse.io/'>
              Start a project with dfuse
            </ExternalLink>
            <ExternalLink
              href='https://github.com/dfuse-io'
              hover='opacity: 0.8;'
            >
              <IconGitHub fill={colors.ternary400} height='20px' />
            </ExternalLink>
          </SiderMenu>
        </Sider>
      </DfuseBar>
      <HeaderFullWidthWrapper>
        <WidthWrapper>
          <HeaderWrapper>
            <LogoContainer>
              <Tagline>
                POLL IDEAS WITH ICE
                <br />
                CALCULATION CONCEPT
              </Tagline>
            </LogoContainer>
            {children}
            <RightContent>
              <Avatar />
            </RightContent>
          </HeaderWrapper>
        </WidthWrapper>
      </HeaderFullWidthWrapper>
    </HeaderContainer>
  );
};
