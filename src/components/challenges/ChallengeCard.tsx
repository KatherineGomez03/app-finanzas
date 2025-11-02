"use client";
import { Trophy, Plus } from "lucide-react";
import { Challenge } from "@/hooks/useChallenge";

interface ChallengeCardProps {
  challenge: Challenge;
  incrementChallenge: (id: string) => Promise<void>;
}

export function ChallengeCard({ challenge, incrementChallenge }: ChallengeCardProps) {
  const { name, description, reward, progress, _id, target } = challenge;
  const isComplete = progress.completed;
  const progressPercent = Math.min((progress.count / target) * 100, 100);

  return (
    <div className="p-4 rounded-xl border border-[var(--mission-primary)] bg-[var(--color-card)] text-white shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <div className="flex items-center gap-2 mb-2">
        <Trophy className="text-[var(--mission-primary)] w-5 h-5" />
        <h3 className="font-pressStart text-sm">{name}</h3>
      </div>

      <p className="text-xs text-gray-300 mb-3">{description}</p>

      <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
        <div
          className="bg-[var(--mission-primary)] h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className="text-xs mb-2">
        {progress.count}/{target} → {progress.status}
      </p>

      <button
        onClick={() => incrementChallenge(_id)}
        disabled={isComplete}
        className={`w-full py-1.5 mt-1 text-xs rounded-lg font-pressStart border ${
          isComplete
            ? "bg-green-600 border-green-400 cursor-default"
            : "bg-[var(--mission-primary)] hover:bg-[var(--mission-success)] border-transparent"
        }`}
      >
        {isComplete ? "✅ Completado" : <><Plus className="inline w-3 h-3" /> Incrementar</>}
      </button>

      <p className="text-[10px] text-gray-400 mt-3 text-center">
        🎁 {reward.coins} monedas • {reward.item}
      </p>
    </div>
  );
}
