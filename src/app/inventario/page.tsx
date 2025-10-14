"use client";
import { useGame } from "@/lib/game-store";

export default function InventarioPage(){
  const { inventario, usar, player } = useGame();
  return (
    <div className="space-y-4">
      <h1 className="text-xl">🎒 Inventario</h1>
      <div className="card p-3">
        <p className="text-sm">Arma equipada: {player.arma ? `${player.arma.icon} ${player.arma.nombre}` : "—"}</p>
      </div>

      {inventario.length===0 ? (
        <p className="text-sm text-[var(--text-secondary)]">No tenés items. Comprá algo en la Tienda.</p>
      ):(
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {inventario.map(it=>(
            <div key={it.id} className="card p-4">
              <div className="flex items-center justify-between">
                <div className="text-lg">{it.icon} {it.nombre}</div>
                <span className="badge">{it.rareza.toUpperCase()}</span>
              </div>
              <p className="mt-2 text-xs text-[var(--text-secondary)]">{it.descripcion}</p>
              <div className="mt-3 flex justify-end">
                <button className="btn" onClick={()=>usar(it.id)}>
                  {it.tipo==="pocion" ? "Usar" : "Equipar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
