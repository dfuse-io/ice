import React from 'react';
import { Layout } from 'antd';
import { styled, theme } from '../theme';
import { Avatar } from '../components/ual/avatar';

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: auto auto;
`;

const HeaderProps = {
  style: {
    backgroundColor: '#fff',
    padding: 0,
    boxShadow: theme.shadows.small,
  },
};

const RightContent = styled.div`
  display: flex;
  float: right;
  height: 64px;
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
    <Layout.Header {...HeaderProps}>
      <ContentWrapper>
        <Logo alt='logo' src={'images/dfuse-logo.svg'} />
        <RightContent>
          <Avatar />
        </RightContent>
      </ContentWrapper>
    </Layout.Header>
  );
};
