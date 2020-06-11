import { PoolRow, PoolRowForm } from '../types/types';
import { DfuseClient } from '@dfuse/client';

export const fetchPools = async (
  dfuseClient: DfuseClient,
  contractAccount: string
) => {
  if (!dfuseClient) throw new Error('Client undefined');
  return dfuseClient.stateTable<PoolRow>(
    contractAccount,
    contractAccount,
    'pools'
  );
};

export const addPoolTrx = (
  contractAccount: string,
  accountName: string,
  poolRow: PoolRowForm
) => {
  return {
    actions: [
      {
        account: contractAccount,
        name: 'addpool',
        authorization: [
          {
            actor: accountName,
            permission: 'active',
          },
        ],
        data: {
          author: accountName,
          name: poolRow.name,
        },
      },
    ],
  };
};

export const createPool = async (
  activeUser: any,
  contractAccount: string,
  accountName: string,
  pool: PoolRowForm
): Promise<PoolRow> => {
  if (!activeUser) throw new Error('no active user');
  await activeUser.signTransaction(
    addPoolTrx(contractAccount, accountName, pool),
    { broadcast: true }
  );
  return { pool_name: pool.name } as PoolRow;
};
