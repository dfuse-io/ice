import React from 'react';
import { styled } from '../../../theme';
import { Layout, Tag } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

import { useAppState } from '../../../state';
import { PageHeader } from './page-header';

const { Footer, Content } = Layout;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: auto auto;
`;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { lastSeenBlock } = useAppState();
  return (
    <Layout>
      <PageHeader />
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
export default AppLayout;
