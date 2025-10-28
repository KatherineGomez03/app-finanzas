"use client";
import { Wallet, Calendar, ShoppingBag, Book } from "lucide-react";
import { useEffect } from "react";
import { useHistory } from "@/hooks/useHistory";
import HistoryButton from "../button/HistoryButton";

// 🔹 Mapa de categorías traducidas y coloreadas
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

// 🔹 Función auxiliar para obtener info de categoría
export const getCategoryInfo = (category: string) => {
  const cat = category?.toLowerCase?.() ?? "";
  return categoryMap[cat] || { color: "category-otros", label: "Otros" };
};

export default function ExpenseHistory() {
  // ✅ Hook real que obtiene el historial
  const { history, loading, error, refetch } = useHistory();

  // recargar si cambia algo
  useEffect(() => {
    refetch?.();
  }, [refetch]);

  // 🔹 Mostrar estados de carga o error
  if (loading)
    return (
      <p className="text-center text-white mt-8">
        ⏳ Cargando historial de gastos...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-400 mt-8">
        ⚠️ Error al cargar gastos: {error}
      </p>
    );

  // 🔹 Si no hay gastos
  if (!history || history.length === 0) {
    return (
      <section className="w-full p-4">

        <h2 className="text-mission-primary flex items-center gap-2 text-sm md:text-base mb-6 font-retro">
          <Wallet className="h-5 w-5" aria-hidden="true" />
          Historial
        </h2>


        <div className="border-2 border-[var(--mission-primary)] bg-[var(--color-card)] p-8 text-center text-white/80 shadow-[2px_2px_0_#000]">
          <ShoppingBag className="mx-auto mb-2 text-[var(--mission-primary)] h-6 w-6" />
          No hay gastos registrados aún.
        </div>
      </section>
    );
  }

  // 🔹 Si hay historial
  return (
    <section className="w-full mx-auto p-4 text-white font-['PressStart2P'] text-[10px] tracking-tight">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-mission-primary flex items-center gap-2 text-sm md:text-base font-retro">
          <Wallet className="h-5 w-5" aria-hidden="true" />
          HISTORIAL
        </h2>
        <HistoryButton />
      </div>



      <div className="w-full grid gap-4">
        {history.map((e: any) => {
          const { color, label } = getCategoryInfo(e.category);

          return (
            <div
              key={e._id || e.id}
              className={`relative border-2 border-[var(--grid)] bg-[var(--color-card)] 
                rounded-sm shadow-[2px_2px_0_#000] hover:shadow-[3px_3px_0_#6C7EFF] 
                transition-all duration-150 p-3 flex flex-col`}
            >
              {/* 🔹 Color de categoría */}
              <div className={`h-2 mb-2 w-full rounded-sm ${color}`}></div>

              {/* 🔹 Encabezado */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-[var(--mission-primary)] text-[9px] uppercase">
                  {label}
                </span>
                <span className="text-yellow-400 text-[11px] font-bold">
                  ${Number(e.amount).toLocaleString("es-AR")}
                </span>
              </div>

              {/* 🔹 Descripción */}
              <p className="text-white/90 text-[8px] leading-snug mb-2">
                {e.description || "Sin descripción"}
              </p>

              {/* 🔹 Fecha e ID */}
              <div className="flex justify-between items-center text-[8px] text-white/50 mt-auto">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(e.date || e.createdAt).toLocaleDateString("es-AR")}
                </span>
                <span className="text-white/30">
                  #{(e._id || e.id)?.slice(0, 6)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
