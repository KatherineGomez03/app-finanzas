'use client';

import { useEffect, useState, useCallback } from 'react';

type InvKey = 'pocion_vida' | 'pocion_veneno' | 'antidoto';

export type InventoryItem = {
  itemKey: InvKey;
  qty: number;
};

type InventoryDoc = {
  userId: string;
  items: InventoryItem[];
};

export function useInventory() {
  const [data, setData] = useState<InventoryDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const userId =
    typeof window !== 'undefined' ? localStorage.getItem('userid') : null;

  const fetchInv = useCallback(async () => {
    if (!token || !userId) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory?userId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || 'Error al cargar inventario');
      setData(json);
    } catch (e: any) {
      setErr(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }, [token, userId]);

  useEffect(() => {
    fetchInv();
  }, [fetchInv]);

  // helper: cantidad por clave
  const qty = useCallback(
    (k: InvKey) =>
      data?.items.find((it) => it.itemKey === k)?.qty ?? 0,
    [data]
  );

  // consumir / devolver (PUT) y refrescar
  const applyDelta = useCallback(
    async (deltas: Record<InvKey, number>) => {
      if (!token || !userId) return;
      const body = { userId, deltas }; // { pocion_vida: -1, ... }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inventory`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || 'No se pudo actualizar inventario');
      await fetchInv();
      return json;
    },
    [token, userId, fetchInv]
  );

  return { data, qty, loading, err, refresh: fetchInv, applyDelta };
}
