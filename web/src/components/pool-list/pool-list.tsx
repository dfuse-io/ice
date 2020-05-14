import React, {useEffect, useState} from 'react';
import {useAppState} from "../../state"
import {PoolRow} from "../../types"
import {Col, Row} from 'antd';
import {IdeaList} from "../idea-list/idea-list";
import Divider from "antd/lib/divider";
import {background} from "styled-system";
import {lightblue} from "color-name";

export const PoolList: React.FC = () => {

    const [pools, setPools] = useState<PoolRow[]>([]);
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


    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
    ];

    return (
        <>
            <Row justify="center">
                <Col span={24} >
                    <Row justify="start">
                        <Col span={2}/>
                        <Col span={2}/>
                        <Col span={1}>Impact</Col>
                        <Col span={1}>Confidence</Col>
                        <Col span={1}>Ease</Col>
                        <Col span={1}>Score</Col>
                    </Row>

                    {pools.map((p) => (
                        <div>
                            <Row justify="start">
                                <Col span={2}><h2>{p.description}</h2></Col>
                                <Col span={2}/>
                                <Col span={1}>[0-10]</Col>
                                <Col span={1}>[0-10]</Col>
                                <Col span={1}>[0-10]</Col>
                                <Col span={1}>I x C x E</Col>
                            </Row>
                            <IdeaList poolName={p.pool_name}/>
                        </div>
                    ))}
                </Col>
            </Row>
        </>
    );
};