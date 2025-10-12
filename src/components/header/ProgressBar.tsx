interface ProgressBarProps {
    label: string
    current: number
    max: number
    color: string
}

export const ProgressBar = ({ label, current, max, color }: ProgressBarProps) => {
    const percentage = (current / max) * 100
    return (
        <div className="w-full">
            <span className="text-xs text-white">{label}: {current}/{max}</span>
            <div className="w-full bg-gray-700 rounded h-2 mt-1">
                <div className={`h-2 rounded ${color}`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    )
}
