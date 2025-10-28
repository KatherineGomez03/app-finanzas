"use client";
import {
  Wallet,
  Calendar,
  ShoppingBag,
  Utensils,
  Car,
  Gamepad2,
  Wrench,
  BookOpen,
  ShoppingCart,
} from "lucide-react";
import { useEffect } from "react";
import { useHistory } from "@/hooks/useHistory";
import HistoryButton from "../button/HistoryButton";

const categoryIcons: Record<string, any> = {
  alimentacion: Utensils,
  transporte: Car,
  entretenimiento: Gamepad2,
  servicios: Wrench,
  educacion: BookOpen,
  compras: ShoppingCart,
};

const categoryMap: Record<string, { color: string; label: string }> = {
  alimentacion: { color: "category-alimentacion", label: "Alimentación" },
  transporte: { color: "category-transporte", label: "Transporte" },
  entretenimiento: {
    color: "category-entretenimiento",
    label: "Entretenimiento",
  },
  servicios: { color: "category-servicios", label: "Servicios" },
  salud: { color: "category-servicios", label: "Salud" },
  educacion: { color: "category-otros", label: "Educación" },
  compras: { color: "category-otros", label: "Compras" },
};

const getCategoryInfo = (category: string) => {
  const cat = category?.toLowerCase?.() ?? "";
  return categoryMap[cat] || { color: "category-otros", label: "Otros" };
};

export default function ExpenseHistory() {
  const { history, loading, error, refetch } = useHistory();

  useEffect(() => {
    refetch?.();
  }, [refetch]);

  if (loading)
    return <p className="text-center text-white mt-8">⏳ Cargando historial...</p>;

  if (error)
    return (
      <p className="text-center text-red-400 mt-8">
        ⚠️ Error al cargar gastos: {error}
      </p>
    );

  if (!history || history.length === 0) {
    return (
      <section className="w-full p-4">
        <h2 className="text-mission-primary flex items-center gap-2 text-sm md:text-base mb-6 font-retro">
          <Wallet className="h-5 w-5" />
          HISTORIAL
        </h2>
        <div className="border-2 border-[var(--mission-primary)] bg-[var(--color-card)] p-8 text-center text-white/80 rounded-md shadow-[3px_3px_0_#000]">
          <ShoppingBag className="mx-auto mb-2 text-[var(--mission-primary)] h-6 w-6" />
          No hay gastos registrados aún.
        </div>
      </section>
    );
  }

  return (
    <section className="w-full mx-auto p-4 text-white font-['PressStart2P'] text-[10px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-mission-primary flex items-center gap-2 text-sm md:text-base font-retro tracking-wide">
          <Wallet className="h-5 w-5" />
          HISTORIAL
        </h2>
        <HistoryButton />
      </div>

      <div className="w-full flex flex-col items-center gap-4">
        {history.map((e: any) => {
          const { color, label } = getCategoryInfo(e.category);
          const Icon = categoryIcons[e.category?.toLowerCase()] || Wallet;

          return (
            <div
              key={e._id}
              className={`relative flex gap-3 border-2 border-[var(--mission-primary)] bg-[var(--color-card)]
                rounded-md shadow-[3px_3px_0_#000] hover:shadow-[3px_3px_0_var(--mission-primary)]
                transition-all duration-150 p-5 group
                w-[95%] sm:w-[85%] md:w-[70%] lg:w-[60%] xl:w-[50%]`}
            >
              {/* 🔹 Icono lateral */}
              <div
                className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-sm border ${color}
                  border-[var(--grid)] bg-[var(--color-navy)] shadow-[1px_1px_0_#000]`}
              >
                <Icon className="h-5 w-5 text-black" />
              </div>

              {/* 🔹 Contenido principal */}
              <div className="flex flex-col flex-1">
                {/* Descripción principal */}
                <p className="text-white text-[11px] mb-2 leading-snug break-words">
                  {e.description || "Sin descripción"}
                </p>

                {/* Categoría + Fecha + Monto */}
                <div className="flex flex-wrap sm:flex-nowrap justify-between sm:items-center gap-2 sm:gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-[8px]">
                    <span
                      className={`uppercase tracking-wide ${color} px-2 py-[2px] rounded-sm text-black`}
                    >
                      {label}
                    </span>

                    <span className="flex items-center gap-1 text-white/60 whitespace-nowrap">
                      <Calendar className="h-3 w-3" />
                      {new Date(e.createdAt).toLocaleDateString("es-AR")}
                    </span>
                  </div>

                  <span className="text-yellow-400 text-[11px] font-bold drop-shadow-[1px_1px_0_#000] whitespace-nowrap ml-auto sm:ml-0">
                    ${Number(e.amount).toLocaleString("es-AR")}
                  </span>
                </div>
              </div>

              {/* 🔹 Glow al hover */}
              <div className="absolute inset-0 border border-transparent rounded-md group-hover:border-[var(--mission-primary)] group-hover:shadow-[0_0_8px_var(--mission-primary)] transition-all duration-200 pointer-events-none"></div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
