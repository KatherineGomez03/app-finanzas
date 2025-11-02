'use client';
export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-1 text-[10px] uppercase tracking-wider border rounded bg-[var(--color-card)] border-white/15">
      {children}
    </span>
  );
}
