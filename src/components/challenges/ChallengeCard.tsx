"use client";
import { useMemo, useState, useEffect } from "react";
import { Gift, Plus, Trophy } from "lucide-react";
import { Badge } from "./Badge";
import { ProgressBar } from "./ProgressBar";
import { useChallenge, Challenge } from "@/hooks/useChallenge";

interface ChallengeCardProps {
  challenge: Challenge;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const { incrementChallenge, loading } = useChallenge();
  const [localLoading, setLocalLoading] = useState(false);
  const [localChallenge, setLocalChallenge] = useState(challenge);

  // Actualizar el estado local cuando cambia el challenge desde props
  useEffect(() => {
    setLocalChallenge(challenge);
  }, [challenge]);

  const isComplete = useMemo(() => {
    return localChallenge.status === "completed" || 
           localChallenge.progress?.status === "completed" ||
           localChallenge.progress?.completed === true;
  }, [localChallenge]);

  const handleClick = async () => {
    if (isComplete || localLoading || loading) return;

    try {
      setLocalLoading(true);
      
      // Actualizar inmediatamente el estado local
      const currentCount = localChallenge.progress?.count ?? localChallenge.count;
      const targetCount = localChallenge.progress?.target ?? localChallenge.target;
      const newCount = Math.min(currentCount + 1, targetCount);
      const willComplete = newCount >= targetCount;

      const updatedChallenge: Challenge = {
        ...localChallenge,
        count: newCount,
        progress: {
          count: newCount,
          target: targetCount,
          completed: willComplete,
          status: willComplete ? "completed" : "in-progress"
        },
        status: willComplete ? "completed" : localChallenge.status
      };
      setLocalChallenge(updatedChallenge);

      // Llamar a la API
      const result = await incrementChallenge(challenge._id);
      if (result?.progress?.completed || result?.status === "completed") {
        const completedChallenge: Challenge = {
          ...localChallenge,
          status: "completed",
          progress: {
            ...localChallenge.progress!,
            completed: true,
            status: "completed",
            count: localChallenge.progress?.count ?? localChallenge.count,
            target: localChallenge.progress?.target ?? localChallenge.target
          }
        };
        setLocalChallenge(completedChallenge);
      }
    } catch (error) {
      console.error("Error incrementing challenge:", error);
      // Revertir al estado original en caso de error
      setLocalChallenge(challenge);
    } finally {
      setLocalLoading(false);
    }
  };

  const currentProgress = useMemo(() => {
    const count = localChallenge.progress?.count ?? localChallenge.count;
    const target = localChallenge.progress?.target ?? localChallenge.target;
    return {
      count,
      target,
      percentage: (count / target) * 100,
      isComplete: count >= target
    };
  }, [localChallenge]);

  return (
    <div
      className={`relative border-2 rounded-md shadow-[0_0_12px_rgba(0,255,255,0.2)] p-4 
      text-[13px] leading-tight
      bg-[var(--color-card)] min-h-[240px] flex flex-col justify-between 
      transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_16px_rgba(0,255,255,0.4)]
      ${
        isComplete
          ? "border-mission-success"
          : "border-mission-primary"
      }`}
    >
      <div className="flex justify-between items-start">
        <h3
          className={`font-bold text-sm leading-tight tracking-wide ${
            isComplete ? "text-mission-success" : "text-mission-primary"
          }`}
        >
          {challenge.name}
        </h3>

        <div className="flex flex-col items-center gap-2">
          {isComplete ? (
            <Badge color="bg-mission-success flex items-center gap-1 text-[11px] px-2 py-[2px]">
              <Trophy className="w-3 h-3 inline-block" /> Completo
            </Badge>
          ) : (
            <>
              <div
                className="w-[90px] text-center text-[10px] font-bold 
                bg-gradient-to-b from-cyan-400 to-cyan-500 text-black
                border-[2px] border-white rounded-sm 
                shadow-[2px_2px_0_#000] select-none"
              >
                {currentProgress.count}/{currentProgress.target}
              </div>

              <button
                onClick={handleClick}
                disabled={loading || localLoading}
                className={`w-[90px] h-[28px] font-bold text-[9px] uppercase tracking-wide
                border-[2px] border-white rounded-sm
                shadow-[2px_2px_0_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]
                transition-all duration-100 select-none
                ${
                  loading || localLoading
                    ? "bg-gray-400 text-gray-800 cursor-not-allowed"
                    : "bg-gradient-to-b from-blue-500 to-blue-600 text-white hover:brightness-110"
                }`}
              >
                <Plus className={`w-3 h-3 inline-block mr-1 ${localLoading ? 'animate-spin' : ''}`} />
                {localLoading ? 'Actualizando...' : 'Progreso'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="my-2 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-sm"></div>

      {/* descripcion*/}
      <p className="text-white/90 text-[12px] mb-2 leading-snug text-justify">
        {challenge.description}
      </p>

      {/*progreso*/}
      <ProgressBar
        current={currentProgress.count}
        max={currentProgress.target}
        color={isComplete ? "bg-mission-success" : "bg-mission-primary"}
      />

      {/*recompensa*/}
      <div
        className="mt-3 border-2 border-yellow-400/70 rounded-md p-2 bg-yellow-400/5
        flex items-center gap-2 text-yellow-400 text-[12px] font-semibold shadow-[1px_1px_0_#000_inset]"
      >
        <Gift className="w-4 h-4 text-yellow-400" />
        <span>
          {challenge.reward.coins} monedas + {challenge.reward.item}
        </span>
      </div>
    </div>
  );
}
