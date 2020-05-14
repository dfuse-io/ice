import React, {useEffect, useState} from 'react';
import './App.css';
import {createDfuseClient} from "@dfuse/client"
import { Idea } from "./idea";

const client = createDfuseClient({
    apiKey: "web_0123456789abcdef",
    authUrl: "null://",
    network: "localhost:13026",
    secure: false
});

interface PoolRow {
    pool_name: string;
    author: string;
    description: string
}


interface VoteRow {
    ideaId: number;
    voter: string;
    impact: number;
    confidence: number;
    ease: number;
}

export const App: React.FC = () => {
    const [pools, setPools] = useState<PoolRow[]>([]);

    useEffect(() => {
        try {
            client.stateTable<PoolRow>("dfuseioice", "dfuseioice", "pools")
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
        return () => {
            client.release()
        }
    }, []);


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
                                    <Idea poolName={p.pool_name} client={client}/>
                                </div>
                            </li>
                        </div>
                    ))}
                </ul>
            </header>
        </div>
    );
}



export default App;
