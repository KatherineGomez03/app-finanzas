'use client';
import React from 'react';
import { Panel } from './Panel';
import { LegendItem } from './LegendItem';
import { useUserExpenses } from '@/hooks/useUserExpenses';

import { Donut } from './Donut';
export const PanelContainer = () => {
    const { expenses, loading, error } = useUserExpenses();

    if (loading) return <p className="text-center text-gray-400">Cargando datos...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    // Si no hay datos
    if (!expenses || expenses.length === 0)
        return (
            <div className="col-span-2 p-4 m-2 w-full rounded-lg shadow-lg border-2" >
                <p className="text-center text-gray-400">Sin gastos registrados</p>
            </div>
        )

    return (
        <div className="col-span-2 p-4 m-2 w-full rounded-lg shadow-lg border-2">
            <Panel />

            <section className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                <div className="w-40 sm:w-60">
                    <Donut data={expenses} />
                </div>

                <div className="w-full m-4 px-2">
                    {expenses.map((item, index) => (
                        <LegendItem
                            key={index}
                            label={item.category}
                            amount={item.amount}
                            color={item.color}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};


