import React, {useEffect, useState} from 'react';
import {useAppState} from "../../state"
import {IdeaRow} from "../../types"
import {Col, Row} from 'antd';

interface VoteListProps {
    ideaID: number
}

export const VoteList: React.FC<VoteListProps> = ({ideaID}) => {
    // const [ideas, setIdeas] = useState<IdeaRow[]>([]);
    // const {dfuseClient} = useAppState()
    //
    // useEffect(() => {
    //     dfuseClient.stateTable<IdeaRow>("dfuseioice", poolName, "ideas")
    //         .then((ideaResult) => {
    //             console.log("received ideas result");
    //             let ideas: IdeaRow[] = [];
    //             ideaResult.rows.map(r => {
    //                 const idea = r.json!;
    //                 ideas.push(idea);
    //                 return true
    //             });
    //
    //             console.log("ideas:" + ideas.length);
    //             setIdeas(ideas)
    //         })
    //         .catch(reason => {
    //             console.log(reason)
    //
    //         });
    // }, [dfuseClient, poolName]);
    return (
        <>
                    <Row justify="start">
                        <Col span={2}/>
                        <Col span={2}>thegreat</Col>
                        <Col span={1}>2</Col>
                        <Col span={1}>2</Col>
                        <Col span={1}>2</Col>
                        <Col span={1}>8</Col>
                    </Row>
        </>
    )
};