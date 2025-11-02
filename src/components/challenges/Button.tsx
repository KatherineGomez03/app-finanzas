'use client';
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}
export function Button({ children, ...props }: Props) {
  return (
    <button
      {...props}
      className={`px-3 py-2 rounded-xl border text-xs md:text-sm transition 
        disabled:opacity-60 disabled:cursor-not-allowed
        hover:scale-[1.02] border-[var(--mission-primary)]`}
      style={{ boxShadow: `0 2px 0 var(--pixel-shadow)` }}
    >
      {children}
    </button>
  );
}
