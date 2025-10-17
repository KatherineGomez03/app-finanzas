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
  // estado local del progreso
  const [progress, setProgress] = useState(initialProgress);

  // verifica si la mision esta completa
  const isComplete = useMemo(
    () => progress >= total || status === "completo",
    [progress, total, status]
  );

  // aumenta el progreso 
  const handleAddProgress = () => {
    if (isComplete) return;
    setProgress((p) => Math.min(p + 1, total));
  };

  return (
    <Card
      className={[
        "border-2 rounded-md shadow-pixel overflow-hidden",
        isComplete ? "border-green-500 bg-green-50" : "border-gray-700 bg-card",
      ].join(" ")}
    >

      <CardHeader className="pb-2 border-b border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 border rounded-sm ${
                isComplete
                  ? "bg-green-100 border-green-400"
                  : "bg-primary/20 border-primary"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  isComplete ? "text-green-700" : "text-primary"
                }`}
              />
            </div>
            <CardTitle
              className={`${
                isComplete ? "text-green-700" : "text-primary"
              } text-xs md:text-sm tracking-wider`}
            >
              {title.toUpperCase()}
            </CardTitle>
          </div>


          <div className="flex flex-col items-center gap-2">
            {isComplete ? (
              <Badge className="bg-green-600 border border-green-500 text-[10px] md:text-xs flex items-center gap-1">
                <Trophy className="h-3 w-3" /> Completo
              </Badge>
            ) : (
              <>
                <Badge className="bg-blue-600 border border-blue-400 text-[10px] md:text-xs">
                  {progress}/{total}
                </Badge>

                <button
                  onClick={handleAddProgress}
                  aria-label="Añadir progreso"
                  title="Añadir progreso"
                  className="flex items-center justify-center w-full h-7 bg-blue-600 hover:bg-blue-700
                             border border-blue-400 rounded-sm text-white font-bold
                             transition-transform duration-150 active:scale-95 shadow-pixel"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* descripcion de la mision */}
        <p className="text-[10px] md:text-xs text-gray-300 mt-2">
          {description}
        </p>
      </CardHeader>

      {/* contenido */}
      <CardContent className="space-y-3 pt-3">
        {/* barra de progreso */}
        {!isComplete && (
          <ProgressBar current={progress} max={total} color="bg-green-500" />
        )}

        {/* recompensa */}
        <div
          className={[
            "flex items-center gap-2 p-2 border-2 rounded-sm text-[11px] md:text-xs font-medium",
            isComplete
              ? "bg-green-100 border-green-400 text-green-700"
              : "bg-yellow-900/30 border-yellow-600 text-yellow-300",
          ].join(" ")}
        >
          <Gift
            className={`h-4 w-4 ${
              isComplete ? "text-green-700" : "text-yellow-400"
            }`}
          />
          <span className={isComplete ? "text-green-800" : "text-yellow-300"}>
            Reward:
          </span>
          <span className={isComplete ? "text-green-700" : "text-yellow-200"}>
            {reward}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
