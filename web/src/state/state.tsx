import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { message } from 'antd';
import { DfuseClient, Stream } from '@dfuse/client';
import { UALContext } from 'ual-reactjs-renderer';
import { launchForeverStream } from '../services/stream';
import { getDfuseClient } from '../services/client';
import { Action, IdeaRow, PoolRow, PoolRowForm } from '../types/types';
import { fetchPools, createPool } from '../services/pool';

export interface StateContextType {
  setLastSeenBlock(blockNum: number): void;
  lastSeenBlock: number;
  lastSeenAction: Action | null;
  loggedIn: boolean;
  login(): Promise<void>;
  logout(): Promise<void>;
  accountName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activeUser: any;
  dfuseClient: DfuseClient;
  contractAccount: string;
  pools: PoolRow[];
  newPool: boolean;
  showNewIdea: boolean;
  setShowNewIdea: any;
  setNewPool: any;
  creatingPool: boolean;
  selectedPool: PoolRow | null;
  handleSelectPool(value: any): void;
  handleCreatePool(poolName: string): void;
  handleFetchPools: any;
  onNewIdeaCreated(idea: IdeaRow): void;
  onNewIdeaError(error: string): void;
  onNewIdeaCancel();
}

export const StateContext = createContext<StateContextType | null>(null);

export function AppStateProvider(props: React.PropsWithChildren<{}>) {
  // AppState
  const { activeUser, logout, showModal } = useContext(UALContext);
  const [lastSeenBlock, setLastSeenBlock] = useState(0);
  const [lastSeenAction, setLastSeenAction] = useState<Action | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [dfuseClient, setDfuseClient] = useState<DfuseClient>(undefined!);
  const [, setStream] = useState<Stream | null>(null);
  const [accountName, setAccountName] = useState('');

  // PoolState

  const [pools, setPools] = useState<PoolRow[]>([]);
  const [newPool, setNewPool] = useState(false);
  const [showNewIdea, setShowNewIdea] = useState(false);
  const [creatingPool, setCreatingPool] = useState(false);
  const [selectedPool, setSelectedPool] = useState<PoolRow | null>(null);

  const contractAccount =
    process.env.REACT_APP_DFUSE_CONTRACT_OWNER || 'dfuse.ice';

  const handleSelectPool = (value) => {
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
      setLastSeenBlock(poolsResult.up_to_block_num || -1);
    },
    [setLastSeenBlock]
  );

  const onNewIdeaCreated = (idea: IdeaRow) => {
    setShowNewIdea(false);
    message.info(`Hurray! '${idea.title}' was created!`);
    if (!dfuseClient) return;
    fetchPools(dfuseClient, contractAccount)
      .then(handleFetchPools)
      .catch((e) => {
        message.error('Oops! Unable to get pools: ' + e);
      });
  };

  const onNewIdeaError = (error: string) => {
    setShowNewIdea(false);
    message.error(`Oops unable to create an idea: ${error}`);
  };

  const onNewIdeaCancel = () => {
    setShowNewIdea(false);
  };

  const loginFunc: StateContextType['login'] = (): Promise<void> => {
    showModal();
    return Promise.resolve();
  };

  const logoutFunc: StateContextType['logout'] = (): Promise<void> => {
    logout();
    setLoggedIn(false);
    setAccountName('');
    return Promise.resolve();
  };

  const updateAccountName = useCallback(async (): Promise<void> => {
    try {
      const accountName = await activeUser.getAccountName();
      setAccountName(accountName);
    } catch (e) {
      console.warn(e);
    }
  }, [activeUser]);

  useEffect(() => {
    if (lastSeenBlock === 0) {
      return;
    }
    let s: Stream;
    launchForeverStream(dfuseClient, setLastSeenAction, lastSeenBlock)
      .then((stream) => {
        s = stream;
        setStream(s);
      })
      .catch((e) => {
        message.error('stream failed: ' + e);
      });
  }, [dfuseClient, lastSeenBlock]);

  useEffect(() => {
    const client = getDfuseClient();

    setDfuseClient(client);
    return () => {
      client.release();
    };
  }, []);

  useEffect(() => {
    if (activeUser) {
      setLoggedIn(true);
      updateAccountName();
    }
  }, [activeUser, updateAccountName]);

  return (
    <StateContext.Provider
      value={{
        loggedIn,
        activeUser,
        accountName,
        lastSeenBlock,
        setLastSeenBlock,
        lastSeenAction,
        login: loginFunc,
        logout: logoutFunc,
        dfuseClient: dfuseClient,
        contractAccount,
        pools,
        newPool,
        setNewPool,
        showNewIdea,
        setShowNewIdea,
        creatingPool,
        selectedPool,
        handleSelectPool,
        handleCreatePool,
        handleFetchPools,
        onNewIdeaCreated,
        onNewIdeaError,
        onNewIdeaCancel,
      }}
    >
      {props.children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error(
      'AppState not found, useAppState must be used within the AppStateProvider'
    );
  }
  return context;
}
