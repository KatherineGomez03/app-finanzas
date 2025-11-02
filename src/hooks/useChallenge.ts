"use client";
import { useState, useCallback } from "react";

export interface Challenge {
  _id: string;
  name: string;
  description: string;
  target: number;
  reward: { coins: number; item: string };
  progress: { count: number; completed: boolean; status: string };
}

export function useChallenge() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // ✅ URL base segura para Vercel
  const baseURL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://app-finanza-back.onrender.com";

  // ✅ Evita errores en SSR (localStorage no existe en el servidor)
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) throw new Error("No token found");

      const res = await fetch(`${baseURL}/challenges`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al obtener desafíos");
      const data: Challenge[] = await res.json();
      setChallenges(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [baseURL]);

  const initChallenges = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token found");

      const res = await fetch(`${baseURL}/challenges/init`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al inicializar desafíos");
      await fetchChallenges();
    } catch (err) {
      console.error("❌ Error al inicializar desafíos:", err);
    }
  }, [fetchChallenges, baseURL]);

  const incrementChallenge = useCallback(
    async (id: string) => {
      try {
        const token = getToken();
        if (!token) throw new Error("No token found");

        const res = await fetch(`${baseURL}/challenges/${id}/increment`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Error incrementando desafío");
        await fetchChallenges();
      } catch (err) {
        console.error("❌ Error incrementando desafío:", err);
      }
    },
    [baseURL, fetchChallenges]
  );

  return {
    challenges,
    loading,
    error,
    fetchChallenges,
    initChallenges,
    incrementChallenge,
  };
}
