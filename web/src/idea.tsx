import React, {useEffect, useState} from 'react';
import { DfuseClient } from "@dfuse/client"
import * as Eos from 'eosjs'

interface IdeaProps {
    poolName: string
    client: DfuseClient
};

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


// All those variables can be cached and re-used, no need to get them back on each computation
const builtinTypes = Eos.Serialize.createInitialTypes();
const typeUint64 = builtinTypes.get("uint64")!;
const typeName = builtinTypes.get("name")!;
const uint64ToName = (value: string|number): string => {
    // This one is trickier because it contains a "state". It can be shared among all calls
    // due to JavaScript nature. Simply ensure that it being used solely for name encoding/decoding
    // and ensure that number of bytes serialized is always the also deserialized.
    //
    // To play safe, this example does not share it among all callers.
    const buffer = new Eos.Serialize.SerialBuffer({
        textDecoder: new TextDecoder() as any,
        textEncoder: new TextEncoder() as any,
        array: [] as any
    });
    typeUint64.serialize(buffer, value);
    return typeName.deserialize(buffer)
}

// console.log("2 ", uint64ToName(65))
// console.log("3 ", uint64ToName(111111111111))

export const Idea: React.FC<IdeaProps> = ({ poolName, client}) => {
    const [ideas, setIdeas] = useState<IdeaRow[]>([]);

    useEffect(() => {
        client.stateTable<IdeaRow>("dfuseioice", poolName, "ideas")
            .then((ideaResult) => {
                console.log("received ideas result");
                let ideas: IdeaRow[] = [];
                ideaResult.rows.map(r => {
                    const idea = r.json!;
                    ideas.push(idea);
                    console.log("1 ", uint64ToName(20401))
                    // console.log("id to name" + uint64ToName(idea.Id));
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
                <li key={i.Id}>{i.description}</li>
            ))}
        </ul>
    )
}