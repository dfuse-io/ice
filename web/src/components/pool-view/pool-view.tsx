import React, {useEffect, useState} from 'react';
import {useAppState} from "../../state"
import {PoolRow} from "../../types"
import {Button, Col, Row} from 'antd';
import {IdeaList} from "../idea-list/idea-list";
import Divider from "antd/lib/divider";

interface PoolViewProps {
    pool: PoolRow
}

export const PoolView: React.FC<PoolViewProps> = ({ pool}) => {

    return (
        <>
            <>
                <IdeaList poolName={pool.pool_name}/>
            </>
        </>
    );
};