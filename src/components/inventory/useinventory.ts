"use client";

import { useState } from "react";
import type { Inventory, InvKey } from "./inventory";
import { initialInventory, clamp } from "./inventory";

export function useInventory() {
  const [inv, setInv] = useState<Inventory>(() => ({ ...initialInventory }));

  function inc(key: InvKey, by = 1) {
    setInv(prev => ({ ...prev, [key]: clamp(prev[key] + by) }));
  }
  function dec(key: InvKey, by = 1) {
    setInv(prev => ({ ...prev, [key]: clamp(prev[key] - by) }));
  }
  function reset() {
    setInv({ ...initialInventory });
  }

  return { inv, inc, dec, reset };
}