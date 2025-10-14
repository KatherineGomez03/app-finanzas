export type Rarity = "comun" | "raro" | "epico" | "legendario";

type BaseItem = {
  id: string;
  nombre: string;
  rareza: Rarity;
  precio: number;
  descripcion?: string;
  icon?: string;
};

export type ItemWeapon = BaseItem & { tipo: "arma"; ataque: number };
export type ItemPotionHP = BaseItem & { tipo: "pocion"; cura: number };
export type ItemPotionPoison = BaseItem & { tipo: "pocion"; veneno: number };

export type Item = ItemWeapon | ItemPotionHP | ItemPotionPoison;

export type Boss = { id: string; nombre: string; vida: number; ataque: number; icon?: string };
