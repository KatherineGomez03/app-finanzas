"use client";
import { useState } from "react";
import { useGame } from "@/lib/game-store";

type Tx = {
  id: number;
  fecha: string;
  categoria: string;
  descripcion: string;
  tipo: "gasto" | "ingreso";
  monto: number;
};

const CATS = ["Alimentación", "Transporte", "Entretenimiento", "Servicios", "Otros"];

export default function GastosPage() {
  const { registrarGasto } = useGame();

  const [items, setItems] = useState<Tx[]>([
    { id: 1, fecha: "2025-10-01", categoria: "Alimentación", descripcion: "Almuerzo", tipo: "gasto",  monto: 12000 },
    { id: 2, fecha: "2025-10-02", categoria: "Transporte",   descripcion: "SUBE",     tipo: "gasto",  monto: 3500  },
    { id: 3, fecha: "2025-10-03", categoria: "Sueldo",        descripcion: "Pago",     tipo: "ingreso",monto: 550000 },
  ]);

  const [open, setOpen] = useState(false);

  function onSave(fd: FormData) {
    const monto = Number(fd.get("monto") || 0);
    const tx: Tx = {
      id: Math.max(0, ...items.map(i => i.id)) + 1,
      fecha: new Date().toISOString().slice(0, 10),
      categoria: String(fd.get("categoria") || "Otros"),
      descripcion: String(fd.get("descripcion") || ""),
      tipo: "gasto",
      monto,
    };
    setItems(prev => [tx, ...prev]);
    registrarGasto(monto); // ← monedas (10%)
    setOpen(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl">Historial de Gastos</h1>
        <button
          onClick={() => setOpen(true)}
          className="px-3 py-2 rounded-lg text-xs"
          style={{ background:"var(--primary)", color:"#fff", border:"1px solid var(--grid)" }}
        >
          + REGISTRAR GASTO
        </button>
      </div>

      {/* tabla simple */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Categoría</th>
              <th className="p-3 text-left">Descripción</th>
              <th className="p-3 text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map(tx => (
              <tr key={tx.id}>
                <td className="p-3">{tx.fecha}</td>
                <td className="p-3">{tx.categoria}</td>
                <td className="p-3">{tx.descripcion}</td>
                <td className="p-3 text-right">${tx.monto.toLocaleString("es-AR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center p-4" onClick={() => setOpen(false)}>
          <div className="card w-full max-w-xl p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg">➕ NUEVO GASTO</h2>
              <button onClick={() => setOpen(false)} className="px-2 py-1 rounded border"
                      style={{ borderColor:"var(--grid)" }}>✕</button>
            </div>
            <form id="tx" action={(fd) => onSave(fd)} className="mt-3 grid gap-3">
              <label className="grid gap-1">
                <span className="text-xs opacity-70">Descripción</span>
                <input name="descripcion" placeholder="Ej: Compra en supermercado"
                       className="btn w-full" />
              </label>
              <label className="grid gap-1">
                <span className="text-xs opacity-70">Monto</span>
                <input name="monto" type="number" min="0" step="1" defaultValue={0}
                       className="btn w-full" />
              </label>
              <label className="grid gap-1">
                <span className="text-xs opacity-70">Categoría</span>
                <select name="categoria" className="btn w-full">
                  <option value="" hidden>SELECCIONA UNA CATEGORÍA</option>
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
            </form>
            <div className="mt-3 flex justify-end gap-2">
              <button className="btn" onClick={() => setOpen(false)}>CANCELAR</button>
              <button className="btn btn-primary" form="tx">REGISTRAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
