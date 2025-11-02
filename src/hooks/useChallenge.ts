"use client";
import { useState, useCallback, useEffect } from "react";

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
  status?: "active" | "completed";
  progress?: {
    count: number;
    target: number;
    completed: boolean;
    status: string;
  };
}

export function useChallenge() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

  const getHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token no encontrado");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, []);

  const fetchChallenges = useCallback(async () => {
    try {
      setLoading(true);
      const headers = getHeaders();

      const res = await fetch(`${baseUrl}/challenges`, {
        headers,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al obtener desafíos");
      }

      const data = await res.json();
      setChallenges(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(new Error(errorMessage));
      return [];
    } finally {
      setLoading(false);
    }
  }, [baseUrl, getHeaders]);

  const initializeChallenges = useCallback(async () => {
    try {
      setLoading(true);
      const headers = getHeaders();

      const res = await fetch(`${baseUrl}/challenges/init`, {
        method: "POST",
        headers,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al inicializar desafíos");
      }

      const data = await res.json();
      setChallenges(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(new Error(errorMessage));
      return [];
    } finally {
      setLoading(false);
    }
  }, [baseUrl, getHeaders]);

  const incrementChallenge = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const headers = getHeaders();

      const res = await fetch(`${baseUrl}/challenges/${id}/increment`, {
        method: "PUT",
        headers,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al actualizar progreso");
      }

      const data = await res.json();
      setChallenges(prev => 
        prev.map(challenge => 
          challenge._id === id ? { ...challenge, ...data } : challenge
        )
      );
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(new Error(errorMessage));
      return null;
    } finally {
      setLoading(false);
    }
  }, [baseUrl, getHeaders]);

  const completeChallenge = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const headers = getHeaders();

      const res = await fetch(`${baseUrl}/challenges/${id}/complete`, {
        method: "PUT",
        headers,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al completar desafío");
      }

      const data = await res.json();
      setChallenges(prev => 
        prev.map(challenge => 
          challenge._id === id ? { ...challenge, status: "completed" } : challenge
        )
      );
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(new Error(errorMessage));
      return null;
    } finally {
      setLoading(false);
    }
  }, [baseUrl, getHeaders]);

  useEffect(() => {
    const init = async () => {
      const challenges = await fetchChallenges();
      if (challenges.length === 0) {
        await initializeChallenges();
      }
    };
    init();
  }, [fetchChallenges, initializeChallenges]);

  return {
    challenges,
    loading,
    error,
    fetchChallenges,
    incrementChallenge,
    completeChallenge,
    initializeChallenges
  };
}
