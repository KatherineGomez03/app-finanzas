"use client";
import { useGame } from "@/lib/game-store";

export default function TiendaPage(){
  const { itemsShop, comprar, player } = useGame();

  return (
    <div className="space-y-4">
      <h1 className="text-xl">🛒 Tienda del Aventurero</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {itemsShop.map(it=>(
          <div key={it.id} className="card p-4">
            <div className="flex items-center justify-between">
              <div className="text-lg">{it.icon} {it.nombre}</div>
              <span className="badge">{it.rareza.toUpperCase()}</span>
            </div>
            <p className="mt-2 text-xs text-[var(--text-secondary)]">{it.descripcion}</p>
            <div className="mt-3 flex items-center justify-between">
              <span>💰 {it.precio}</span>
              <button
                className="btn btn-primary disabled:opacity-50"
                disabled={player.monedas < it.precio}
                onClick={()=>comprar(it.id)}
              >Comprar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
