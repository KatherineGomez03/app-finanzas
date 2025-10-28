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
  createdAt: string;
  updatedAt: string;
}

export function useChallenge() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

  const getStorageKey = (userId: string) => `progress_${userId}`;

  // detecta usuario actual y cargar su progreso guardado
  useEffect(() => {
    const user = localStorage.getItem("userid");
    if (user && user !== currentUser) {
      console.log("👤 Usuario detectado:", user);
      setCurrentUser(user);

      // si hay progreso guardado, lo cargamos
      const saved = localStorage.getItem(getStorageKey(user));
      if (saved) {
        console.log("📦 Cargando progreso local de", user);
        setChallenges(JSON.parse(saved));
      } else {
        console.log("🆕 Nuevo usuario, sin progreso previo");
        setChallenges((prev) =>
          prev.map((c) => ({
            ...c,
            count: 0,
          }))
        );
      }
    }
  }, [currentUser]);

  // guardar progreso local cada vez que cambian los desafíos
  useEffect(() => {
    if (currentUser && challenges.length > 0) {
      localStorage.setItem(getStorageKey(currentUser), JSON.stringify(challenges));
    }
  }, [challenges, currentUser]);

  // obteniene misiones desde el back 
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
      const sanitized = data.map((c: any) => ({
        ...c,
        count: Number(c.count ?? 0),
        target: Number(c.target ?? 1),
      }));

      // si hay usuario actual, intentamos recuperar su progreso local
      const user = localStorage.getItem("userid");
      if (user) {
        const saved = localStorage.getItem(getStorageKey(user));
        if (saved) {
          console.log("🔁 Usando progreso local guardado para", user);
          setChallenges(JSON.parse(saved));
          return;
        }
      }

      console.log(" Sin progreso local — inicializando desafíos limpios");
      setChallenges(
  sanitized.map((c: any) => ({
    ...c,
    count: 0,
  }))
);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

 
  const incrementChallenge = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token no encontrado");

        await fetch(`${API_URL}/challenges/${id}/count`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        });

        // actualizamos localmente el progreso del usuario
        setChallenges((prev) =>
          prev.map((c) =>
            c._id === id
              ? { ...c, count: Math.min(c.count + 1, c.target) }
              : c
          )
        );
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  return { challenges, loading, error, fetchChallenges, incrementChallenge };
}
