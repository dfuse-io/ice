import React from 'react';
import { Layout, Tag } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { styled } from '../../theme';
import { useAppState } from '../../state/state';
import { Header } from './header';
import { PoolSelector } from '../pool-selector/pool-selector';
import { MainView } from '../main-view/main-view';
const { Footer, Content } = Layout;

const ContentWrapper = styled.div`
  max-width: 600px;
  padding: 100px 50px 0px;
  margin: auto auto;
`;

export const AppLayout: React.FC = () => {
  const { lastSeenBlock } = useAppState();
  return (
    <Layout>
      <Header>
        <PoolSelector />
      </Header>
      <Content>
        <ContentWrapper>
          <MainView />
        </ContentWrapper>
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
