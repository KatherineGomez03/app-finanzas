"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import { Header } from "@/components/header/Header";
import Tabsnav from "@/components/navbar/Tabsnav";
import ArenaSection from "@/components/ArenaSection";
import { PanelContainer } from "@/components/panel/PanelContainer";
import TestBalanceStatic from "@/components/balance/TestBalanceStatic";
import BalanceSection from "@/components/balance/BalanceSection";
import { ChallengeSection } from "@/components/challenges/ChallengeSection";
import ExpenseButton from "@/components/button/ExpenseButton";
import LogoutButton from "@/components/button/LogoutButton";
import AdviceAI from "@/components/IA/AdviceAI";
import InventoryPage from "@/components/inventory/InventoryPage";
import { useUserStats } from "@/hooks/useUserStats";
import { ShopContainer } from "@/components/shop/ShopContainer";
import { ChallengeSectionActive } from "@/components/challenges/ChallengeSectionActive";
import {ChallengeSectionCompleted } from "@/components/challenges/ChallengeSectionCompleted";


function App() {
  const userData = {
    username: "Maximiliano Guerra",
    level: 4,
    health: 75,
    maxHealth: 100,
    experience: 350,
    maxExperience: 500,
    attack: 30,
    defense: 15,
    coins: 285,
  };

  // Tabs
  const sp = useSearchParams();
  const tab = (sp.get("tab") ?? "panel").toLowerCase();


  const mockSavings = {
    current: 1350,
    goal: 2000,
    remainingDays: 14,
    dailySavings: [50, 75, 100, 60, 90, 120, 80, 120, 70, 85, 95, 63, 100],
  };

  const mockData = {
    month: "Octubre",
    categories: [
      { category: "Alimentación", current: 1500, previous: 1300, color: "green" },
      { category: "Transporte", current: 1000, previous: 1200, color: "red" },
      { category: "Entretenimiento", current: 750, previous: 500, color: "yellow" },
      { category: "Servicios", current: 1250, previous: 1100, color: "red" },
      { category: "Otros", current: 500, previous: 600, color: "yellow" },
    ],
  };


  // Gasto por categoría esto lo converti a objeto para AdviceAI
  const mockExpenses = [
    { category: "Alimentación", amount: 1500, color: "#5dd9c1" },
    { category: "Transporte", amount: 1000, color: "#ff7f7f" },
    { category: "Entretenimiento", amount: 750, color: "#ffe599" },
    { category: "Servicios", amount: 1250, color: "#95d5b2" },
    { category: "Otros", amount: 500, color: "#64b5f6" },
  ];
  const expensesByCategory = Object.fromEntries(
    mockExpenses.map((e) => [e.category, e.amount])
  );
  const { stats, loading, error } = useUserStats();

  if (loading)
    return <p className="text-white font-pixel">Cargando estadísticas...</p>;
  if (error || !stats)
    return <p className="text-red-400 font-pixel">Error: {error}</p>;

  console.log(stats);

  const onBuyGlobal = (item: any) => {
    console.log("Compra:", item.name, item.price);
    window.alert(`Has comprado ${item.name} por ${item.price}`);
  };

  return (
    <div className="mx-4  text-white min-h-screen bg-[var(--back)] flex flex-col">
      <header className="fixed top-0 left-0 w-full z-50 bg-[var(--back)]">
        <div className="w-[80%] mx-auto">
          <Header {...stats} />

          <nav className="w-full px-2 py-2 flex justify-center items-center flex-wrap gap-3 bg-[var(--back)]">
            <Tabsnav />
            <ExpenseButton />
            <LogoutButton/>
          </nav>
        </div>
      </header>

      <main className="flex-1 pt-[300px] sm:pt-[300px]">
        {tab === "misiones" && (
          <div className="w-full mt-2 mb-6 responsive-grid ">
            <ChallengeSectionActive/>
            <ChallengeSectionCompleted/>
          </div>)
        }

        {tab === "arena" && (
          <div className="w-full mt-2 mb-6 responsive-grid">
            <ArenaSection />
          </div>
        )}

        {tab === "tienda" && (
          <div className="w-full mt-2 mb-6 responsive-grid">
            <ShopContainer onBuyItem={onBuyGlobal} />
          </div>
        )}

        {tab === "inventario" && (
          <div className="w-full mt-2 mb-6 responsive-grid">
            < InventoryPage />
          </div>
        )}


        {tab === "panel" && (
          <div>
            <div className="m-2 flex flex-col gap-2 md:flex-row md:justify-around ">
              <PanelContainer />
              {/* <BalanceSection userId={""}/> */}
              <TestBalanceStatic />
            </div>
            <div className="mx-auto max-w-5xl px-4 mt-6">
              <AdviceAI />
            </div>
            <ChallengeSectionActive/>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
