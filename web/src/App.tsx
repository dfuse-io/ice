import React, {useState, useEffect} from 'react';

import './App.css';
import {createDfuseClient} from "@dfuse/client"


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
    ideaId: number;
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
                    return true
                });

                console.log("ideas:" + ideas.length)
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
}


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

export default App;
