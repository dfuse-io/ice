import React, {useEffect, useState} from 'react';
import {useAppState} from "../../state"
import {IdeaRow, PoolRow, Vote, VoteRow} from "../../types"
import {Button, Col, Row, Table, Select, message} from 'antd';
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

const columns = [
    {
        title: '',
        dataIndex: 'user',
        key: 'user',
    },
    {
        title: 'I',
        dataIndex: 'impact',
        key: 'impact',
    },
    {
        title: 'C',
        dataIndex: 'confidence',
        key: 'confidence',
    },
    {
        title: 'E',
        dataIndex: 'ease',
        key: 'ease',
    },
];


const selectValue = (defaultValue: number, handler: (value: any) => void) => {
    return (
        <Select
            showSearch
            style={{ width: "60px" }}
            onChange={handler}
            defaultValue={defaultValue}
        >
            {[1,2,3,4,5,6,7,8,9,10].map((v) => (
                <Option value={v}>{v}</Option>
            ))}
        </Select>
    )
}

export const VoteList: React.FC<VoteListProps> = ({idea}) => {
    const [votes, setVotes] = useState<VoteData[]>([]);
    const [myVote, setMyVote] = useState<Vote>({ease: 0, impact: 0, confidence: 0});
    const [castingVote, setCastingVote] = useState(false);
    const { dfuseClient, accountName, activeUser } = useAppState()

    useEffect(() => {
        dfuseClient.stateTable<VoteRow>("dfuseioice", idea.name, "votes")
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
                        setMyVote({ease: vote.ease, impact: vote.impact, confidence: vote.confidence})
                    }
                });

                setVotes(tempVote)
            })
            .catch(reason => {
                console.log(reason)

            });
    }, [dfuseClient, idea]);

    const  vote = async (): Promise<void>    => {
        // const demoTransaction = {
        //     actions: [{
        //         account: 'dfuseioice',
        //         name: 'castvote',
        //         authorization: [{
        //             actor: accountName,
        //             permission: 'active',
        //         }],
        //         data: {
        //             "voter":accountName,
        //             "pool_name": idea.poolName,
        //             "idea_id": idea.id,
        //             "impact": myVote.impact,
        //             "confidence": myVote.confidence,
        //             "ease": myVote.ease
        //         },
        //     }],
        // }
        const demoTransaction = {
            actions: [{
                account: 'dfuseioice',
                name: 'castvote',
                authorization: [{
                    actor: accountName,
                    permission: 'active',
                }],
                data: {
                    "voter":accountName,
                    "pool_name":"hackathon",
                    "idea_id": idea.id,
                    "confidence": myVote.confidence,
                    "impact": myVote.impact,
                    "ease": myVote.ease,
                },
            }],
        }

        try {
            console.log(demoTransaction)
            await activeUser.signTransaction(demoTransaction, { broadcast: true })
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
            <tr>
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
            <tr>
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
            <Col>
                <table id={'votes-table'}>
                    <thead>
                        <tr>
                            <th></th>
                            <th>I</th>
                            <th>C</th>
                            <th>E</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {votes.map(v => ( (accountName == v.user) ? renderYourVote() : renderAnonymousVote(v) ))}
                    </tbody>
                </table>
            </Col>
        </Row>
    )
};