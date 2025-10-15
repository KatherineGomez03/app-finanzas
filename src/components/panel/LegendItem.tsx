import React from 'react';

interface LegendItemProps {
    label: string;
    amount: number;
    color: string;
}

export const LegendItem: React.FC<LegendItemProps> = ({ label, amount, color }) => {
    return (
        <div className="flex justify-between items-center w-full px-4 py-2 text-sm">
            <span className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: color }}></span>
            <span className="flex-1 text-white">{label}</span>
            <span className="text-white">${amount}</span>
        </div>
    );
};
