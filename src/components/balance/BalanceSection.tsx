// components/BalanceSection.tsx
import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

//ESTO ESTA 2 VECES Y NO DEBERIA! LUEGO SE CORRIJE
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
    userId: string;
};

export default function BalanceSection({ userId }: Props) {
    const [currentMonthData, setCurrentMonthData] = useState<Record<string, number>>({});
    const [previousMonthData, setPreviousMonthData] = useState<Record<string, number>>({});

    useEffect(() => {
        async function fetchExpenses() {
            const res = await fetch(`/api/expenses?userId=${userId}`);
            const data: { current: Expense[]; previous: Expense[] } = await res.json();

            const sumByCategory = (expenses: Expense[]) =>
                expenses.reduce((acc, exp) => {
                    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
                    return acc;
                }, {} as Record<string, number>);

            setCurrentMonthData(sumByCategory(data.current));
            setPreviousMonthData(sumByCategory(data.previous));
        }

        fetchExpenses();
    }, [userId]);

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
        <section className="p-4 font-press-start text-xs text-white bg-black min-h-screen">
            <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg">Balance</h2>
            </div>
            <div className="bg-gray-900 p-4 rounded-lg">
                <Bar data={chartData} options={chartOptions} />
            </div>
        </section>
    );
}
