"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { Badge } from "./Badge";
import { ProgressBar } from "./ProgressBar";
import { Gift, Plus, Trophy } from "lucide-react";



interface ChallengeCardProps {
  id: number;
  title: string;
  description: string;
  progress: number;
  total: number;
  reward: string;
  status: "activo" | "completo";
  icon: React.ElementType;
}

export function ChallengeCard({
  id,
  title,
  description,
  progress: initialProgress,
  total,
  reward,
  status,
  icon: Icon,
}: ChallengeCardProps) {

  const [progress, setProgress] = useState(initialProgress);


  const isComplete = useMemo(
    () => progress >= total || status === "completo",
    [progress, total, status]
  );


  const handleAddProgress = () => {
    if (isComplete) return;
    setProgress((p) => Math.min(p + 1, total));
  };

  return (
    <Card
      className={[
        "border-2 rounded-md shadow-pixel overflow-hidden",
        isComplete ? "border-mission-success bg-card" : "border-mission-primary bg-card",
      ].join(" ")}
    >
      <CardHeader className={`pb-2 border-b ${
          isComplete
            ? "border-[var(--mission-success)]"
            : "border-[var(--mission-primary)]"
          }`}
        >
        <div className="flex items-start justify-between">
          {/* icono y título */}
          <div className="flex items-center gap-3">
            <div
              className={`p-2 border rounded-sm ${
                isComplete ? "border-mission-success" : "border-mission-primary"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  isComplete ? "text-mission-success" : "text-mission-primary"
                }`}
              />
            </div>
            <CardTitle
              className={`${
                isComplete ? "text-mission-success" : "text-mission-primary"
              } text-xs md:text-sm tracking-wider`}
            >
              {title.toUpperCase()}
            </CardTitle>
          </div>

          {/* badges y botón */}
          <div className="flex flex-col items-center gap-2">
            {isComplete ? (
              <Badge className="bg-mission-success border border-mission-success text-[10px] md:text-xs flex items-center gap-1 text-white">
                <Trophy className="h-3 w-3" /> Completo
              </Badge>
            ) : (
              <>
                <Badge className="bg-mission-primary border border-mission-primary text-[10px] md:text-xs text-white">
                  {progress}/{total}
                </Badge>

                <button
                  onClick={handleAddProgress}
                  aria-label="Añadir progreso"
                  title="Añadir progreso"
                  className="flex items-center justify-center w-full h-7 bg-mission-primary hover:bg-[#0fc9d8] border border-mission-primary rounded-sm text-white font-bold transition-transform duration-150 active:scale-95">
                  <Plus className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-[10px] md:text-xs text-white/85 mt-2">{description}</p>
      </CardHeader>


      <CardContent className="space-y-3 pt-3">

        {!isComplete && (
          <ProgressBar current={progress} max={total} color="bg-mission-success" />
        )}

        <div className="flex items-center justify-center gap-2 p-2 border-2 rounded-sm text-[11px] md:text-xs font-medium border-mission-reward text-mission-reward">
          <Gift className="h-3 w-3 text-mission-reward" />
          <span>Reward:</span>
          <span>{reward}</span>
        </div>
      </CardContent>
    </Card>
  );
}
