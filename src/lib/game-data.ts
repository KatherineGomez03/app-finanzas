import { Item, Boss } from "./game-types";

export const SHOP_ITEMS: Item[] = [
  { id:"sword_diamond", nombre:"Espada de Diamante", tipo:"arma", rareza:"epico", precio:250, ataque:25, descripcion:"+25 ATK", icon:"🗡️" },
  { id:"potion_hp", nombre:"Poción de Vida", tipo:"pocion", rareza:"raro", precio:120, cura:40, descripcion:"Cura 40 HP", icon:"🧪" },
  { id:"potion_poison", nombre:"Poción de Veneno", tipo:"pocion", rareza:"raro", precio:150, veneno:35, descripcion:"Daño 35 al jefe", icon:"☠️" },
];

export const BOSSES: Boss[] = [
  { id:"zombie", nombre:"Zombie", vida:120, ataque:8, icon:"🧟" },
  { id:"dragon", nombre:"Dragón", vida:180, ataque:14, icon:"🐉" },
  { id:"bruja",  nombre:"Bruja",  vida:150, ataque:12, icon:"🧙‍♀️" },
];


export function coinsFromExpense(monto:number){ return Math.min(100, Math.round(monto*0.10)); }
