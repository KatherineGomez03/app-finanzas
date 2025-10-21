// components/BalanceSectionStatic.tsx
import { BarChart3 } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const categories = [
    { category: "Alimentación", color: "#5dd9c1" },
    { category: "Transporte", color: "#ff7f7f" },
    { category: "Entretenimiento", color: "#ffe599" },
    { category: "Servicios", color: "#95d5b2" },
    { category: "Otros", color: "#64b5f6" },
];

type Expense = {
    amount: number;
    category: string;
    date: string;
};

type Props = {
    current: Expense[];
    previous: Expense[];
};

export default function BalanceSectionStatic({ current, previous }: Props) {
    const sumByCategory = (expenses: Expense[]) =>
        expenses.reduce((acc, exp) => {
            acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
            return acc;
        }, {} as Record<string, number>);

    const currentMonthData = sumByCategory(current);
    const previousMonthData = sumByCategory(previous);

    const chartData = {
        labels: categories.map((c) => c.category),
        datasets: [
            {
                label: "Mes Actual",
                data: categories.map((c) => currentMonthData[c.category] || 0),
                backgroundColor: categories.map((c) => c.color),
            },
            {
                label: "Mes Anterior",
                data: categories.map((c) => previousMonthData[c.category] || 0),
                backgroundColor: "#d3d3d3",
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: "bottom" as const },
        },
    };

    return (
        <section className="bg-gray-900 max-w-md p-4 m-2 relative w-full rounded-lg shadow-lg border-2 rounded text-white">
            <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg">Balance</h2>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg">
                <div className="w-full mx-auto p-2 animate-fade-in">
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>
        </section>
    );
}
