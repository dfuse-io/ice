import React from 'react';
import { Layout, Tag } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { styled } from '../theme';
import { useAppState } from '../state/state';
import { Header } from './header';

const { Footer, Content } = Layout;

const ContentWrapper = styled.div`
  max-width: 600px;
  padding: 100px 50px 0px;
  margin: auto auto;
`;

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { lastSeenBlock } = useAppState();
  return (
    <Layout>
      <Header />
      <Content>
        <ContentWrapper>{children}</ContentWrapper>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        dfuse ©2020
        <br />
        <Tag icon={<ClockCircleOutlined />} color='default'>
          {lastSeenBlock}
        </Tag>
      </Footer>
    </Layout>
  );
};
