import React, { useEffect, useState, useCallback } from 'react';
import { useAppState } from '../../state';
import { IdeaRow } from '../../types';
import { message } from 'antd';
import { styled } from '../../theme';
import { IdeaView } from '../idea-view/idea-view';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const eosjsAccountName = require('eosjs-account-name');

const IdeasWrapper = styled.div``;

interface IdeaListProps {
  poolName: string;
}

export const IdeaList: React.FC<IdeaListProps> = ({
  poolName,
}: IdeaListProps) => {
  const [ideas, setIdeas] = useState<IdeaRow[]>([]);
  const { dfuseClient, lastSeenAction } = useAppState();

  const fetchIdeas = useCallback(() => {
    try {
      dfuseClient
        .stateTable<IdeaRow>('dfuseioice', poolName, 'ideas')
        .then((ideaResult) => {
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
        })
        .catch((reason) => {
          throw reason;
        });
    } catch (e) {
      message.error('Oops! Unable to get ideas: ' + e);
    }
  }, [dfuseClient, poolName]);

  useEffect(() => {
    fetchIdeas();
  }, [dfuseClient, poolName, fetchIdeas]);

  useEffect(() => {
    console.log('refreshing: ', lastSeenAction, poolName);
    if (
      dfuseClient &&
      lastSeenAction &&
      lastSeenAction.type === 'addidea' &&
      lastSeenAction.contextId === poolName
    ) {
      fetchIdeas();
    }
  }, [lastSeenAction, dfuseClient, poolName, fetchIdeas]);

  return (
    <IdeasWrapper>
      {ideas.map((idea) => (
        <IdeaView key={idea.id} idea={idea} />
      ))}
    </IdeasWrapper>
  );
};
