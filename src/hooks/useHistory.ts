"use client";
import { useState, useEffect, useCallback } from "react";

export interface Expense {
  _id: string;
  userId: string;
  amount: number;
  category: string;
  description?: string;
  createdAt: string;
}

export const useHistory = () => {
  const [history, setHistory] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = localStorage.getItem("userid");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        setError("Usuario no autenticado");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/expenses/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Respuesta del backend:", res.status, text);
        throw new Error("Error al obtener el historial de gastos");
      }

      const data = (await res.json()) as Expense[];
      // 🔹 Ordenar por fecha de creación
      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setHistory(sorted);
    } catch (err: unknown) {
      console.error("⚠️ Error al cargar historial:", err);
      if (err instanceof Error) setError(err.message)
      else setError(String(err))
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, loading, error, refetch: fetchHistory };
};
