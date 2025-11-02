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
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://app-finanza-back.onrender.com";

  const getToken = () => localStorage.getItem("token");

  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseURL}/challenges`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setChallenges(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [baseURL]);

  const initChallenges = useCallback(async () => {
    try {
      await fetch(`${baseURL}/challenges/init`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      await fetchChallenges();
    } catch (err) {
      console.error(err);
    }
  }, [fetchChallenges, baseURL]);

  const incrementChallenge = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`${baseURL}/challenges/${id}/increment`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error("Error incrementando desafío");
        await fetchChallenges();
      } catch (err) {
        console.error(err);
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
