"use client";
import { createContext, useContext, useMemo, useState } from "react";
import { Item, ItemWeapon } from "./game-types";
import { SHOP_ITEMS } from "./game-data";

type Player = {
  vida: number;
  vidaMax: number;
  ataque: number;
  monedas: number;
  xp: number;
  nivel: number;
  arma?: ItemWeapon; // ← arma SIEMPRE es un ItemWeapon
};

type GameCtx = {
  player: Player;
  inventario: Item[];
  registrarGasto: (monto: number) => void;
  comprar: (id: string) => boolean;
  usar: (id: string) => void;
  itemsShop: Item[];
};

const Ctx = createContext<GameCtx>(null as any);
export const useGame = () => useContext(Ctx);

export default function GameProvider({ children }: { children: React.ReactNode }) {
  const [player, setPlayer] = useState<Player>({
    vida: 120,
    vidaMax: 120,
    ataque: 10,
    monedas: 300,
    xp: 0,
    nivel: 1,
  });
  const [inventario, setInventario] = useState<Item[]>([]);
  const itemsShop = useMemo(() => SHOP_ITEMS, []);

  function registrarGasto(monto: number) {
    const win = Math.min(100, Math.round(monto * 0.1));
    setPlayer((p) => ({ ...p, monedas: p.monedas + win, xp: p.xp + 5 }));
  }

  function comprar(id: string) {
    const item = itemsShop.find((i) => i.id === id);
    if (!item) return false;
    if (player.monedas < item.precio) return false;
    setPlayer((p) => ({ ...p, monedas: p.monedas - item.precio }));
    setInventario((prev) => [item, ...prev]);
    return true;
  }

  function usar(id: string) {
    const it = inventario.find((i) => i.id === id);
    if (!it) return;

    // Poción de vida
    if (it.tipo === "pocion" && "cura" in it) {
      setPlayer((p) => ({ ...p, vida: Math.min(p.vidaMax, p.vida + it.cura) }));
      setInventario((prev) => prev.filter((x) => x.id !== it.id));
      return;
    }

    // Poción de veneno (se consumirá y el daño se aplica en la Arena)
    if (it.tipo === "pocion" && "veneno" in it) {
      setInventario((prev) => prev.filter((x) => x.id !== it.id));
      return;
    }

    if (it.tipo === "arma") {
      setPlayer((p) => {
        const prevAtk = p.arma?.ataque ?? 0; // ahora arma es ItemWeapon
        return { ...p, ataque: p.ataque - prevAtk + it.ataque, arma: it };
      });
      return;
    }
  }

  return (
    <Ctx.Provider value={{ player, inventario, registrarGasto, comprar, usar, itemsShop }}>
      {children}
    </Ctx.Provider>
  );
}
