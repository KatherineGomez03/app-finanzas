'use client';
export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return (
    <div className="w-full h-3 bg-black/30 rounded-md overflow-hidden border border-white/10">
      <div
        className="h-full"
        style={{
          width: `${pct}%`,
          background: 'var(--mission-primary)',
          transition: 'width .25s ease',
        }}
      />
    </div>
  );
}
