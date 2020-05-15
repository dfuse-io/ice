import React, {useEffect, useState} from "react";
import {Bar, HorizontalBar} from 'react-chartjs-2';
import {IdeaRow} from "../../types";

interface IdeaProgressBarProps {
    idea: IdeaRow
}

interface Data {
    label: string
    data: number[]
    backgroundColor: string
}
export const IdeaProgressBar: React.FC<IdeaProgressBarProps> =({ idea }) => {
    const [data, setData]  = useState<Data[]>([])
    const chartRef = React.createRef();

    useEffect(() => {
        let newData: Data[] = []
        newData.push({
            label: 'I',
            data: [idea.avg_impact],
            backgroundColor: '#D6E9C6' // green
        })
        newData.push({
            label: 'C',
            data: [idea.avg_confidence],
            backgroundColor: '#FAEBCC' // yellow
        })
        newData.push({
            label: 'E',
            data: [idea.avg_ease],
            backgroundColor: '#EBCCD1' // red
        })
        newData.push({
            label: 'B',
            data: [30 - (idea.avg_impact + idea.avg_confidence + idea.avg_ease)],
            backgroundColor: 'transparent' // red
        })
        setData(newData)

    }, [])

    return (
        <>
            { console.log(data)}
            <HorizontalBar
                data={{datasets: data}}
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
        </>
    )
}