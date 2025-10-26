"use client";
import { Trophy } from "lucide-react";
import { Badge } from "./Badge";
import { ChallengeCard } from "./ChallengeCard";
import { useChallenge } from "@/hooks/useChallenge";
import { useEffect } from "react";

export function ChallengeSectionCompleted() {
  const { challenges, fetchChallenges, loading, error } = useChallenge();

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  if (loading && challenges.length === 0)
    return <p className="text-center text-white">Cargando misiones...</p>;

  if (error) return <p className="text-center text-red-500">{error.message}</p>;

  // filtrar completadas
  const completed = challenges.filter(
    (c) => (c.count ?? 0) >= (c.target ?? 1)
  );

  return (
    <div className="space-y-6 px-2 md:px-4 py-4">
      <div className="flex items-center justify-between">
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
    </div>
  );
}
