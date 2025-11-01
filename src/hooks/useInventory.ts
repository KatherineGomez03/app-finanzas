import { useCallback, useEffect, useMemo, useState } from "react";

export type InvKey = "pocion_vida" | "pocion_veneno" | "antidoto";

export type InventoryCounts = {
  pocion_vida: number;
  pocion_veneno: number;
  antidoto: number;
};

type ApiInventoryDoc = {
  userId: string;
  items: { itemKey: InvKey; qty: number }[];
};

type Delta = Partial<Record<InvKey, number>>;

export function useInventory() {
  const [counts, setCounts] = useState<InventoryCounts | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";
  const userId = typeof window !== "undefined" ? localStorage.getItem("userid") ?? "" : "";

  const backend = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001";

  const mapToCounts = useCallback((doc: ApiInventoryDoc): InventoryCounts => {
    // arr -> objeto fijo con 0s
    const base: InventoryCounts = { pocion_vida: 0, pocion_veneno: 0, antidoto: 0 };
    for (const it of doc.items) {
      base[it.itemKey] = it.qty;
    }
    return base;
  }, []);

  const fetchInventory = useCallback(async () => {
    if (!userId || !token) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${backend}/api/inventory?userId=${encodeURIComponent(userId)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await res.json()) as { doc: ApiInventoryDoc } | ApiInventoryDoc;
      const doc = "doc" in data ? data.doc : data;
      setCounts(mapToCounts(doc));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [backend, mapToCounts, token, userId]);

  useEffect(() => {
    void fetchInventory();
  }, [fetchInventory]);

  const qty = useCallback(
    (key: InvKey): number => {
      if (!counts) return 0;
      return counts[key] ?? 0;
    },
    [counts]
  );

  const applyDelta = useCallback(
    async (delta: Delta): Promise<void> => {
      if (!userId || !token) return;
      // Optimistic update
      setCounts((prev) => {
        const cur = prev ?? { pocion_vida: 0, pocion_veneno: 0, antidoto: 0 };
        const next: InventoryCounts = {
          pocion_vida: cur.pocion_vida + (delta.pocion_vida ?? 0),
          pocion_veneno: cur.pocion_veneno + (delta.pocion_veneno ?? 0),
          antidoto: cur.antidoto + (delta.antidoto ?? 0),
        };
        return next;
      });

      try {
        await fetch(`${backend}/api/inventory?userId=${encodeURIComponent(userId)}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            changes: [
              { itemKey: "pocion_vida", qty: delta.pocion_vida ?? 0 },
              { itemKey: "pocion_veneno", qty: delta.pocion_veneno ?? 0 },
              { itemKey: "antidoto", qty: delta.antidoto ?? 0 },
            ],
          }),
        });
      } catch (e) {
        // si falla, re-sync del server
        await fetchInventory();
        throw e;
      }
    },
    [backend, token, userId, fetchInventory]
  );

  return {
    loading,
    error,
    counts,
    qty,
    applyDelta,
  };
}
