import React, {useEffect, useState} from 'react';
import { useAppState } from "../../state"
import { IdeaRow } from "../../types"

interface IdeaListProps {
    poolName: string
};

export const IdeaList: React.FC<IdeaListProps> = ({ poolName}) => {
    const [ideas, setIdeas] = useState<IdeaRow[]>([]);
    const { dfuseClient } = useAppState()

    useEffect(() => {
        dfuseClient.stateTable<IdeaRow>("dfuseioice", poolName, "ideas")
            .then((ideaResult) => {
                console.log("received ideas result");
                let ideas: IdeaRow[] = [];
                ideaResult.rows.map(r => {
                    const idea = r.json!;
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
        <ul>
            {ideas.map(i => (
                <li key={i.Id}>{i.description}</li>
            ))}
        </ul>
    )
}