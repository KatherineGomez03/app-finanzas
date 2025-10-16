'use client';
import { FC } from 'react';
import SaveBar from './SaveBar';
import DailyChart from './DailyChart';
import { CalendarDays } from 'lucide-react';
import { ProgressBar } from '../header/ProgressBar';

export interface SaveData {
    current: number;
    goal: number;
    remainingDays: number;
    dailySavings: number[];
}

const SaveContainer: FC<SaveData> = ({ current, goal, remainingDays, dailySavings }) => {
    const remaining = goal - current;

    return (
        <div className="w-full max-w-md p-4 border-2 rounded-lg shadow-md text-white font-press lg:max-w-xl lg:p-6">
            <h2 className="text-sm mb-2 lg:text-base">Meta de Ahorro Mensual</h2>
            <SaveBar current={current} goal={goal} />
            <div className="mt-2 flex justify-between items-center text-xs lg:text-sm">
                <span className="text-yellow-400">~Faltan ${remaining}</span>
                <span className="flex items-center gap-1 text-blue-400">
                    <CalendarDays className="w-4 h-4" />
                    {remainingDays} días restantes
                </span>
            </div>
            <DailyChart dailySavings={dailySavings} />

            <div className="w-full max-w-md p-4 border-2">
                PONE UNA RAAACHA PARA RELLENAR PORFI
                <ProgressBar label="Raaacha" current={5} max={30} color="bg-yellow-500" />
            </div>
        </div>

    );
};

export default SaveContainer;
