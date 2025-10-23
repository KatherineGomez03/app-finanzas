"use client";

import React from "react";

// UI mínima para verificar render
export default function InventoryPage() {
  const items = [
    { key: "potsVida",   name: "Poción de Vida",   desc: "Restaura 25 HP en Arena.",   icon: "💚" },
    { key: "potsVeneno", name: "Poción de Veneno", desc: "Inflige 18 de daño al enemigo.", icon: "☠️" },
    { key: "antidoto",   name: "Antídoto",         desc: "Limpia efectos negativos.",     icon: "🧪" },
  ];

  return (
    <div className="space-y-6">
      <div className="mission-section border-2 border-white/80 rounded-xl">
        <h3 className="mission-title mb-3">Inventario</h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <div key={it.key} className="rounded-lg border border-[var(--grid)] p-3 bg-[var(--color-card)]">
              <div className="flex items-center gap-2">
                <span className="text-lg">{it.icon}</span>
                <div className="font-medium">{it.name}</div>
              </div>
              <div className="text-xs opacity-80 mt-1">{it.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
