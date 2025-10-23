"use client";

import { useEffect, useMemo, useState } from "react";

type TipsRequest = {
  monthlyIncome?: number;
  savingsGoal?: number;
  currentSavings?: number;
  daysLeft?: number;
  expensesByCategory: Record<string, number>; // ej: { Alimentación: 1500, Transporte: 1000, ... }
};

type Tip = {
  title: string;
  body: string;
  impact: "low" | "medium" | "high"; // severidad/impacto
  category?: string;
};

async function fetchTips(payload: TipsRequest): Promise<Tip[]> {
  try {
    const res = await fetch("/api/ai-tips", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("bad status");
    const data = await res.json();
    if (Array.isArray(data?.tips)) return data.tips as Tip[];
    return [];
  } catch {
    return [];
  }
}

export default function AdviceAI(props: TipsRequest) {
  const [tips, setTips] = useState<Tip[] | null>(null);
  const [loading, setLoading] = useState(true);

  // métrica simple para mostrar en la cabecera
  const totalExpenses = useMemo(
    () => Object.values(props.expensesByCategory || {}).reduce((a, b) => a + b, 0),
    [props.expensesByCategory]
  );

  const load = async () => {
    setLoading(true);
    const res = await fetchTips(props);
    setTips(res);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="mission-section space-y-3">
      <div className="flex items-center justify-between">
        <div className="mission-title">🤖 IA de Consejos</div>
        <div className="flex items-center gap-2">
          <span className="badge">Gasto mensual: ${totalExpenses}</span>
          {typeof props.savingsGoal === "number" && typeof props.currentSavings === "number" && (
            <span className="badge badge--primary">
              Meta: ${props.currentSavings} / ${props.savingsGoal}
            </span>
          )}
          <button
            onClick={load}
            className="btn btn--ghost"
            disabled={loading}
            aria-label="Refrescar consejos"
          >
            ⟳ Refrescar
          </button>
        </div>
      </div>

      <div className="mission-panel">
        {loading && (
          <div className="text-xs opacity-70">Generando recomendaciones…</div>
        )}

        {!loading && (!tips || tips.length === 0) && (
          <div className="text-xs opacity-70">
            No hay recomendaciones por ahora. ¡Probá actualizar!
          </div>
        )}

        {!loading && tips && tips.length > 0 && (
          <ul className="grid md:grid-cols-2 gap-3">
            {tips.map((t, i) => (
              <li key={i} className="p-3 rounded border border-[var(--grid)] bg-[var(--color-card)]">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium">{t.title}</div>
                  <span
                    className={
                      t.impact === "high"
                        ? "badge badge--danger"
                        : t.impact === "medium"
                        ? "badge badge--warning"
                        : "badge badge--success"
                    }
                  >
                    {t.impact === "high" ? "Alto" : t.impact === "medium" ? "Medio" : "Bajo"}
                  </span>
                </div>
                {t.category && (
                  <div className="text-[10px] opacity-60 mb-1">Categoría: {t.category}</div>
                )}
                <p className="text-sm">{t.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
