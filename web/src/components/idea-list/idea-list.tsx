import React, {useEffect, useState} from 'react';
import {useAppState} from "../../state"
import {IdeaRow} from "../../types"
import {Button, Col, Row} from 'antd';
import {VoteList} from "../vote-list/vote-list";
import {IdeaCreateForm} from "../idea-create-form/idea-create-form"
import {PoolCreateForm} from "../pool-create-form/pool-create-form";


const eosjsAccountName = require("eosjs-account-name")

interface IdeaListProps {
    poolName: string
}

export const IdeaList: React.FC<IdeaListProps> = ({poolName}) => {
    const [ideas, setIdeas] = useState<IdeaRow[]>([]);
    const [showForm, setShowForm] = useState<boolean>(false);
    const {dfuseClient} = useAppState()

    useEffect(() => {
        dfuseClient.stateTable<IdeaRow>("dfuseioice", poolName, "ideas")
            .then((ideaResult) => {
                console.log("received ideas result");
                let ideas: IdeaRow[] = [];
                ideaResult.rows.map(r => {
                    const idea = r.json!;

                    idea.name = eosjsAccountName.uint64ToName(idea.id);
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
                        <Row justify="start" key={i.id}>
                            <Col span={3}>{i.description}</Col>
                            <Col span={2}></Col>
                            <Col span={1}>{i.avg_impact}</Col>
                            <Col span={1}>{i.avg_confidence}</Col>
                            <Col span={1}>{i.avg_ease}</Col>
                            <Col span={1}>{i.score}</Col>
                            <Col span={1}>
                                <Button type={"primary"} onClick={() => {setShowForm(true)}}>Add</Button>
                                {showForm && (<PoolCreateForm/>)}
                            </Col>
                        </Row>
                        <VoteList ideaName={i.name}/>
                    </>
                ))
            }
        </>
    )
};