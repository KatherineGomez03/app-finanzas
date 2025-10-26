"use client";
import { useEffect, useState } from "react";
import { Wallet, Calendar, ShoppingBag } from "lucide-react";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

const categoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "alimentacion":
    case "food":
      return "category-alimentacion";
    case "transporte":
    case "transport":
      return "category-transporte";
    case "entretenimiento":
    case "entertainment":
      return "category-entretenimiento";
    case "servicios":
    case "utilities":
      return "category-servicios";
    default:
      return "category-otros";
  }
};

export default function ExpenseHistory() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const loadExpenses = () => {
    const stored = JSON.parse(localStorage.getItem("expenses") || "[]");
    setExpenses(stored.reverse());
  };

  useEffect(() => {
    loadExpenses();
    const interval = setInterval(() => {
      const lastUpdate = localStorage.getItem("lastExpenseUpdate");
      if (lastUpdate) loadExpenses();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full max-w-3xl mx-auto p-4 text-white font-['PressStart2P'] text-[10px] tracking-tight">
      <div className="flex justify-center items-center gap-2 mb-6">
        <Wallet className="text-[var(--mission-primary)] h-5 w-5" />
        <h2 className="text-[var(--mission-primary)] text-base drop-shadow-[1px_1px_0_#000]">
          HISTORIAL DE GASTOS
        </h2>
      </div>

      {expenses.length === 0 ? (
        <div className="border-2 border-[var(--mission-primary)] bg-[var(--color-card)] p-8 text-center text-white/80 shadow-[2px_2px_0_#000]">
          <ShoppingBag className="mx-auto mb-2 text-[var(--mission-primary)] h-6 w-6" />
          No hay gastos registrados aún.
        </div>
      ) : (
        <div className="grid gap-4">
          {expenses.map((e) => (
            <div
              key={e.id}
              className={`relative border-2 border-[var(--grid)] bg-[var(--color-card)] 
                rounded-sm shadow-[2px_2px_0_#000] hover:shadow-[3px_3px_0_#6C7EFF] 
                transition-all duration-150 p-3 flex flex-col`}
            >
              <div
                className={`h-2 mb-2 w-full rounded-sm ${categoryColor(e.category)}`}
              ></div>

              <div className="flex justify-between items-center mb-2">
                <span className="text-[var(--mission-primary)] text-[9px] uppercase">
                  {e.category}
                </span>
                <span className="text-yellow-400 text-[11px] font-bold">
                  ${e.amount.toLocaleString("es-AR")}
                </span>
              </div>

              <p className="text-white/90 text-[8px] leading-snug mb-2">
                {e.description || "Sin descripción"}
              </p>

              <div className="flex justify-between items-center text-[8px] text-white/50 mt-auto">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(e.date).toLocaleDateString("es-AR")}
                </span>
                <span className="text-white/30">#{e.id.slice(0, 6)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
