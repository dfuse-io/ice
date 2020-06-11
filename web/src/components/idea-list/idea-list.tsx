import React, { useEffect, useState } from 'react';
import { useAppState } from '../../state/state';
import { IdeaRow } from '../../types/types';
import { IdeaView } from '../idea-view/idea-view';
import { fetchIdeas } from '../../services/idea';
import { message } from 'antd';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const eosjsAccountName = require('eosjs-account-name');

interface IdeaListProps {
  poolName: string;
}

export const IdeaList: React.FC<IdeaListProps> = ({
  poolName,
}: IdeaListProps) => {
  const [ideas, setIdeas] = useState<IdeaRow[]>([]);
  const { dfuseClient, contractAccount, lastSeenAction } = useAppState();

  const handleFetchIdeas = (ideaResult) => {
    if (!ideaResult) return;
    let ideas: IdeaRow[] = [];
    ideaResult.rows.forEach((r) => {
      if (r.json) {
        const idea = r.json;
        idea.key = eosjsAccountName.uint64ToName(idea.id);
        ideas.push(idea);
      }
    });

    ideas = ideas.sort((a: IdeaRow, b: IdeaRow) =>
      a.score < b.score ? 1 : -1
    );
    setIdeas(ideas);
  };

  const handleError = (e) => {
    message.error('Oops! Unable to get ideas: ' + e);
  };

  useEffect(() => {
    if (!dfuseClient) return;
    fetchIdeas(dfuseClient, contractAccount, poolName)
      .then(handleFetchIdeas)
      .catch(handleError);
  }, [dfuseClient, contractAccount, poolName]);

  useEffect(() => {
    console.log('refreshing: ', lastSeenAction, poolName);
    if (
      dfuseClient &&
      lastSeenAction &&
      lastSeenAction.type === 'addidea' &&
      lastSeenAction.contextId === poolName
    ) {
      fetchIdeas(dfuseClient, contractAccount, poolName)
        .then(handleFetchIdeas)
        .catch(handleError);
    }
  }, [dfuseClient, contractAccount, lastSeenAction, poolName]);

  return (
    <div>
      {ideas.map((idea) => (
        <IdeaView key={idea.id} idea={idea} />
      ))}
    </div>
  );
};
