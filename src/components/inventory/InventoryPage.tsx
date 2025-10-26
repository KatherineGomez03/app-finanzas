"use client";

import React from "react";

type InvKey = "potsVida" | "potsVeneno" | "antidoto";
type Item = {
  key: InvKey;
  name: string;
  desc: string;
  icon: string;
  accent?: string;
};

const ITEMS: Item[] = [
  {
    key: "potsVida",
    name: "Poción de Vida",
    desc: "Restaura 25 HP en Arena.",
    icon: "💚",
    accent: "border-emerald-300",
  },
  {
    key: "potsVeneno",
    name: "Poción de Veneno",
    desc: "Inflige 18 de daño al enemigo.",
    icon: "☠️",
    accent: "border-purple-300",
  },
  {
    key: "antidoto",
    name: "Antídoto",
    desc: "Limpia efectos negativos.",
    icon: "🧪",
    accent: "border-cyan-300",
  },
];

export default function InventoryPage() {
  return (
    <section className="mission-section space-y-4">
      <h3 className="mission-title">Inventario</h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="mission-panel">
          <div className="font-bold">💚 Poción de Vida</div>
          <div className="text-sm opacity-90">Restaura 25 HP en Arena.</div>
        </div>

        <div className="mission-panel">
          <div className="font-bold">⚔️ Poción de Veneno</div>
          <div className="text-sm opacity-90">Inflige 18 de daño al enemigo.</div>
        </div>

        <div className="mission-panel">
          <div className="font-bold">🪄 Antídoto</div>
          <div className="text-sm opacity-90">Limpia efectos negativos.</div>
        </div>
      </div>
    </section>

  );
}
