"use client";
import { useState, useEffect } from "react";

export interface Expense {
  _id: string;
  userId: string;
  amount: number;
  category: string;
  description?: string;
  type: string;
  createdAt: string;
}

export const useExpenses = (userId?: string, token?: string) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    if (!userId || !token) return; // 🔒 evita llamadas vacías

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/expenses/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Error al obtener los gastos");

      const data = await res.json();
      setExpenses(data);
    } catch (err: any) {
      console.error("❌ Error al obtener los gastos:", err);
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Auto-ejecución cuando hay usuario y token
  useEffect(() => {
    if (userId && token) {
      fetchExpenses();
    }
  }, [userId, token]);

  return { expenses, loading, error, refetch: fetchExpenses };
};
