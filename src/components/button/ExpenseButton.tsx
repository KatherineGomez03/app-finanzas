"use client";

import { useState } from "react";
import { Plus, Wallet } from "lucide-react";

type ExpensePayload = {
  description: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
};

export default function ExpenseButton({
  onSubmit,
}: {
  onSubmit: (data: ExpensePayload) => void;
}) {
  const [open, setOpen] = useState(false);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  const handleSubmit = () => {
    if (!description.trim() || amount === "" || !category || !date) return;
    onSubmit({
      description: description.trim(),
      amount: Number(amount),
      category,
      date,
    });
    setOpen(false);
    setDescription("");
    setAmount("");
    setCategory("");
    setDate(new Date().toISOString().slice(0, 10));
  };

  return (
    <>
      {/* BOTÓN TRIGGER PIXEL-ART */}
      <div className="flex justify-center sm:justify-end items-start">
  <button
    onClick={() => setOpen(true)}
    data-active={open}  // ← para pintar como activo cuando el modal está abierto
    className={[
      // mismo “chip” que los tabs
      "h-8 px-3 py-1 text-xs font-medium leading-none",
      "inline-flex items-center gap-2 rounded-none",
      "border border-[var(--grid)] bg-[var(--surface)] text-[var(--text-primary)]",
      // efectos
      "hover:bg-[var(--color-card)] transition-colors duration-150",
      // estado activo igual al tab seleccionado
      "data-[active=true]:bg-[var(--mission-primary)] data-[active=true]:text-black data-[active=true]:border-white"
    ].join(" ")}
  >
    <Plus className="h-3 w-3 -mt-px" />
    Registrar Gasto
  </button>
</div>


      {/* MODAL SIMPLE (sin librerías) */}
      {open && (
        <div
          className="
            fixed inset-0 z-50 flex items-center justify-center
            bg-black/60
          "
          role="dialog"
          aria-modal="true"
        >
          <div
            className="
              w-[92vw] max-w-md
              bg-[#0E1424] text-white border border-[#6C7EFF]
              rounded-none p-4
              font-['PressStart2P',monospace] tracking-wide
              text-[10px]
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[12px]">
                <Wallet className="h-4 w-4 text-[#6C7EFF]" />
                <span>Nuevo Gasto</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="border border-white px-2 py-1 hover:bg-[#6C7EFF] rounded-none"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="space-y-3 pt-4">
              <div className="space-y-1">
                <label htmlFor="desc" className="block">
                  Descripción
                </label>
                <input
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ej: Compra en supermercado"
                  className="
                    w-full bg-[#1C2138] text-white
                    border border-[#6C7EFF] px-3 py-2
                    rounded-none outline-none
                    placeholder:opacity-60
                  "
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="amount" className="block">
                  Monto
                </label>
                <input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) =>
                    setAmount(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  placeholder="0.00"
                  className="
                    w-full bg-[#1C2138] text-white
                    border border-[#6C7EFF] px-3 py-2
                    rounded-none outline-none
                  "
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="date" className="block">
                  Fecha
                </label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="
                    w-full bg-[#1C2138] text-white
                    border border-[#6C7EFF] px-3 py-2
                    rounded-none outline-none
                  "
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="category" className="block">
                  Categoría
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="
                    w-full bg-[#1C2138] text-white
                    border border-[#6C7EFF] px-3 py-2
                    rounded-none outline-none
                  "
                >
                  <option value="" disabled>
                    Selecciona una categoría
                  </option>
                  <option value="alimentacion">Alimentación</option>
                  <option value="transporte">Transporte</option>
                  <option value="entretenimiento">Entretenimiento</option>
                  <option value="servicios">Servicios</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              {/* Footer */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setOpen(false)}
                  className="
                    flex-1 bg-transparent text-white border border-white
                    font-['PressStart2P',monospace] text-[10px]
                    px-3 py-2 rounded-none hover:bg-[#6C7EFF]
                  "
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  className="
                    flex-1 bg-[#6C7EFF] text-white border border-white
                    font-['PressStart2P',monospace] text-[10px]
                    px-3 py-2 rounded-none hover:bg-[#5A6BE0]
                  "
                >
                  Registrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
