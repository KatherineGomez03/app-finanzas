//mostrar estados o categorías
interface BadgeProps {
  children: React.ReactNode;
  color?: string; 
  className?: string;
}

export function Badge({ children, color = "bg-blue-600", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center px-2 py-1 text-[10px] md:text-xs font-semibold text-white rounded-sm border ${color} ${className}`}
    >
      {children}
    </span>
  );
}
