/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { Header } from "@/components/header/Header";
import Tabsnav from "@/components/navbar/Tabsnav";
import ArenaSection from "@/components/ArenaSection";
import { PanelContainer } from "@/components/panel/PanelContainer";
import ExpenseButton from "@/components/button/ExpenseButton";
import LogoutButton from "@/components/button/LogoutButton";
import AdviceAI from "@/components/IA/AdviceAI";
import InventoryPage from "@/components/inventory/InventoryPage";
import { useUserStats } from "@/hooks/useUserStats";
import { ShopContainer } from "@/components/shop/ShopContainer";
import { ChallengeSectionActive } from "@/components/challenges/ChallengeSectionActive";
import { ChallengeSectionCompleted } from "@/components/challenges/ChallengeSectionCompleted";
import ExpenseHistory from "@/components/expenses/ExpenseHistory";
import BalanceSection from "@/components/balance/BalanceSection";

function HomeContent() {
  const sp = useSearchParams();
  const tab = (sp.get("tab") ?? "panel").toLowerCase();

  const { stats, loading, error } = useUserStats();

  const LoadingState = () => (
    <div className="w-full h-full flex items-center justify-center">
      <p className="text-white font-pixel">Cargando estadísticas...</p>
    </div>
  );

  const ErrorState = () => (
    <div className="w-full h-full flex items-center justify-center">
      <p className="text-red-400 font-pixel">Error: {error}</p>
    </div>
  );

  if (loading) return <LoadingState />;
  if (error || !stats) return <ErrorState />;

  const onBuyGlobal = (item: { name: string; price: number }) => {
    console.log("Compra:", item.name, item.price);
    window.alert(`Has comprado ${item.name} por ${item.price}`);
  };

  return (
    <div className="mx-4 text-white min-h-screen bg-[var(--back)] flex flex-col">
      <header className="fixed top-0 left-0 w-full z-50 bg-[var(--back)]">
        <div className="w-[80%] mx-auto">
          <Header {...stats} />
          <nav className="relative w-full px-2 py-2 flex justify-center items-center gap-2 bg-[var(--back)]">
            <Tabsnav />
            <ExpenseButton />
            <LogoutButton />
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_10px_#00ffff]" />
          </nav>
        </div>
      </header>

      <main className="flex-1 pt-[300px] sm:pt-[300px]">
        {tab === "misiones" && (
          <div className="w-full mt-2 mb-6">
            <ChallengeSectionActive />
            <ChallengeSectionCompleted />
          </div>
        )}

        {tab === "arena" && (
          <div className="w-full mt-2 mb-6">
            <ArenaSection />
          </div>
        )}

        {tab === "historial" && (
          <div className="w-full mt-2 mb-6">
            <ExpenseHistory />
          </div>
        )}

        {tab === "tienda" && (
          <div className="w-full mt-2 mb-6">
            <ShopContainer onBuyItem={onBuyGlobal} />
          </div>
        )}

        {tab === "inventario" && (
          <div className="w-full mt-2 mb-6">
            <InventoryPage />
          </div>
        )}

        {tab === "panel" && (
          <div>
            <div className="m-2 max-w-170 flex flex-col gap-2 md:flex-row md:justify-around">
              <PanelContainer />
              <BalanceSection />
            </div>
            <div className="mx-auto max-w-5xl px-4 mt-6">
              <AdviceAI />
            </div>
            <ChallengeSectionActive />
          </div>
        )}
      </main>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<p className="text-white font-pixel">Cargando...</p>}>
      <HomeContent />
    </Suspense>
  );
}
