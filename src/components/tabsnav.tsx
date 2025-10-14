"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const TABS = [
  { href: "/",          label: "PANEL" },
  { href: "/misiones",  label: "MISIONES" },
  { href: "/tienda",    label: "TIENDA" },
  { href: "/inventario",label: "INVENTARIO" },
  { href: "/arena",     label: "ARENA" },
  { href: "/gastos",    label: "HISTORIAL" },
  { href: "/logros",    label: "LOGROS" },
  { href: "/ranking",   label: "RANKING" },
];

export default function TabsNav(){
  const pathname = usePathname();
  return (
    <div className="w-full grid place-items-center">
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border px-2 py-2"
           style={{ borderColor:"var(--grid)", background:"#192235" }}>
        {TABS.map(t => {
          const active = t.href === "/" ? pathname === "/" : pathname?.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={clsx(
                "px-3 py-2 rounded-lg text-xs",
                active
                  ? "bg-[var(--primary)] text-white"
                  : "bg-transparent hover:bg-neutral-800/60"
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
