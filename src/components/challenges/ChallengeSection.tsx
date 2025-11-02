"use client";
import { useEffect } from "react";
import { useChallenge } from "@/hooks/useChallenge";
import { ChallengeCard } from "./ChallengeCard";

export function ChallengeSection() {
  const { challenges, loading, error, fetchChallenges, initChallenges, incrementChallenge } =
    useChallenge();

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  if (loading) return <p className="text-center text-white">Cargando desafíos...</p>;
  if (error) return <p className="text-center text-red-400">{error.message}</p>;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {challenges.length > 0 ? (
        challenges.map((challenge) => (
          <ChallengeCard
            key={challenge._id}
            challenge={challenge}
            incrementChallenge={incrementChallenge}
          />
        ))
      ) : (
        <div className="col-span-full text-center text-white">
          <p>No hay desafíos inicializados aún.</p>
          <button
            onClick={initChallenges}
            className="mt-3 px-4 py-2 rounded-lg bg-[var(--mission-primary)] text-white hover:bg-[var(--mission-success)] font-pressStart text-xs"
          >
            Inicializar desafíos
          </button>
        </div>
      )}
    </section>
  );
}
