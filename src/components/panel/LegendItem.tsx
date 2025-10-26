import React from 'react';

interface LegendItemProps {
    label: string;
    amount: number;
    color: string;
}

export const LegendItem: React.FC<LegendItemProps> = ({ label, amount, color }) => {
    return (
        <div className="flex items-center justify-between w-full px-3 py-1 text-xs sm:text-sm text-white">
            <div className="flex items-center min-w-0 gap-2">
                <span
                    className="w-3 h-3 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                ></span>
                <span className="truncate">{label}</span>
            </div>

            <span className="flex-shrink-0 ml-2">${amount}</span>
        </div>
    );
};


