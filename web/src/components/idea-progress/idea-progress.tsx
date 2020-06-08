import React, { useEffect, useState } from 'react';
import { HorizontalBar } from 'react-chartjs-2';
import { IdeaRow } from '../../types';

interface IdeaProgressBarProps {
  idea: IdeaRow;
}

interface Data {
  label: string;
  data: number[];
  backgroundColor: string;
}
export const IdeaProgressBar: React.FC<IdeaProgressBarProps> = ({
  idea,
}: IdeaProgressBarProps) => {
  const [data, setData] = useState<Data[]>([]);
  useEffect(() => {
    const newData: Data[] = [];
    newData.push({
      label: 'I',
      data: [idea.avg_impact],
      backgroundColor: '#6fa8dcff', // green
    });
    newData.push({
      label: 'C',
      data: [idea.avg_confidence],
      backgroundColor: '#9fc5e8ff', // yellow
    });
    newData.push({
      label: 'E',
      data: [idea.avg_ease],
      backgroundColor: '#cfe2f3ff', // red
    });
    newData.push({
      label: 'B',
      data: [30 - (idea.avg_impact + idea.avg_confidence + idea.avg_ease)],
      backgroundColor: 'transparent', // red
    });
    setData(newData);
  }, [idea]);

  return (
    <>
      <HorizontalBar
        data={{ datasets: data }}
        width={100}
        height={12}
        options={{
          legend: {
            display: false,
          },
          tooltips: {
            enabled: false,
          },
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                suggestedMax: 30,
                stacked: true,
                gridLines: {
                  display: false,
                  drawTicks: false,
                },
                ticks: {
                  display: false,
                },
              },
            ],
            yAxes: [
              {
                suggestedMax: 30,
                stacked: true,
                gridLines: {
                  display: false,
                  drawTicks: false,
                },
                ticks: {
                  display: false,
                },
              },
            ],
          },
        }}
      />
    </>
  );
};
