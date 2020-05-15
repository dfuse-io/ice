import React, {useEffect, useState} from 'react';
import {useAppState} from "../../state"
import {IdeaRow} from "../../types"
import {Button, Col, Row, Tooltip, Progress} from 'antd';
import {styled} from "../../theme";
import {IdeaView} from "../idea-view/idea-view";
const eosjsAccountName = require("eosjs-account-name")

const IdeasWrapper = styled.div`
`
const IdeaDescription = styled.p`
    cursor: pointer;
`

interface IdeaListProps {
    poolName: string
}

export const IdeaList: React.FC<IdeaListProps> = ({poolName}) => {
    const [ideas, setIdeas] = useState<IdeaRow[]>([]);
    const {dfuseClient} = useAppState()

    useEffect(() => {
        try {
            dfuseClient.stateTable<IdeaRow>("dfuseioice", poolName, "ideas")
                .then((ideaResult) => {
                    console.log("received ideas result");
                    let ideas: IdeaRow[] = [];
                    ideaResult.rows.map(r => {
                        const idea = r.json!;

                        idea.name = eosjsAccountName.uint64ToName(idea.id);
                        ideas.push(idea);
                        return true
                    });

                    console.log("ideas:" + ideas.length);
                    setIdeas(ideas)
                })
                .catch(reason => {
                    console.log(reason)

                });
        } catch (e) {
            console.warn("error");
        }

    }, [dfuseClient, poolName]);
    return (
        <IdeasWrapper>
            { ideas.map(idea => ( <IdeaView idea={idea} />))}
        </IdeasWrapper>
    )
};