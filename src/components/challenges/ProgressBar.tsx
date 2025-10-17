interface ProgressBarProps {
  current: number;
  max: number;
  color?: string; 
}

export function ProgressBar({ current, max, color = "bg-green-500" }: ProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="w-full h-3 bg-gray-800 rounded-sm overflow-hidden border border-gray-700">
      <div
        className={`h-full ${color} transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
