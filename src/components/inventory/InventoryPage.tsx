"use client";

import React from "react";
import { Package } from "lucide-react";

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
    <section className="space-y-6 px-2 md:px-4 py-4">

      <h2 className="text-mission-primary flex items-center gap-2 text-sm md:text-base">
        <Package className="h-5 w-5" aria-hidden="true" />
        INVENTARIO
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg border-2 border-green-500 from-green-100 to-green-200 p-4 shadow-md">
          <div className="text-base font-semibold text-green-500 flex items-center gap-2">
            💚 Poción de Vida
          </div>
          <div className="text-sm py-2 mt-1">Restaura 25 HP en Arena.</div>
        </div>

        <div className="bg-card rounded-lg border-2 border-purple-500 p-4 shadow-md">
          <div className="text-base font-semibold text-purple-500 flex items-center gap-2">
            ⚔️ Poción de Veneno
          </div>
          <div className="text-sm py-2 mt-1">Inflige 18 de daño al enemigo.</div>
        </div>

        <div className="bg-card rounded-lg border-2 border-blue-500 from-blue-100 to-blue-200 p-4 shadow-md">
          <div className="text-base font-semibold text-blue-500 flex items-center gap-2">
            🧪 Antídoto
          </div>
          <div className="text-sm py-2 mt-1">Limpia efectos negativos.</div>
        </div>
      </div>

    </section >

  );
}
