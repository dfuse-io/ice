import React, {useEffect, useState} from 'react';
import {useAppState} from "../../state"
import {IdeaRow} from "../../types"
import {Col, Row} from 'antd';
import {VoteList} from "../vote-list/idea-list";


interface IdeaListProps {
    poolName: string
}

export const IdeaList: React.FC<IdeaListProps> = ({poolName}) => {
    const [ideas, setIdeas] = useState<IdeaRow[]>([]);
    const {dfuseClient} = useAppState()

    useEffect(() => {
        dfuseClient.stateTable<IdeaRow>("dfuseioice", poolName, "ideas")
            .then((ideaResult) => {
                console.log("received ideas result");
                let ideas: IdeaRow[] = [];
                ideaResult.rows.map(r => {
                    const idea = r.json!;
                    ideas.push(idea);
                    return true
                });

                console.log("ideas:" + ideas.length);
                setIdeas(ideas)
            })
            .catch(reason => {
                console.log(reason)

            });
    }, [dfuseClient, poolName]);
    return (
        <>
            {
                ideas.map(i => (
                    <>
                        <Row justify="start">
                            <Col span={3}>{i.description}</Col>
                            <Col span={2}></Col>
                            <Col span={1}>{i.avg_impact}</Col>
                            <Col span={1}>{i.avg_confidence}</Col>
                            <Col span={1}>{i.avg_ease}</Col>
                            <Col span={1}>{i.score}</Col>
                        </Row>
                        <VoteList ideaID={0}/>
                    </>
                ))
            }
        </>
    )
};