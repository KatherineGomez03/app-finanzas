"use client";

import React from "react";
import { Package } from "lucide-react";
import { useInventory, InvKey } from "@/hooks/useInventory";

type Card = {
  key: InvKey;
  title: string;
  desc: string;
  icon: string;
  accent: string;
};

const CARDS: Card[] = [
  {
    key: "pocion_vida",
    title: "Poción de Vida",
    desc: "Restaura 25 HP en Arena.",
    icon: "💚",
    accent: "border-emerald-300",
  },
  {
    key: "pocion_veneno",
    title: "Poción de Veneno",
    desc: "Inflige 18 de daño al enemigo.",
    icon: "☠️",
    accent: "border-purple-300",
  },
  {
    key: "antidoto",
    title: "Antídoto",
    desc: "Limpia efectos negativos.",
    icon: "🧪",
    accent: "border-cyan-300",
  },
];

export default function InventoryPage() {
  const { loading, error, qty } = useInventory();

  return (
    <section className="space-y-6 px-2 md:px-4 py-4">
      <h2 className="text-mission-primary flex items-center gap-2 text-sm md:text-base">
        <Package className="h-5 w-5" aria-hidden="true" />
        INVENTARIO
      </h2>

      {error && <div className="text-red-400 text-sm">Error: {error}</div>}
      {loading && <div className="text-xs opacity-80">Cargando inventario...</div>}

      <div className="grid md:grid-cols-2 gap-4">
        {CARDS.map((c) => {
          const n = qty(c.key);
          const empty = n <= 0;
          return (
            <div key={c.key} className={`bg-card rounded-lg border-2 p-4 shadow-md ${c.accent}`}>
              <div className="flex items-center justify-between">
                <div className="text-base font-semibold flex items-center gap-2">
                  <span aria-hidden="true">{c.icon}</span> {c.title}
                </div>
                <span className={`badge ${empty ? "opacity-60" : "badge-primary"}`}>{n} u.</span>
              </div>

              <div className="text-sm py-2 mt-1 opacity-90">{c.desc}</div>

              {empty ? (
                <div className="text-[11px] opacity-70 mt-1">
                  No tenés {c.title.toLowerCase()} por ahora.
                </div>
              ) : (
                <div className="text-[11px] opacity-70 mt-1">
                  Usable solo dentro de <b>Arena</b>.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
