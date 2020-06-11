import React, { useEffect, useState, useCallback } from 'react';
import { useAppState } from '../../state/state';
import { IdeaRow, VoteForm } from '../../types/types';
import { Button, Col, Row, Select, message, Tooltip } from 'antd';
import { QuestionOutlined } from '@ant-design/icons';
import { fetchVotes, castVote } from '../../services/vote';
import { styled } from '../../theme';
const { Option } = Select;

interface VoteListProps {
  idea: IdeaRow;
}

interface VoteData {
  key: string;
  user: string;
  impact: number;
  confidence: number;
  ease: number;
}

const IceLetter = styled.span`
  cursor: pointer;
`;

const selectValue = (
  defaultValue: number,
  handler: (value: number) => void
) => {
  return (
    <Select
      showSearch
      style={{ width: '60px' }}
      onChange={handler}
      defaultValue={defaultValue}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
        <Option key={v} value={v}>
          {v}
        </Option>
      ))}
    </Select>
  );
};

export const VoteList: React.FC<VoteListProps> = ({ idea }: VoteListProps) => {
  const [votes, setVotes] = useState<VoteData[]>([]);
  const [myVote, setMyVote] = useState<VoteForm>({
    impact: 0,
    ease: 0,
    confidence: 0,
  });
  const [hasVoted, setHasVoted] = useState(false);
  const [castingVote, setCastingVote] = useState(false);
  const {
    dfuseClient,
    contractAccount,
    accountName,
    activeUser,
    loggedIn,
    lastSeenAction,
  } = useAppState();

  const handleFetchVotes = useCallback(
    (votesResult) => {
      const tempVote: VoteData[] = [];
      votesResult.rows.forEach((r) => {
        const vote = r.json;
        if (!vote) return;
        tempVote.push({
          key: vote.voter,
          user: vote.voter,
          impact: vote.impact,
          confidence: vote.confidence,
          ease: vote.ease,
        } as VoteData);

        if (vote.voter === accountName) {
          console.log('found your vote', vote);
          setMyVote({
            ease: vote.ease,
            impact: vote.impact,
            confidence: vote.confidence,
          });
          setHasVoted(true);
        }
      });
      setVotes(tempVote);
    },
    [accountName]
  );

  const handleError = (e) => {
    message.error('Oops! Unable to get votes: ' + e);
  };

  useEffect(() => {
    if (!dfuseClient) return;
    setHasVoted(false);
    setMyVote({ impact: 0, ease: 0, confidence: 0 });
    fetchVotes(dfuseClient, contractAccount, idea.key)
      .then(handleFetchVotes)
      .catch(handleError);
  }, [dfuseClient, contractAccount, idea.key, loggedIn, handleFetchVotes]);

  useEffect(() => {
    console.log('refreshing cast vote: ', lastSeenAction, idea.id);
    if (
      dfuseClient &&
      lastSeenAction &&
      lastSeenAction.type === 'castvote' &&
      lastSeenAction.contextId === idea.id
    ) {
      fetchVotes(dfuseClient, contractAccount, idea.key)
        .then(handleFetchVotes)
        .catch(handleError);
    }
  }, [
    dfuseClient,
    contractAccount,
    handleFetchVotes,
    lastSeenAction,
    idea.id,
    idea.key,
  ]);

  const handleCastVote = useCallback(() => {
    setCastingVote(true);
    castVote(activeUser, accountName, idea, myVote)
      .then(() => {
        setCastingVote(false);
        message.info(`Hurray! you casted your vote`);
      })
      .catch((e) => {
        setCastingVote(false);
        message.error(`Oops! unable record your vote: ${e}`);
      });
  }, [activeUser, accountName, idea, myVote]);
  const renderVote = (v: VoteData) => {
    if (accountName === v.user) {
      return renderYourVote();
    } else {
      return renderAnonymousVote(v);
    }
  };

  const renderYourVote = () => {
    console.log('rendering your vote', myVote);
    return (
      <tr key={'my-vote'}>
        <td>{accountName}</td>
        <td>
          {selectValue(myVote.impact, (value: number) => {
            const newVote = Object.assign(myVote, { impact: value });
            console.log('changed impact', myVote, newVote);
            setMyVote(newVote);
          })}
        </td>
        <td>
          {selectValue(myVote.confidence, (value: number) => {
            const newVote = Object.assign(myVote, { confidence: value });
            console.log('changed impact', myVote, newVote);
            setMyVote(newVote);
          })}
        </td>
        <td>
          {selectValue(myVote.ease, (value: number) => {
            const newVote = Object.assign(myVote, { ease: value });
            console.log('changed impact', myVote, newVote);
            setMyVote(Object.assign(myVote, { ease: value }));
          })}
        </td>
        <td>
          <Button
            type='primary'
            loading={castingVote}
            onClick={handleCastVote}
            shape='round'
            size={'small'}
          >
            confirm
          </Button>
        </td>
      </tr>
    );
  };

  const renderAnonymousVote = (v: VoteData) => {
    return (
      <tr key={v.key}>
        <td>{v.user}</td>
        <td>{v.impact}</td>
        <td>{v.confidence}</td>
        <td>{v.ease}</td>
        <td> </td>
      </tr>
    );
  };
  return (
    <Row justify={'end'}>
      -{' '}
      <Col>
        <table id={'votes-table'}>
          <thead>
            <tr>
              <th></th>
              <th>
                <Tooltip
                  placement='topLeft'
                  title='Impact is an estimate of how much the idea will positively affect the key metric'
                >
                  <IceLetter>
                    I <QuestionOutlined style={{ fontSize: '12px' }} />
                  </IceLetter>
                </Tooltip>
              </th>

              <th>
                <Tooltip
                  placement='topLeft'
                  title='Confidence indicates how sure we are about Impact, and to some degree also about ease of implementation. 10 is validated by users in prod, 5 is validated with user surveys or working proof of concept, 1 is intuition'
                >
                  <IceLetter>
                    C <QuestionOutlined style={{ fontSize: '12px' }} />
                  </IceLetter>
                </Tooltip>
              </th>
              <th>
                <Tooltip
                  placement='topLeft'
                  title='Ease (of implementation) is an estimation of how much effort and resources will be required to implement this idea.  This is the inverse of effort (person/week) - lower effort means higher ease.  10 is less than 1 day, 5 is about 4 weeks and 1 is more than 2 months'
                >
                  <IceLetter>
                    E <QuestionOutlined style={{ fontSize: '12px' }} />
                  </IceLetter>
                </Tooltip>
              </th>
            </tr>
          </thead>
          <tbody>
            {votes.map((v) => renderVote(v))}
            {!hasVoted && renderYourVote()}
          </tbody>
        </table>
      </Col>
    </Row>
  );
};
