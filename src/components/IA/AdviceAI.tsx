"use client";

import React, { useState } from "react";


type AdviceAIProps = {
  gastoMensual?: number;   // gasto total del mes mock/front
  ahorroActual?: number;   // ahorro acumulado
  meta?: number;           // objetivo de ahorro
};

export default function AdviceAI({
  gastoMensual = 5000,
  ahorroActual = 1350,
  meta = 2000,
}: AdviceAIProps) {
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function refetch() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-tips", { method: "POST" });
      if (!res.ok) throw new Error("bad status");
      const data = (await res.json()) as { tips?: string[] };
      setTips(data.tips ?? []);
    } catch {
      // Fallback local mientras el endpoint no exista
      setTips([
        "Reservá un 10% de cada ingreso apenas lo recibas.",
        "Dá de baja 2 suscripciones que no usás.",
        "Poné un tope semanal para delivery y transporte.",
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="m-2 p-3 md:p-4 space-y-3 md:space-y-4 border-2 rounded-lg">
      {/* Encabezado */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <span className="badge badge-outline shrink-0">🤖</span>
        <h3 className="mission-title text-sm md:text-base">IA de Consejos</h3>

        <div className="ml-auto flex flex-wrap items-center gap-2 md:gap-3 w-full sm:w-auto">
          <span className="badge text-xs md:text-sm w-full sm:w-auto justify-center">
            Gasto mensual: ${gastoMensual.toLocaleString()}
          </span>

          <span className="badge badge-primary text-xs md:text-sm w-full sm:w-auto justify-center">
            Meta: ${ahorroActual.toLocaleString()} / ${meta.toLocaleString()}
          </span>

          <button
            onClick={refetch}
            disabled={loading}
            className="badge text-xs md:text-sm w-full sm:w-auto justify-center"
            aria-label="Refrescar consejos"
          >
            ⟳ {loading ? "Cargando..." : "Refrescar"}
          </button>
        </div>
      </div>

      {/* Caja de resultados */}
      <div className="mission-panel p-3 md:p-4">
        {tips.length === 0 ? (
          <div className="opacity-80 text-sm md:text-base leading-relaxed">
            No hay recomendaciones por ahora. ¡Probá actualizar!
          </div>
        ) : (
          <ul className="mission-list space-y-2 text-sm md:text-base">
            {tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}