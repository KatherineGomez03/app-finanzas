"use client";
import { useEffect } from "react";
import { Target } from "lucide-react";
import { Badge } from "./Badge";
import { ChallengeCard } from "./ChallengeCard";
import { useChallenge } from "@/hooks/useChallenge";

export function ChallengeSectionActive() {
  const { challenges, fetchChallenges, loading, error } = useChallenge();

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  if (loading && challenges.length === 0)
    return <p className="text-center text-white">Cargando misiones...</p>;

  if (error) return <p className="text-center text-red-500">{error.message}</p>;

  const active = challenges.filter((c) => !c.progress?.completed);

  return (
    <div className="space-y-6 px-2 md:px-4 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-mission-primary flex items-center gap-2 text-sm md:text-base">
          <Target className="h-5 w-5" />
          MISIONES ACTIVAS
        </h2>
        <Badge color="bg-mission-primary border border-mission-primary text-xs text-center">
          {active.length} EN PROGRESO
        </Badge>
      </div>

      <div className="grid-misiones">
        {active.map((c) => (
          <ChallengeCard key={c._id} challenge={c} />
        ))}
      </div>
    </div>
  );
}
