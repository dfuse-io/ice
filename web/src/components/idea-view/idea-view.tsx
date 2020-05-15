import React, {useEffect, useState} from 'react';
import {useAppState} from "../../state"
import {IdeaRow} from "../../types"
import {Button, Col, Row, Tooltip, Progress} from 'antd';
import {VoteList} from "../vote-list/vote-list";
import {styled} from "../../theme";

const Score = styled.span`
    font-size:14px;
    font-weight:bold;
`
const IdeaWrapper = styled.div`
    margin-top: 15px;
    margin-bottom: 5px;
`
const IdeaTitle = styled.h1`
    cursor: pointer;
`

const IdeaDescription = styled.p`
    cursor: pointer;
`

const eosjsAccountName = require("eosjs-account-name")

interface IdeaListProps {
    idea: IdeaRow
}

export const IdeaView: React.FC<IdeaListProps> = ({idea}) => {

    const [showForm, setShowForm] = useState<boolean>(false);

    const handleClick = () => {
        setShowForm(!showForm)
    }
    return (
        <IdeaWrapper key={idea.id}>
            <Row>
                <Col span={18}>
                    <Tooltip title="">
                        <Progress
                            percent={idea.avg_confidence * (3.333333)}
                            successPercent={idea.avg_ease  * (3.333333)}
                            showInfo={false}
                        />
                    </Tooltip>
                </Col>
                <Col span={6} style={{textAlign: "right"}}>
                    <Score>{Math.round(idea.score)}</Score>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <IdeaTitle onClick={handleClick}>Create an ICE dapp</IdeaTitle>
                </Col>
                <Col span={24}>
                    <IdeaDescription onClick={handleClick}>{idea.description}</IdeaDescription>
                </Col>
                {
                    showForm && (
                        <Col span={24} style={{textAlign: "center"}}>
                            <VoteList idea={idea}/>
                        </Col>

                    )
                }
            </Row>
        </IdeaWrapper>
    )
};