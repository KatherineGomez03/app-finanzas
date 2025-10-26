"use client";
import { useState, useCallback } from "react";

/* Tipo interno */
export interface Challenge {
  _id: string;
  name: string;
  description: string;
  count: number;
  target: number;
  reward: {
    coins: number;
    item: string;
  };
  status: "active" | "completed";
  createdAt: string;
  updatedAt: string;
}

/* Hook */
export function useChallenge() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

  // 🔹 Obtener todos los desafíos
  const fetchChallenges = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado");

      const res = await fetch(`${API_URL}/challenges`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al obtener desafíos");

      const data = await res.json();
      setChallenges(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // 🔹 Incrementar progreso individual
  const incrementChallenge = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token no encontrado");

        const res = await fetch(`${API_URL}/challenges/${id}/count`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Error al actualizar desafío");

        const updated = await res.json();
        setChallenges((prev) =>
          prev.map((c) => (c._id === id ? updated : c))
        );
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  // 🔹 Reiniciar TODOS los desafíos (nuevo)
  const resetAllChallenges = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado");

      const res = await fetch(`${API_URL}/challenges/reset`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al reiniciar desafíos");

      const data = await res.json();
      console.log("🔄", data.message);

      // Vuelve a cargar todos los desafíos actualizados
      await fetchChallenges();
    } catch (err) {
      console.error("❌ Error al reiniciar desafíos:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [API_URL, fetchChallenges]);

  // 🔹 Exportar funciones
  return {
    challenges,
    loading,
    error,
    fetchChallenges,
    incrementChallenge,
    resetAllChallenges, // 👈 nuevo export
  };
}
