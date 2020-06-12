import React from 'react';
import { Layout } from 'antd';
import { styled, theme } from '../theme';
import { Avatar } from '../components/ual/avatar';

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: auto auto;
`;

const StyledHeader = styled(Layout.Header)`
  background-color: #fff;
  padding: 0px;
  box-shadow: ${theme.shadows.small};
`;

const RightContent = styled.div`
  display: flex;
  float: right;
  height: auto;
  margin-left: auto;
  overflow: hidden;
`;

const Logo = styled.img`
  padding-top: 10px;
  height: 44px;
  margin-right: 16px;
  vertical-align: top;
`;

export const Header: React.FC = () => {
  return (
    <StyledHeader>
      <ContentWrapper>
        <Logo alt='logo' src={'images/dfuse-logo.svg'} />
        <RightContent>
          <Avatar />
        </RightContent>
      </ContentWrapper>
    </StyledHeader>
  );
};
