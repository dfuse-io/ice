import React, {useEffect, useState} from 'react';
import {useAppState} from "../../state"
import {Action, IdeaRow} from "../../types"
import {Button, Col, Row, Tooltip, Progress, message} from 'antd';
import {styled} from "../../theme";
import {IdeaView} from "../idea-view/idea-view";
import {ifError} from "assert";
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
    const {dfuseClient, lastSeenAction} = useAppState()

    useEffect(() => {
        fetchIdeas();
    }, [dfuseClient, poolName]);

    useEffect(() => {
        console.log("refreshing: ", lastSeenAction, poolName)
        if (lastSeenAction &&  (lastSeenAction.type == "addidea") && (lastSeenAction.contextId == poolName)) {
            fetchIdeas();
        }
    }, [lastSeenAction]);


    const fetchIdeas = () => {
        try {
            dfuseClient.stateTable<IdeaRow>("dfuseioice", poolName, "ideas")
                .then((ideaResult) => {
                    let ideas: IdeaRow[] = [];
                    ideaResult.rows.map(r => {
                        const idea = r.json!;

                        idea.key = eosjsAccountName.uint64ToName(idea.id);
                        ideas.push(idea);
                        return true
                    });

                    ideas = ideas.sort((a: IdeaRow, b: IdeaRow) => a.score < b.score ? 1 : -1)
                    setIdeas(ideas)
                })
                .catch(reason => {
                    throw reason
                });
        } catch (e) {
            message.error("Oops! Unable to get ideas: " + e)
        }
    }

    return (
        <IdeasWrapper>
            { ideas
                .map(idea => ( <IdeaView key={idea.id} idea={idea} />))}
        </IdeasWrapper>
    )
};