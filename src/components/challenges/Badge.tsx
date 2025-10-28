"use client";

export function Badge({
  children,
  color = "bg-blue-600",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      className={`px-2 py-1 rounded-sm text-[10px] font-semibold text-white ${color}`}
    >
      {children}
    </span>
  );
}
