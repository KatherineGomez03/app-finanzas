import { FC } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);

interface DailyChartProps {
    dailySavings: number[];
}

const DailyChart: FC<DailyChartProps> = ({ dailySavings }) => {
    const data = {
        labels: dailySavings.map((_, i) => `Día ${i + 1}`),
        datasets: [
            {
                label: 'Ahorro diario',
                data: dailySavings,
                borderColor: '#22c55e',
                backgroundColor: '#22c55e',
                tension: 0.3,
            },
        ],
    };

    return (
        <div className="mt-4 px-4 py-2">
            <Line data={data} />
        </div>
    );
};

export default DailyChart;
