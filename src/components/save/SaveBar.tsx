import { FC } from 'react';
import { Gauge } from 'lucide-react';

interface SaveBarProps {
    current: number;
    goal: number;
}

const SaveBar: FC<SaveBarProps> = ({ current, goal }) => {
    const percentage = Math.min((current / goal) * 100, 100);

    return (
        <div className="w-full px-4 py-2">
            <div className="flex items-center gap-2 font-press text-xs text-green-500">
                <Gauge className="w-4 h-4" />
                <span>{`${current} de ${goal} meta`}</span>
                <span className="ml-auto bg-green-600 text-white px-2 py-1 rounded">{`${Math.floor(percentage)}%`}</span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded mt-2">
                <div className="h-full bg-green-500 rounded" style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
};

export default SaveBar;
