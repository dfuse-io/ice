import React, { useEffect, useState, useCallback } from 'react';
import { Action, IdeaRow, PoolRow, PoolRowForm } from '../../types/types';
import { useAppState } from '../../state/state';
import { Row, Col, Input, Select, message, Empty, Button } from 'antd';
import { FileAddOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { IdeaList } from '../idea-list/idea-list';
import { IdeaModal } from '../idea-modal/idea-modal';
import { fetchPools, createPool } from '../../services/pool';
const { Option } = Select;
const { Search } = Input;

export const PoolSelector: React.FC = () => {
  const [pools, setPools] = useState<PoolRow[]>([]);
  const [newPool, setNewPool] = useState(false);
  const [showNewIdea, setShowNewIdea] = useState(false);
  const [creatingPool, setCreatingPool] = useState(false);
  const [selectedPool, setSelectedPool] = useState<PoolRow | null>(null);
  const {
    dfuseClient,
    activeUser,
    contractAccount,
    accountName,
    loggedIn,
    setLastSeenBlock,
    lastSeenAction,
  } = useAppState();

  const refresh = (action: Action | null): boolean => {
    return action ? action.type === 'addpool' : false;
  };

  const refreshLastSeenAction = refresh(lastSeenAction);

  const onChange = (value) => {
    if (value === 'new_pool') {
      setNewPool(true);
    } else {
      pools.forEach((p) => {
        if (p.pool_name === value) {
          setSelectedPool(p);
        }
      });
    }
  };

  const handleCreatePool = (poolName: string) => {
    setCreatingPool(true);
    const poolForm = { name: poolName } as PoolRowForm;
    createPool(activeUser, contractAccount, accountName, poolForm)
      .then((poolRow) => {
        setCreatingPool(false);
        setNewPool(false);
        setPools([...pools, poolRow]);
        setSelectedPool(poolRow);
        message.info(`Hurray! '${poolName}' was created!`);
      })
      .catch((e) => {
        setCreatingPool(false);
        message.error(`Oops unable to create pool: ${e}`);
      });
  };

  const handleFetchPools = useCallback(
    (poolsResult) => {
      if (!poolsResult) return;
      const poolRows: PoolRow[] = [];
      poolsResult.rows.forEach((r) => {
        if (r.json) {
          const pool: PoolRow = r.json;
          poolRows.push(pool);
        }
      });
      setPools(poolRows);
      console.log('setting low blockl numb: ', poolsResult.up_to_block_num);
      setLastSeenBlock(poolsResult.up_to_block_num || -1);
    },
    [setLastSeenBlock]
  );

  const handleError = (e) => {
    message.error('Oops! Unable to get pools: ' + e);
  };

  useEffect(() => {
    if (!dfuseClient) return;
    fetchPools(dfuseClient, contractAccount)
      .then(handleFetchPools)
      .catch(handleError);
  }, [
    dfuseClient,
    contractAccount,
    loggedIn,
    refreshLastSeenAction,
    handleFetchPools,
  ]);

  const onNewIdeaCreated = (idea: IdeaRow) => {
    setShowNewIdea(false);
    message.info(`Hurray! '${idea.title}' was created!`);
    if (!dfuseClient) return;
    fetchPools(dfuseClient, contractAccount)
      .then(handleFetchPools)
      .catch(handleError);
  };

  const onNewIdeaError = (error: string) => {
    setShowNewIdea(false);
    message.error(`Oops unable to create an idea: ${error}`);
  };

  const onNewIdeaCancel = () => {
    setShowNewIdea(false);
  };

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
          <Select
            defaultValue={selectedPool?.pool_name}
            showSearch
            style={{ width: '100%' }}
            placeholder='Select a pool'
            onChange={onChange}
          >
            {pools.map((p) => (
              <Option key={`pool-${p.pool_name}`} value={p.pool_name}>
                {p.pool_name}
              </Option>
            ))}
            {loggedIn && (
              <Option key={`pool-new_pool`} value={'new_pool'}>
                create a new pool
              </Option>
            )}
          </Select>
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
  const poolViewPlaceholder = () => {
    return (
      <Empty
        image='https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
        imageStyle={{
          height: 60,
        }}
        style={{ marginTop: '20px' }}
        description={
          <span>
            Select a <strong>Pool!</strong>
          </span>
        }
      />
    );
  };

  return (
    <>
      {!newPool && renderPoolSelector()}
      {newPool && renderPoolCreator()}
      {!selectedPool && poolViewPlaceholder()}
      {selectedPool && (
        <>
          <IdeaList poolName={selectedPool.pool_name} />
          <IdeaModal
            pool={selectedPool}
            show={showNewIdea}
            onCreated={onNewIdeaCreated}
            onError={onNewIdeaError}
            onCancel={onNewIdeaCancel}
          />
        </>
      )}
    </>
  );
};
