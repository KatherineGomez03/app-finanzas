"use client";

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
import { useUserExpenses, } from "@/hooks/useUserExpenses";
import type { ExpenseCategory } from "@/hooks/useUserExpenses";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function BalanceSection() {
    const { expenses: currentExpenses, loading: loadingCurrent } = useUserExpenses(0);
    const { expenses: previousExpenses, loading: loadingPrevious } = useUserExpenses(-1);

    const categories = [
        "Alimentación",
        "Transporte",
        "Entretenimiento",
        "Servicios",
        "Otros",
    ];

    const sumByCategory = (data: ExpenseCategory[], category: string) =>
        data.find((d) => d.category === category)?.amount || 0;

    const chartData = {
        labels: categories,
        datasets: [
            {
                label: "Mes Actual",
                data: categories.map((cat) => sumByCategory(currentExpenses, cat)),
                backgroundColor: currentExpenses.map((e) => e.color || "#5dd9c1"),
            },
            {
                label: "Mes Anterior",
                data: categories.map((cat) => sumByCategory(previousExpenses, cat)),
                backgroundColor: "#d3d3d3",
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: {
                    font: { size: 10 },
                    padding: 12,
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    font: { size: 10 },
                    maxRotation: 45,
                    minRotation: 0,
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    font: { size: 10 },
                    stepSize: 100,
                },
            },
        },
    };

    if (loadingCurrent || loadingPrevious)
        return <p className="text-center text-gray-400">Cargando balance...</p>;

    return (
        <section className="w-full max-w-screen-lg mx-auto m-2 p-4 rounded-lg shadow-lg border border-2 text-white">
            <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <h2 className="text-lg">Balance</h2>
            </div>

            <div className="relative w-full h-[200px] md:h-[240px] lg:h-[280px]">
                <Bar data={chartData} options={chartOptions} />
            </div>
        </section>
    );
}
