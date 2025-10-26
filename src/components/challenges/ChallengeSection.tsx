"use client";
import { useEffect } from "react";
import { useChallenge } from "@/hooks/useChallenge";
import { ChallengeCard } from "./ChallengeCard";
import { Trophy, Target } from "lucide-react";
import { Badge } from "./Badge";

export function ChallengeSection() {
  const { challenges, fetchChallenges, loading, error } = useChallenge();

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  if (loading && challenges.length === 0)
    return <p className="text-center text-white">Cargando desafíos...</p>;

  if (error) return <p className="text-center text-red-500">{error.message}</p>;

  // ignoramos status del backend, y determinamos el progreso localmente
  const active = challenges.filter(
    (c) => (c.count ?? 0) < (c.target ?? 1)
  );
  const completed = challenges.filter(
    (c) => (c.count ?? 0) >= (c.target ?? 1)
  );

  return (
    <div className="space-y-6 px-2 md:px-4 py-4">
      {/* 🔹 ACTIVAS */}
      <div className="flex items-center justify-between">
        <h2 className="text-blue-400 flex items-center gap-2 text-sm md:text-base">
          <Target className="h-5 w-5" />
          MISIONES ACTIVAS
        </h2>
        <Badge color="bg-blue-500">{active.length} EN PROGRESO</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {active.map((c) => (
          <ChallengeCard key={c._id} challenge={c} />
        ))}
      </div>

      {/* 🔹 COMPLETADAS */}
      {completed.length > 0 && (
        <>
          <div className="flex items-center justify-between mt-8">
            <h2 className="text-green-400 flex items-center gap-2 text-sm md:text-base">
              <Trophy className="h-5 w-5" />
              MISIONES COMPLETAS
            </h2>
            <Badge color="bg-green-600">{completed.length} COMPLETAS</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completed.map((c) => (
              <ChallengeCard key={c._id} challenge={c} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
