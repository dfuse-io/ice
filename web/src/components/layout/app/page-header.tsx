import React from 'react';
import { Layout } from 'antd';
import { styled } from '../../../theme';
import { theme } from '../../../theme';
import logo from '../../../assets/dfuse-logo.svg';
import { Avatar } from '../../ual/avatar';
const { Header } = Layout;

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

export const PageHeader: React.FC = () => {
  return (
    <Header {...HeaderProps}>
      <ContentWrapper>
        <Logo alt='logo' src={logo} />
        <RightContent>
          <Avatar />
        </RightContent>
      </ContentWrapper>
    </Header>
  );
};
