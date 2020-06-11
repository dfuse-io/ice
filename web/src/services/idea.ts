import { IdeaRow, IdeaRowForm } from '../types/types';
import { DfuseClient } from '@dfuse/client';

export const fetchIdeas = async (
  dfuseClient: DfuseClient,
  poolName: string
) => {
  if (!dfuseClient) throw new Error('Client undefined');
  return dfuseClient.stateTable<IdeaRow>('dfuseioice', poolName, 'ideas');
};

const addIdeaTrx = (
  contractAccount: string,
  accountName: string,
  pool_name: string,
  idea: IdeaRowForm
) => {
  return {
    actions: [
      {
        account: contractAccount,
        name: 'addidea',
        authorization: [
          {
            actor: accountName,
            permission: 'active',
          },
        ],
        data: {
          author: accountName,
          pool_name: pool_name,
          title: idea.title,
          description: idea.description,
        },
      },
    ],
  };
};

export const createIdea = async (
  activeUser: any,
  contractAccount: string,
  accountName: string,
  poolName: string,
  ideaForm: IdeaRowForm
): Promise<void> => {
  if (!activeUser) throw new Error('no active user');
  await activeUser.signTransaction(
    addIdeaTrx(contractAccount, accountName, poolName, ideaForm),
    { broadcast: true }
  );
};
