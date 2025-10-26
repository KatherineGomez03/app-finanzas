"use client";
import { useMemo } from "react";
import { Gift, Plus, Trophy } from "lucide-react";
import { Badge } from "./Badge";
import { ProgressBar } from "./ProgressBar";
import { Button } from "./Button";
import { useChallenge, Challenge } from "@/hooks/useChallenge";

interface ChallengeCardProps {
  challenge: Challenge;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const { incrementChallenge, loading } = useChallenge();
  const isComplete = useMemo(() => {
    const count = Number(challenge.count ?? 0);
const target = Number(challenge.target ?? 1);
const status = challenge.status?.toLowerCase?.() ?? "active";

return (target > 0 && count >= target) || status === "completed";

}, [challenge]);

  const handleClick = async () => {
    if (isComplete || loading) return;
    await incrementChallenge(challenge._id);
  };

  return (
    <div
      className={`border-2 rounded-md shadow-md p-3 ${
        isComplete ? "border-green-500" : "border-blue-500"
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <h3
          className={`font-bold text-sm ${
            isComplete ? "text-green-400" : "text-blue-400"
          }`}
        >
          {challenge.name}
        </h3>
        {isComplete ? (
          <Badge color="bg-green-600 flex items-center gap-1">
            <Trophy className="w-3 h-3 inline-block" /> Completo
          </Badge>
        ) : (
          <Badge color="bg-blue-600">
            {challenge.count}/{challenge.target}
          </Badge>
        )}
      </div>

      <p className="text-xs text-white/80 mb-2">{challenge.description}</p>

      <ProgressBar
        current={challenge.count}
        max={challenge.target}
        color={isComplete ? "bg-green-500" : "bg-blue-500"}
      />

      <div className="flex justify-between items-center mt-3">
        <div className="text-xs text-yellow-400 flex items-center gap-1">
          <Gift className="w-3 h-3" />
          {challenge.reward.coins} monedas + {challenge.reward.item}
        </div>

        {!isComplete && (
          <Button
            onClick={handleClick}
            disabled={loading}
            variant="primary"
            size="sm"
            loading={loading}
          >
            <Plus className="w-3 h-3 inline-block mr-1" />
            Progreso
          </Button>
        )}
      </div>
    </div>
  );
}
