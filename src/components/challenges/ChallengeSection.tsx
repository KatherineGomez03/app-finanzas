"use client";
import { useEffect } from "react";
import { Target } from "lucide-react";
import { Badge } from "./Badge";
import { ChallengeCard } from "./ChallengeCard";
import { useChallenge } from "@/hooks/UseChallenges";

export function ChallengeSectionActive() {
  const { challenges, loading, error, fetchChallenges } = useChallenge({
    onSuccess: () => {},
    onError: (error) => console.error("Error fetching challenges:", error),
  });

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  // 🔹 Filtrar solo los desafíos activos
  const activeChallenges = challenges.filter(
    (c: any) => c.status === "active"
  );

  if (loading)
    return (
      <p className="text-center text-sm text-gray-400 mt-6">
        Cargando misiones activas...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-red-500 mt-6">
        Error al cargar misiones
      </p>
    );

  return (
    <div className="space-y-6 px-2 md:px-4 py-4 mb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-mission-primary flex items-center gap-2 text-sm md:text-base">
          <Target className="h-5 w-5" />
          MISIONES ACTIVAS
        </h2>
        <Badge className="bg-mission-primary border border-mission-primary text-xs text-center">
          {activeChallenges.length} EN PROGRESO
        </Badge>
      </div>

      <div className="grid-misiones">
        {activeChallenges.map((c: any) => (
          <ChallengeCard
            key={c.id}
            id={c.id}
            title={c.name}
            description={c.description}
            progress={c.count}
            total={c.target}
            reward={`${c.reward.coins} monedas + ${c.reward.item}`}
            status={c.status}
            icon={Target}
          />
        ))}
      </div>
    </div>
  );
}
