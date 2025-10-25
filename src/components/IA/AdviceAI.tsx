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
    <section className="mission-section space-y-4">
      {/* Encabezado */}
      <div className="flex items-center gap-3">
        <span className="badge badge-outline">🤖</span>
        <h3 className="mission-title">IA de Consejos</h3>

        <div className="ml-auto flex flex-wrap items-center gap-3">
          <span className="badge">
            Gasto mensual: ${gastoMensual.toLocaleString()}
          </span>

          <span className="badge badge-primary">
            Meta: ${ahorroActual.toLocaleString()} / ${meta.toLocaleString()}
          </span>

          <button
            onClick={refetch}
            disabled={loading}
            className="badge"
            aria-label="Refrescar consejos"
          >
            ⟳ {loading ? "Cargando..." : "Refrescar"}
          </button>
        </div>
      </div>

      {/* Caja de resultados */}
      <div className="mission-panel">
        {tips.length === 0 ? (
          <div className="opacity-80">
            No hay recomendaciones por ahora. ¡Probá actualizar!
          </div>
        ) : (
          <ul className="mission-list space-y-2 text-sm">
            {tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}