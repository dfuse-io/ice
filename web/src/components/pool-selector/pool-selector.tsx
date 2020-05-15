import React, {useEffect, useState} from 'react';
import {PoolRow} from "../../types";
import { useAppState } from "../../state";

export const PoolSelector: React.FC = () => {
    const [pools, setPools] = useState<PoolRow[]>([]);
    const { dfuseClient } = useAppState()

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


    return(
        <>
        </>
    )
};