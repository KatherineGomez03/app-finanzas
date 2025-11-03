"use client";
import { useState, useCallback, useEffect } from "react";
import { useUserUpdate } from "@/context/UserUpdateContext";
import { useUploadExperience } from "@/hooks/useUploadExperience";

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
  const { triggerUpdate } = useUserUpdate();
  const { uploadExperience } = useUploadExperience();

  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

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

  const incrementChallenge = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        const headers = getHeaders();

        // Primero actualizamos optimistamente
        setChallenges((prev) => {
          return prev.map((challenge) => {
            if (challenge._id !== id) return challenge;

            const currentCount = challenge.progress?.count ?? challenge.count;
            const targetCount = challenge.progress?.target ?? challenge.target;
            const newCount = Math.min(currentCount + 1, targetCount);
            const isComplete = newCount >= targetCount;

            return {
              ...challenge,
              count: newCount,
              progress: {
                ...(challenge.progress || {}),
                count: newCount,
                target: targetCount,
                completed: isComplete,
                status: isComplete ? "completed" : "in-progress",
              },
              status: isComplete ? "completed" : challenge.status,
            };
          });
        });

        // Luego hacemos la llamada a la API
        const res = await fetch(`${baseUrl}/challenges/${id}/increment`, {
          method: "PUT",
          headers,
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Error al actualizar progreso");
        }

        const data = await res.json();

        // Actualizamos con la respuesta del servidor
        const processedData = {
          ...data,
          progress: {
            count: data.progress?.count ?? data.count,
            target: data.progress?.target ?? data.target,
            completed: data.progress?.completed ?? data.count >= data.target,
            status:
              data.progress?.status ??
              (data.count >= data.target ? "completed" : "in-progress"),
          },
          status:
            data.status ?? (data.count >= data.target ? "completed" : "active"),
        };

        const isNowCompleted =
          processedData.progress.count >= processedData.progress.target;

        if (isNowCompleted) {
          processedData.progress.completed = true;
          processedData.progress.status = "completed";
          processedData.status = "completed";

          // Trigger user update when challenge is completed
          triggerUpdate();
          try {
            const experienceGain = 50;
            await uploadExperience(experienceGain);
            console.log(`🎯 +${experienceGain}% de experiencia otorgada`);
          } catch (expErr) {
            console.error("⚠️ Error al subir experiencia:", expErr);
          }
        }

        // Actualizamos el estado con la respuesta del servidor
        setChallenges((prev) =>
          prev.map((challenge) =>
            challenge._id === id ? processedData : challenge
          )
        );

        return processedData;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(new Error(errorMessage));
        // Revertir el cambio optimista si hay error
        fetchChallenges();
        return null;
      } finally {
        setLoading(false);
      }
    },
    [baseUrl, getHeaders, fetchChallenges]
  );

  const completeChallenge = useCallback(
    async (id: string) => {
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

        // Actualizamos el estado del desafío localmente con los datos del servidor
        const updatedChallenge = {
          ...data,
          status: "completed",
          progress: {
            ...data.progress,
            completed: true,
            status: "completed",
          },
        };

        setChallenges((prev) =>
          prev.map((challenge) =>
            challenge._id === id ? updatedChallenge : challenge
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
    },
    [baseUrl, getHeaders]
  );

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
    initializeChallenges,
  };
}
