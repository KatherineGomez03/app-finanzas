'use client';
import React from 'react';
import { Panel } from './Panel';
import { LegendItem } from './LegendItem';

import { Donut } from './Donut';
const mockExpenses = [
    { category: "Alimentación", amount: 1500, color: "#5dd9c1" },
    { category: "Transporte", amount: 1000, color: "#ff7f7f" },
    { category: "Entretenimiento", amount: 750, color: "#ffe599" },
    { category: "Servicios", amount: 1250, color: "#95d5b2" },
    { category: "Otros", amount: 500, color: "#64b5f6" }
];

export const PanelContainer = () => {
    return (
        <div className="col-span-2 p-4 m-2 w-full rounded-lg shadow-lg border-2">
            <Panel />

            <section className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                <div className="w-40 sm:w-60">
                    <Donut data={mockExpenses} />
                </div>

                <div className="w-full m-4">
                    {mockExpenses.map((item, index) => (
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

