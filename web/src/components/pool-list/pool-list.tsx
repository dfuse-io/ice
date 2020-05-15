import React, {useEffect, useState} from 'react';
import {useAppState} from "../../state"
import {PoolRow} from "../../types"
import {Button, Col, Row} from 'antd';
import {IdeaList} from "../idea-list/idea-list";
import {PoolCreateForm} from "../pool-create-form/pool-create-form";
import Divider from "antd/lib/divider";

export const PoolList: React.FC = () => {

    const [pools, setPools] = useState<PoolRow[]>([]);
    const [showForm, setShowForm] = useState<boolean>(false);
    const {dfuseClient} = useAppState();

    useEffect(() => {
        try {
            dfuseClient.stateTable<PoolRow>("dfuseioice", "dfuseioice", "pools")
                .then((poolsResult) => {

                    console.log("Creating poolRows");
                    let poolRows: PoolRow[] = [];

                    poolsResult.rows.map(r => {

                        let pool: PoolRow = r.json!;
                        console.log("pushing pool: " + pool.pool_name);
                        poolRows.push(pool);

                        return true
                    });
                    console.log("Setting poolRows: " + poolRows);
                    setPools(poolRows)
                })
        } catch (e) {
            console.log("An error occurred", e)
        }
    }, [dfuseClient]);




    return (
        <>
            <Button type={"primary"} onClick={() => {setShowForm(true)}}>Add</Button>
            {showForm && (<PoolCreateForm/>)}
            <Row justify="center">
                <Col span={24} >

                    {pools.map((p) => (
                        <>
                            <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }}>
                            </Divider>
                            <Row justify="start">
                                <Col span={3}/>
                                <Col span={2}/>
                                <Col span={1}>Impact</Col>
                                <Col span={1}>Confidence</Col>
                                <Col span={1}>Ease</Col>
                                <Col span={1}>Score</Col>
                            </Row>
                            <Row justify="start">
                                <Col span={3}><h2>{p.description}</h2></Col>
                                <Col span={2}/>
                                <Col span={1}>[0-10]</Col>
                                <Col span={1}>[0-10]</Col>
                                <Col span={1}>[0-10]</Col>
                                <Col span={1}>I x C x E</Col>
                            </Row>
                            <IdeaList poolName={p.pool_name}/>
                        </>
                    ))}
                </Col>
            </Row>
        </>
    );
};