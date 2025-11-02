"use client";

export function ProgressBar({
  current,
  max,
  color = "bg-green-500",
}: {
  current: number;
  max: number;
  color?: string;
}) {
  const percentage = Math.min((current / max) * 100, 100);
  return (
    <div className="w-full h-2 bg-gray-700 rounded overflow-hidden">
      <div 
        className={`${color} h-full transition-all duration-300 ease-out`} 
        style={{ width: `${percentage}%` }} 
      />
    </div>
  );
}
