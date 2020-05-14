import React, {useEffect, useState} from 'react';
import { PoolRow } from "../types"
import {useAppState} from "../state"
import { IdeaList } from "../components/idea-list/idea-list";
import {withAuthenticatedLayout} from "../components/layout/layout";

export const BaseHomePage: React.FC = () => {
    const [pools, setPools] = useState<PoolRow[]>([]);
    const { dfuseClient }  = useAppState()

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
        <div className="App">
            <header className="App-header">
                <h1>Pools</h1>
                <ul>
                    {pools.map((p) => (
                        <div key={p.pool_name}>
                            <li>
                                <div>
                                    <h2>{p.description}({p.pool_name})</h2>
                                    <IdeaList poolName={p.pool_name} />
                                </div>
                            </li>
                        </div>
                    ))}
                </ul>
            </header>
        </div>
    );
}



export const HomePage = withAuthenticatedLayout(BaseHomePage)
