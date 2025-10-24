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
];

export default function Tabsnav() {
  const [open, setOpen] = useState(false);
  const sp = useSearchParams();
  const active = sp.get("tab") ?? "panel";

  return (
    <div className="flex items-center">
      {/* 🔹 NAVBAR (desktop) */}
      <div className="hidden sm:flex flex-wrap gap-2 border border-[var(--grid)] px-2 py-1 rounded bg-[var(--surface)]">
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

      {/* 🔹 BOTÓN MENÚ (mobile) */}
      <button
        onClick={() => setOpen(!open)}
        className="sm:hidden border border-[var(--grid)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--color-card)] p-2 ml-2 rounded"
      >
        {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* 🔹 MENÚ DESPLEGABLE (mobile) */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute top-[120%] left-0 z-50 flex flex-col gap-1 bg-[var(--surface)] border border-[var(--grid)] p-2 w-40 rounded sm:hidden"
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
                    "px-2 py-1 text-xs font-medium border border-[var(--grid)] text-center rounded transition-all duration-150",
                    isActive
                      ? "bg-[var(--mission-primary)] text-black border-white"
                      : "text-[var(--text-primary)] hover:bg-[var(--color-card)] hover:text-white",
                  ].join(" ")}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
