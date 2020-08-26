import React, { useEffect } from 'react';
import { Action, IdeaRow } from '../../types/types';
import { useAppState } from '../../state/state';
import { message, Empty } from 'antd';
import { IdeaList } from '../idea-list/idea-list';
import { IdeaModal } from '../idea-modal/idea-modal';
import { fetchPools } from '../../services/pool';

export const MainView: React.FC = () => {
  const {
    dfuseClient,
    contractAccount,
    loggedIn,
    lastSeenAction,
    showNewIdea,
    selectedPool,
    handleFetchPools,
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
      .catch((e) => `Oops unable to fetch pools`);
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
      .catch((e) => message.error(`Oops unable to fetch pools`));
  };

  const onNewIdeaError = (error: string) => {
    setShowNewIdea(false);
    message.error(`Oops unable to create an idea: ${error}`);
  };

  const onNewIdeaCancel = () => {
    setShowNewIdea(false);
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
            Select a <strong>Pool</strong>
            from the top search bar
          </span>
        }
      />
    );
  };

  return (
    <>
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
