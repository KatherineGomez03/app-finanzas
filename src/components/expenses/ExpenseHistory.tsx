"use client";
import { Wallet, Calendar, ShoppingBag, Book } from "lucide-react";
import { useEffect } from "react";
import { useHistory } from "@/hooks/useHistory";
import HistoryButton from "../button/HistoryButton";

const categoryMap: Record<string, { color: string; label: string }> = {
  alimentacion: { color: "category-alimentacion", label: "Alimentación" },
  food: { color: "category-alimentacion", label: "Alimentación" },

  transporte: { color: "category-transporte", label: "Transporte" },
  transport: { color: "category-transporte", label: "Transporte" },

  entretenimiento: {
    color: "category-entretenimiento",
    label: "Entretenimiento",
  },
  entertainment: {
    color: "category-entretenimiento",
    label: "Entretenimiento",
  },

  servicios: { color: "category-servicios", label: "Servicios" },
  utilities: { color: "category-servicios", label: "Servicios" },

  salud: { color: "category-servicios", label: "Salud" },
  health: { color: "category-servicios", label: "Salud" },

  educacion: { color: "category-otros", label: "Educación" },
  education: { color: "category-otros", label: "Educación" },

  compras: { color: "category-otros", label: "Compras" },
  shopping: { color: "category-otros", label: "Compras" },
};

const getCategoryInfo = (category: string) => {
  const cat = category?.toLowerCase?.() ?? "";
  return categoryMap[cat] || { color: "category-otros", label: "Otros" };
};

type ExpenseItem = {
  _id?: string;
  id?: string;
  category: string;
  amount: number | string;
  description?: string;
  date?: string;
  createdAt?: string;
};

export default function ExpenseHistory() {
  const { history, loading, error, refetch } = useHistory();

  useEffect(() => {
    refetch?.();
  }, [refetch]);

  if (loading)
    return <p className="text-center text-white mt-8">⏳ Cargando historial de gastos...</p>;
  if (error)
    return <p className="text-center text-red-400 mt-8">⚠️ Error al cargar gastos: {error}</p>;

  if (!history || history.length === 0) {
    return (
      <section className="w-full p-4">
        <h2 className="text-mission-primary flex items-center gap-2 text-xl mb-6 font-retro">
          <Wallet className="h-6 w-6" />
          HISTORIAL
        </h2>

        <div className="border-2 border-[var(--mission-primary)] bg-[var(--color-card)] p-8 text-center text-white/80 rounded-md shadow-[3px_3px_0_#000]">
          <ShoppingBag className="mx-auto mb-2 text-[var(--mission-primary)] h-8 w-8" />
          No hay gastos registrados aún.
        </div>
      </section>
    );
  }

  return (
    <section className="w-full mx-auto p-4 text-white font-['PressStart2P'] text-[13px] tracking-tight">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-mission-primary flex items-center gap-3 text-2xl font-retro">
          <Wallet className="h-7 w-7" /> HISTORIAL
        </h2>
        <HistoryButton />
      </div>

      <div className="w-full flex flex-col items-center gap-6">
        {history.map((e: ExpenseItem) => {
          const { color, label } = getCategoryInfo(e.category);
          const dateStr = e.date ?? e.createdAt ?? null;

          return (
            <div
              key={e._id || e.id}
              className={`relative border-2 border-[var(--mission-primary)] bg-[var(--color-card)]
                rounded-lg shadow-[3px_3px_0_#000] hover:shadow-[4px_4px_0_var(--mission-primary)]
                transition-all duration-150 px-6 py-5 flex flex-col w-[90%] sm:w-[70%] md:w-[60%] lg:w-[50%]`}
            >
              <div className={`h-2 mb-3 w-full rounded-sm ${color}`}></div>

              <div className="flex flex-wrap justify-between items-center mb-3 gap-2">
                <h3 className="text-[15px] text-white font-bold leading-snug break-words flex-1">
                  {e.description || "Sin descripción"}
                </h3>
                <span className="text-yellow-400 text-[16px] font-bold drop-shadow-[1px_1px_0_#000] whitespace-nowrap">
                  ${Number(e.amount).toLocaleString("es-AR")}
                </span>
              </div>

              <div className="flex flex-wrap justify-between items-center gap-2 text-[12px] text-white/70">
                <span className={`uppercase ${color} px-2 py-[2px] rounded-sm text-black`}>
                  {label}
                </span>
                <span className="flex items-center gap-1 text-white/60 whitespace-nowrap">
                  <Calendar className="h-4 w-4" />
                  {dateStr ? new Date((dateStr.split("T")[0] + "T00:00:00")).toLocaleDateString("es-AR") : "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}