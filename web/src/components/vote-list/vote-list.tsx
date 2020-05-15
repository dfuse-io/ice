import React, {useEffect, useState} from 'react';
import {useAppState} from "../../state"
import {IdeaRow, PoolRow, VoteForm, VoteRow} from "../../types"
import {Button, Col, Row, Table, Select, message, Tooltip} from 'antd';
import { QuestionOutlined } from '@ant-design/icons';

import {castVoteTrx} from "../../utils/trx";
import {styled} from "../../theme";
const { Option } = Select

interface VoteListProps {
    idea: IdeaRow
}

interface VoteData {
    key: string
    user: string
    impact: number
    confidence: number
    ease: number
}

const IceLetter = styled.span`
    cursor:pointer;
`

const selectValue = (defaultValue: number, handler: (value: any) => void) => {
    return (
        <Select
            showSearch
            style={{ width: "60px" }}
            onChange={handler}
            defaultValue={defaultValue}
        >
            {[1,2,3,4,5,6,7,8,9,10].map((v) => (
                <Option key={v} value={v}>{v}</Option>
            ))}
        </Select>
    )
}

export const VoteList: React.FC<VoteListProps> = ({idea}) => {
    const [votes, setVotes] = useState<VoteData[]>([]);
    const [myVote, setMyVote] = useState<VoteForm>({impact: 0, ease: 0, confidence: 0});
    const [hasVoted, setHasVoted] = useState(false);
    const [castingVote, setCastingVote] = useState(false);
    const { dfuseClient, accountName, activeUser, contractAccount, loggedIn, lastSeenAction } = useAppState()

    useEffect(() => {
        setHasVoted(false)
        setMyVote({impact: 0, ease: 0, confidence: 0})
        fetchVotes()
    }, [dfuseClient, idea, loggedIn]);

    useEffect(() => {
        console.log("refreshing cast vote: ", lastSeenAction, idea.id)
        if (lastSeenAction &&  (lastSeenAction.type == "castvote") && (lastSeenAction.contextId == idea.id)) {
            fetchVotes();
        }
    }, [lastSeenAction]);



    const fetchVotes = () => {
        try {
            dfuseClient.stateTable<VoteRow>("dfuseioice", idea.key, "votes")
                .then((votesResult) => {
                    let tempVote: VoteData[] = [];
                    votesResult.rows.map(r => {
                        const vote = r.json!;
                        tempVote.push({
                            key: vote.voter,
                            user: vote.voter,
                            impact: vote.impact,
                            confidence: vote.confidence,
                            ease: vote.ease,
                        } as VoteData);

                        if (vote.voter == accountName) {
                            console.log("found your vote", vote)
                            setMyVote({ease: vote.ease, impact: vote.impact, confidence: vote.confidence})
                            setHasVoted(true)
                        }
                    });

                    setVotes(tempVote)
                })
                .catch(reason => {
                    throw reason
                });
        } catch (e) {
            message.error("Oops! Unable to get voted: " + e)
        }
    }

    const  vote = async (): Promise<void>    => {
        const trx = castVoteTrx(contractAccount, accountName, idea, myVote);
        console.log("trx: ", trx)
        try {
            await activeUser.signTransaction(trx, { broadcast: true })
        } catch (error) {
            throw error
        }
    }

    const castVote = () => {
        setCastingVote(true)
        vote().then(() => {
            setCastingVote(false)
            message.info(`Hurray! you casted your vote`);
        }).catch( e => {
            setCastingVote(false)
            message.error(`Oops! unable record your vote: ${e}`);
        })
    }


    const renderYourVote = () => {
        return (
            <tr key={'my-vote'}>
                <td>{accountName}</td>
                <td>{selectValue(myVote.impact, (value: any) => {
                    setMyVote(Object.assign(myVote, {impact: value}))
                })}</td>
                <td>{selectValue(myVote.confidence, (value: any) => {
                    setMyVote(Object.assign(myVote, {confidence: value}))
                })}</td>
                <td>{selectValue(myVote.ease, (value: any) => {
                    setMyVote(Object.assign(myVote, {ease: value}))
                })}</td>
                <td>
                    <Button type="primary" loading={castingVote} onClick={() => castVote()} shape="round" size={'small'} >confirm</Button>

                </td>
            </tr>
        )
    }

    const renderAnonymousVote = (v: VoteData) => {
        return (
            <tr key={v.key}>
                <td>{v.user}</td>
                <td>{v.impact}</td>
                <td>{v.confidence}</td>
                <td>{v.ease}</td>
                <td>    </td>
            </tr>
        )
    }
    return (
        <Row justify={'end'}>
            {hasVoted}
            <Col>
                <table id={'votes-table'}>
                    <thead>
                        <tr>
                            <th></th>
                            <th>
                                <Tooltip placement="topLeft" title="Impact is an estimate of how much the idea will positively affect the key metric">
                                    <IceLetter>I <QuestionOutlined style={{ fontSize: '12px' }} /></IceLetter>
                                </Tooltip>
                            </th>
                            <th>
                                <Tooltip placement="topLeft" title="Ease (of implementation) is an estimation of how much effort and resources will be required to implement this idea.  This is the inverse of effort (person/week) - lower effort means higher ease.  10 is less than 1 day, 5 is about 4 weeks and 1 is more than 2 months">
                                    <IceLetter>C <QuestionOutlined style={{ fontSize: '12px' }} /></IceLetter>
                                </Tooltip>
                            </th>
                            <th>
                                <Tooltip placement="topLeft" title="Confidence indicates how sure we are about Impact, and to some degree also about ease of implementation. 10 is validated by users in prod, 5 is validated with user surveys or working proof of concept, 1 is intuition">
                                    <IceLetter>E <QuestionOutlined style={{ fontSize: '12px' }} /></IceLetter>
                                </Tooltip>
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {votes.map(v => ( (accountName == v.user) ? null : renderAnonymousVote(v) ))}
                    { loggedIn && renderYourVote()}
                    </tbody>
                </table>
            </Col>
        </Row>
    )
};