import React, {useEffect, useState} from 'react';
import './App.css';
import {createDfuseClient} from "@dfuse/client"
import { createInitialTypes, SerialBuffer, TextEncoder, TextDecoder } from 'eosjs/dist/eosjs-serialize';

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
    ideas: IdeaRow[]
}

interface IdeaRow {
    Id: number;
    poolName: string;
    author: string;
    description: string;
    avgImpact: number;
    avgConfidence: number;
    avg_ease: number;
    score: number;
    total_votes: number;
}

interface VoteRow {
    ideaId: number;
    voter: string;
    impact: number;
    confidence: number;
    ease: number;
}

type IdeaProps = { poolName: string };
const Idea = ({poolName}: IdeaProps) => {
    const [ideas, setIdeas] = useState<IdeaRow[]>([]);

    useEffect(() => {
        client.stateTable<IdeaRow>("dfuseioice", poolName, "ideas")
            .then((ideaResult) => {
                console.log("received ideas result");
                let ideas: IdeaRow[] = [];
                ideaResult.rows.map(r => {
                    const idea = r.json!;
                    console.log("ideas: " + idea.description);
                    ideas.push(idea);
                    console.log("id to name" + uint64ToName(idea.Id));
                    return true
                });

                console.log("ideas:" + ideas.length);
                setIdeas(ideas)
            })
            .catch(reason => {
                console.log(reason)

            });
    }, [poolName]);
    return (
        <ul>
            {ideas.map(i => (
                <li>{i.description}</li>
            ))}
        </ul>
    )
};


function App() {

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
                        <div>
                            <li>
                                <div>
                                    <h2>{p.description}({p.pool_name})</h2>
                                    <Idea poolName={p.pool_name}/>
                                </div>
                            </li>
                        </div>
                    ))}
                </ul>
            </header>
        </div>
    );
}

// All those variables can be cached and re-used, no need to get them back on each computation
const builtinTypes = createInitialTypes();
const typeUint64 = builtinTypes.get("uint64")!;
const typeName = builtinTypes.get("name")!;
function uint64ToName(value: string|number): string {
    // This one is trickier because it contains a "state". It can be shared among all calls
    // due to JavaScript nature. Simply ensure that it being used solely for name encoding/decoding
    // and ensure that number of bytes serialized is always the also deserialized.
    //
    // To play safe, this example does not share it among all callers.
    const buffer = new SerialBuffer({ textDecoder: new TextDecoder() as any, textEncoder: new TextEncoder(), array: [] as any});
    typeUint64.serialize(buffer, value);
    return typeName.deserialize(buffer)
}


export default App;
