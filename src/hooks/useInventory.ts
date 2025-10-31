'use client';

import { useCallback, useEffect, useState } from 'react';

export type Qty = {
  pocion_vida: number;
  pocion_veneno: number;
  antidoto: number;
};

const EMPTY: Qty = { pocion_vida: 0, pocion_veneno: 0, antidoto: 0 };

/**
 * Lee el inventario del usuario desde las rutas /api/inventory 
 * y expone un applyDelta para descontar/añadir cantidades.
 * Si las rutas cambian  ajustá los fetch.
 */
export function useInventory() {
  const [qty, setQty] = useState<Qty>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const userId =
    typeof window !== 'undefined' ? localStorage.getItem('userid') : null;

  const load = useCallback(async () => {
    if (!userId) {
      setQty(EMPTY);
      return;
    }
    setLoading(true);
    try {
      // ↳ usa las rutas del front (route handler) que ya tenés
      const res = await fetch(`/api/inventory?userId=${encodeURIComponent(userId)}`);
      const data = await res.json();

      // Normalizo estructura: soporta { items: { sku: { qty }}} ó { sku: qty }
      const inv = data?.items ?? data ?? {};
      const next: Qty = {
        pocion_vida: inv['pocion_vida']?.qty ?? inv['pocion_vida'] ?? 0,
        pocion_veneno: inv['pocion_veneno']?.qty ?? inv['pocion_veneno'] ?? 0,
        antidoto: inv['antidoto']?.qty ?? inv['antidoto'] ?? 0,
      };
      setQty(next);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  /**
   * Aplica delta y actualiza
   * Ej: applyDelta({ pocion_vida: -1 })
   */
  const applyDelta = useCallback(
    async (delta: Partial<Qty>) => {
      if (!userId) return;
      try {
        await fetch(`/api/inventory?userId=${encodeURIComponent(userId)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(delta),
        });
        setQty(prev => ({
          pocion_vida: Math.max(0, prev.pocion_vida + (delta.pocion_vida ?? 0)),
          pocion_veneno: Math.max(
            0,
            prev.pocion_veneno + (delta.pocion_veneno ?? 0),
          ),
          antidoto: Math.max(0, prev.antidoto + (delta.antidoto ?? 0)),
        }));
      } catch {
        // si falla, nos quedamos como estábamos, el back será la fuente de verdad al recargar
      }
    },
    [userId],
  );

  return { qty, loading, error, applyDelta };
}
