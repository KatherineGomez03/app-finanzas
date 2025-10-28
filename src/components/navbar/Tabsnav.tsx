"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useSearchParams } from "next/navigation";

const items = [
  { tab: "panel", label: "Panel" },
  { tab: "misiones", label: "Misiones" },
  { tab: "tienda", label: "Tienda" },
  { tab: "inventario", label: "Inventario" },
  { tab: "arena", label: "Arena" },
  { tab: "historial", label: "Historial" },
];

export default function Tabsnav() {
  const [open, setOpen] = useState(false);
  const sp = useSearchParams();
  const active = sp.get("tab") ?? "panel";

  return (
    <div className="flex items-center">
      {/*desktop) */}
      <div className="hidden sm:flex flex-wrap gap-2 px-2 py-1 rounded bg-[var(--surface)]">
        {items.map(({ tab, label }) => {
          const href = tab === "panel" ? "/home" : `/home?tab=${tab}`;
          const isActive = active === tab;
          return (
            <Link
              key={tab}
              href={href}
              className={[
                "px-3 py-1 text-xs font-medium border border-[var(--grid)] transition-all duration-150",
                isActive
                  ? "bg-[var(--mission-primary)] text-black border-white shadow-[1px_1px_0_#000]"
                  : "text-[var(--text-primary)] hover:bg-[var(--color-card)] hover:text-white",
              ].join(" ")}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/*cuando se hace mobile */}
      <button
        onClick={() => setOpen(!open)}
        className="sm:hidden border border-[var(--grid)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--color-card)] p-2 ml-2 rounded"
      >
        {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {open && (
        <div
          className="absolute top-[100%] left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2
    bg-[var(--color-navy)] border-2 border-[var(--grid)] p-3 w-52 rounded-md shadow-[2px_2px_0_var(--pixel-shadow)]
    sm:hidden"
        >
          {items.map(({ tab, label }) => {
            const href = tab === "panel" ? "/home" : `/home?tab=${tab}`;
            const isActive = active === tab;
            return (
              <Link
                key={tab}
                href={href}
                onClick={() => setOpen(false)}
                className={[
                  "text-center text-sm font-medium py-3 rounded border-2 border-[var(--grid)] transition-all duration-150",
                  isActive
                    ? "bg-[var(--mission-primary)] text-black border-white shadow-[1px_1px_0_#000]"
                    : "bg-[var(--color-navy)] text-white hover:bg-[var(--color-card)] hover:text-[var(--mission-primary)]",
                ].join(" ")}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
