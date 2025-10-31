"use client";

import React, { useEffect, useMemo, useState } from "react";
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

type InventoryDoc = {
  userId: string;
  itemKey: InvKey;
  qty: number;
};

function getUserId() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("userid") || ""; // <— cambiar si usan otro key
}

export default function InventoryPage() {
  const [rows, setRows] = useState<InventoryDoc[]>([]);
  const [loading, setLoading] = useState(true);

  // mapa {key -> qty}
  const qtyByKey = useMemo(() => {
    const out: Record<InvKey, number> = { potsVida: 0, potsVeneno: 0, antidoto: 0 };
    for (const r of rows) out[r.itemKey] = r.qty;
    return out;
  }, [rows]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const userId = getUserId();
        const res = await fetch(`/api/inventory?userId=${encodeURIComponent(userId)}`);
        const data: InventoryDoc[] = await res.json();
        if (mounted) setRows(Array.isArray(data) ? data : []);
      } catch {
        if (mounted) setRows([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="space-y-6 px-2 md:px-4 py-4">
      <h2 className="text-mission-primary flex items-center gap-2 text-sm md:text-base">
        <Package className="h-5 w-5" aria-hidden="true" />
        INVENTARIO
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg border-2 border-green-500 p-4 shadow-md relative">
          <div className="text-base font-semibold text-green-500 flex items-center gap-2">
            💚 Poción de Vida
            {!loading && (
              <span className="badge badge-primary ml-2">
                x{qtyByKey.potsVida}
              </span>
            )}
          </div>
          <div className="text-sm py-2 mt-1">Restaura 25 HP en Arena.</div>
        </div>

        <div className="bg-card rounded-lg border-2 border-purple-500 p-4 shadow-md relative">
          <div className="text-base font-semibold text-purple-500 flex items-center gap-2">
            ☠️ Poción de Veneno
            {!loading && (
              <span className="badge badge-primary ml-2">
                x{qtyByKey.potsVeneno}
              </span>
            )}
          </div>
          <div className="text-sm py-2 mt-1">Inflige 18 de daño al enemigo.</div>
        </div>

        <div className="bg-card rounded-lg border-2 border-blue-500 p-4 shadow-md relative">
          <div className="text-base font-semibold text-blue-500 flex items-center gap-2">
            🧪 Antídoto
            {!loading && (
              <span className="badge badge-primary ml-2">
                x{qtyByKey.antidoto}
              </span>
            )}
          </div>
          <div className="text-sm py-2 mt-1">Limpia efectos negativos.</div>
        </div>
      </div>
    </section>
  );
}
