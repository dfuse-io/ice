import { IdeaRow, VoteRow, VoteForm } from '../types/types';
import { DfuseClient } from '@dfuse/client';

export const fetchVotes = async (
  dfuseClient: DfuseClient,
  contractAccount: string,
  scope: string
) => {
  if (!dfuseClient) throw new Error('Client undefined');
  return dfuseClient.stateTable<VoteRow>(contractAccount, scope, 'votes');
};

export const castVoteTrx = (
  accountName: string,
  idea: IdeaRow,
  vote: VoteForm
) => {
  return {
    actions: [
      {
        account: 'dfuse.ice',
        name: 'castvote',
        authorization: [
          {
            actor: accountName,
            permission: 'active',
          },
        ],
        data: {
          voter: accountName,
          pool_name: idea.pool_name,
          idea_id: idea.id,
          confidence: vote.confidence,
          impact: vote.impact,
          ease: vote.ease,
        },
      },
    ],
  };
};

export const castVote = async (
  activeUser,
  accountName: string,
  idea: any,
  myVote: VoteForm
): Promise<void> => {
  if (!activeUser) return;
  const trx = castVoteTrx(accountName, idea, myVote);
  await activeUser.signTransaction(trx, { broadcast: true });
};
