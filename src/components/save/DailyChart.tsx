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
        <div className="px-4 py-2 w-[260px] h-[130px] md:w-[520px] md:h-[260px]">
            <Line data={data} />
        </div>
    );
};

export default DailyChart;
