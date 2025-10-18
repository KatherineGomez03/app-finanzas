"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const items = [
  { tab: "panel",     label: "Panel" },
  { tab: "gastos",    label: "Gastos" },
  { tab: "tienda",    label: "Tienda" },
  { tab: "inventario",label: "Inventario" },
  { tab: "arena",     label: "Arena" },
];

export default function Tabsnav() {
  const sp = useSearchParams();
  const active = sp.get("tab") ?? "panel";

  return (
    <nav className="w-full flex justify-center">
      <div className="flex gap-2 px-2 py-1 rounded border border-[var(--grid)] bg-[var(--surface)]">
        {items.map(({ tab, label }) => {
          const href = tab === "panel" ? "/" : `/?tab=${tab}`;
          const isActive = active === tab;
          return (
            <Link
              key={tab}
              href={href}
              className={[
                "px-3 py-1 text-xs font-medium border border-[var(--grid)]",
                isActive ? "bg-[var(--primary)] text-black"
                         : "text-[var(--text-primary)] hover:bg-black/30"
              ].join(" ")}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
