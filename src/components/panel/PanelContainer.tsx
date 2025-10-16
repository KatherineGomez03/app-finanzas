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
        <div className="bg-gray-900 max-w-md p-4 m-2 relative w-full rounded-lg shadow-lg border-2 rounded">
            <Panel />
            <Donut data={mockExpenses} />
            <div className="mt-4">
                {mockExpenses.map((item, index) => (
                    <LegendItem
                        key={index}
                        label={item.category}
                        amount={item.amount}
                        color={item.color}
                    />
                ))}
            </div>
        </div>
    );
};

