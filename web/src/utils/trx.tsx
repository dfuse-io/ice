import { IdeaRow, IdeaRowForm, PoolRowForm, VoteForm } from "../types/";
export const addPoolTrx = (
  contractAccount: string,
  accountName: string,
  poolRow: PoolRowForm
) => {
  return {
    actions: [
      {
        account: contractAccount,
        name: "addpool",
        authorization: [
          {
            actor: accountName,
            permission: "active",
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

export const addIdeaTrx = (
  contractAccount: string,
  accountName: string,
  pool_name: string,
  idea: IdeaRowForm
) => {
  return {
    actions: [
      {
        account: contractAccount,
        name: "addidea",
        authorization: [
          {
            actor: accountName,
            permission: "active",
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

export const castVoteTrx = (
  contractAccount: string,
  accountName: string,
  idea: IdeaRow,
  vote: VoteForm
) => {
  return {
    actions: [
      {
        account: "dfuseioice",
        name: "castvote",
        authorization: [
          {
            actor: accountName,
            permission: "active",
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
