export type InvKey = "potsVida" | "potsVeneno" | "antidoto" | "fuga" | "bomba";

export type Inventory = Record<InvKey, number>;

export const initialInventory: Inventory = {
  potsVida: 2,
  potsVeneno: 1,
  antidoto: 0,
  fuga: 0,
  bomba: 0,
};

export function clamp(n: number, min = 0, max = 999) {
  return Math.max(min, Math.min(max, n));
}
