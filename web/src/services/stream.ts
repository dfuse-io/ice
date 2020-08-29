import { DfuseClient, Stream } from '@dfuse/client';
import { Action, ActionTrace } from '../types/types';

const query = (lastSeenBlock) => `subscription  {
    searchTransactionsForward(query: "receiver:dfuse.ice -action:transfer", lowBlockNum:${lastSeenBlock}) {
      cursor
      trace {
        matchingActions {
          name
          json
        }
      }
    }
}`;

export const launchForeverStream = async (
  dfuseClient: DfuseClient,
  setLastSeenAction: React.Dispatch<React.SetStateAction<Action | null>>,
  lastSeenBlock: number
): Promise<Stream> => {
  if (!dfuseClient) throw new Error('client undefined');
  return dfuseClient.graphql(query(lastSeenBlock), (message, stream) => {
    if (message.type === 'error') {
      throw message.errors[0];
    }

    if (message.type === 'data') {
      const data = message.data.searchTransactionsForward;
      const actions = data.trace.matchingActions;
      actions.forEach(({ name, json }: ActionTrace) => {
        const action: Action = {
          type: name,
          contextId: 1,
        };
        switch (name) {
          case 'addpool': {
            break;
          }
          case 'addidea': {
            action.contextId = json.pool_name;
            break;
          }
          case 'castvote': {
            action.contextId = json.idea_id;
            break;
          }
        }
        setLastSeenAction(action);
      });
      stream.mark({ cursor: data.cursor });
    }

    if (message.type === 'complete') {
      // Do something
    }
  });
};
