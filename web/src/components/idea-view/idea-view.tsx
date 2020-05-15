import React, {useEffect, useState} from 'react';
import {IdeaRow} from "../../types"
import {Col, Row} from 'antd';
import {VoteList} from "../vote-list/vote-list";
import {styled} from "../../theme";
import {Bar, HorizontalBar} from 'react-chartjs-2';

const Score = styled.span`
    font-size:14px;
    font-weight:bold;
`;
const IdeaWrapper = styled.div`
    margin-top: 15px;
    margin-bottom: 5px;
`;
const IdeaTitle = styled.h1`
    cursor: pointer;
`;

const IdeaDescription = styled.p`
    cursor: pointer;
`;

const eosjsAccountName = require("eosjs-account-name");

interface IdeaListProps {
    idea: IdeaRow
}


export const IdeaView: React.FC<IdeaListProps> = ({idea}) => {

    const [showForm, setShowForm] = useState<boolean>(false);
    const chartRef = React.createRef();

    const handleClick = () => {
        setShowForm(!showForm)
    };
    const data = {
        // labels: ['I'],
        datasets: [
            {
                label: 'I',
                data: [idea.avg_impact],
                backgroundColor: '#D6E9C6' // green
            },
            {
                label: 'C',
                data: [idea.avg_confidence],
                backgroundColor: '#FAEBCC' // yellow
            },
            {
                label: 'E',
                data: [idea.avg_ease],
                backgroundColor: '#EBCCD1' // red
            },
            {
                label: 'B',
                data: [30 - (idea.avg_impact + idea.avg_confidence + idea.avg_ease)],
                backgroundColor: 'transparent' // red
            }
        ]
    };

    return (
        <IdeaWrapper key={idea.id}>
            <Row>
                <Col span={18}>
                    <HorizontalBar
                        data={data}
                        width={100}
                        height={50}

                        options={{
                            legend: {
                                display: false

                            },
                            maintainAspectRatio: false,
                            scales: {
                                xAxes: [{
                                    suggestedMax: 30,
                                    stacked: true,
                                    gridLines : {
                                        display : false,
                                        drawTicks: false
                                    },
                                    ticks:{
                                        display : false,
                                    }
                                }],
                                yAxes: [{
                                    suggestedMax: 30,
                                    stacked: true,
                                    gridLines : {
                                        display : false,
                                        drawTicks: false
                                    },
                                    ticks:{
                                        display : false,
                                    }
                                }]
                            }
                        }}
                    />
                </Col>
                <Col span={6} style={{textAlign: "right"}}>
                    <Score>{Math.round(idea.score)}</Score>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <IdeaTitle onClick={handleClick}>{idea.title}</IdeaTitle>
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