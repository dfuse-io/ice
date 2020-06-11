import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { DfuseClient, Stream } from '@dfuse/client';
import { UALContext } from 'ual-reactjs-renderer';
import { Action } from '../types/types';
import { launchForeverStream } from '../services/stream';
import { getDfuseClient } from '../services/client';

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
}

export const StateContext = createContext<StateContextType | null>(null);

export function AppStateProvider(props: React.PropsWithChildren<{}>) {
  const { activeUser, logout, showModal } = useContext(UALContext);
  const [lastSeenBlock, setLastSeenBlock] = useState(0);
  const [lastSeenAction, setLastSeenAction] = useState<Action | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [dfuseClient, setDfuseClient] = useState<DfuseClient>(undefined!);
  const [, setStream] = useState<Stream | null>(null);
  const [accountName, setAccountName] = useState('');

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
        console.warn('unable to get stream: ' + e);
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
        contractAccount:
          process.env.REACT_APP_DFUSE_CONTRACT_OWNER || 'dfuseioice',
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
