import React, { useEffect } from 'react';
import { Action } from '../../types/types';
import { useAppState } from '../../state/state';
import { Row, Col, Input, Select, message, Button } from 'antd';
import { FileAddOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { fetchPools } from '../../services/pool';
import { styled } from '../../theme';

const { Option } = Select;
const { Search } = Input;

export const PoolSelector: React.FC = () => {
  const {
    dfuseClient,
    contractAccount,
    loggedIn,
    lastSeenAction,
    pools,
    newPool,
    setNewPool,
    creatingPool,
    selectedPool,
    handleCreatePool,
    handleFetchPools,
    handleSelectPool,
    setShowNewIdea,
  } = useAppState();

  const refresh = (action: Action | null): boolean => {
    return action ? action.type === 'addpool' : false;
  };

  const refreshLastSeenAction = refresh(lastSeenAction);

  useEffect(() => {
    if (!dfuseClient) return;
    fetchPools(dfuseClient, contractAccount)
      .then(handleFetchPools)
      .catch((e) => {
        message.error('Oops! Unable to get pools: ' + e);
      });
  }, [
    dfuseClient,
    contractAccount,
    loggedIn,
    refreshLastSeenAction,
    handleFetchPools,
  ]);

  const StyledSelect = styled(Select)`
    width: 100%;
    background: none;
    background-color: inherit;
    color: black;
  `;

  const renderPoolSelector = () => {
    let selectSpan = 24;
    let showAddKey = false;
    if (selectedPool && loggedIn) {
      selectSpan = 19;
      showAddKey = true;
    }

    return (
      <Row>
        <Col span={selectSpan}>
          <StyledSelect
            defaultValue={selectedPool?.pool_name}
            showSearch
            placeholder='Select a pool'
            onChange={handleSelectPool}
          >
            {pools.map((p) => (
              <Option key={`pool-${p.pool_name}`} value={p.pool_name}>
                {p.pool_name}
              </Option>
            ))}
            {loggedIn && (
              <Option key={`pool-new_pool`} value={'new_pool'}>
                Create a new pool!
              </Option>
            )}
          </StyledSelect>
        </Col>
        {showAddKey && (
          <Col span={5}>
            <Button type='primary' onClick={() => setShowNewIdea(true)} block>
              <FileAddOutlined /> New Idea
            </Button>
          </Col>
        )}
      </Row>
    );
  };
  const renderPoolCreator = () => {
    return (
      <Row>
        <Col span={22}>
          <Search
            placeholder='Enter a pool name'
            onSearch={handleCreatePool}
            loading={creatingPool}
            enterButton='Create Pool'
          />
        </Col>
        <Col span={2}>
          <Button type='primary' danger onClick={() => setNewPool(false)}>
            <CloseCircleOutlined />
          </Button>
        </Col>
      </Row>
    );
  };

  return (
    <>
      {!newPool && renderPoolSelector()}
      {newPool && renderPoolCreator()}
    </>
  );
};
