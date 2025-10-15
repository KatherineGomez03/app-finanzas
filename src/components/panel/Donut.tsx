import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutProps {
  data: {
    category: string;
    amount: number;
    color: string;
  }[];
}

export const Donut: React.FC<DonutProps> = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.category),
    datasets: [
      {
        data: data.map(item => item.amount),
        backgroundColor: data.map(item => item.color),
        borderWidth: 2,
        borderColor: '#111',
      },
    ],
  };

  const options = {
    cutout: '60%',
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="w-full max-w-xs mx-auto p-4">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};
