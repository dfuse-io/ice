import React, {useEffect, useState} from 'react';
import {useAppState} from "../../state"
import {IdeaRow, VoteRow} from "../../types"
import {Col, Row} from 'antd';

interface VoteListProps {
    ideaName: string
}

export const VoteList: React.FC<VoteListProps> = ({ideaName}) => {
    const [votes, setVotes] = useState<VoteRow[]>([]);
    const {dfuseClient} = useAppState()

    useEffect(() => {
        dfuseClient.stateTable<VoteRow>("dfuseioice", ideaName, "votes")
            .then((votesResult) => {
                console.log("received votes result");
                let votes: VoteRow[] = [];
                votesResult.rows.map(r => {
                    const vote = r.json!;
                    votes.push(vote);
                    return true
                });

                setVotes(votes)
            })
            .catch(reason => {
                console.log(reason)

            });
    }, [dfuseClient, ideaName]);
    return (
        <>
        {
            votes.map(v => (
                <>
                    <Row justify="start" key={v.voter}>
                        <Col span={3}/>
                        <Col span={2}>{v.voter}</Col>
                        <Col span={1}>{v.impact}</Col>
                        <Col span={1}>{v.confidence}</Col>
                        <Col span={1}>{v.ease}</Col>
                        <Col span={1}></Col>
                    </Row>
                </>
            ))
        }
</>
)};