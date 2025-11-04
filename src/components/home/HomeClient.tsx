"use client";

import React, { useEffect, useState } from "react";

import { Header } from "@/components/header/Header";
import Tabsnav from "@/components/navbar/Tabsnav";
import ArenaSection from "@/components/ArenaSection";
import { PanelContainer } from "@/components/panel/PanelContainer";
import { ChallengeSection } from "@/components/challenges/ChallengeSection";
import ExpenseButton from "@/components/button/ExpenseButton";
import LogoutButton from "@/components/button/LogoutButton";
import AdviceAI from "@/components/IA/AdviceAI";
import InventoryPage from "@/components/inventory/InventoryPage";
import { useUserStats } from "@/hooks/useUserStats";
import { ShopContainer } from "@/components/shop/ShopContainer";
import { ChallengeSectionActive } from "@/components/challenges/ChallengeSectionActive";
import { ChallengeSectionCompleted } from "@/components/challenges/ChallengeSectionCompleted";
import ExpenseHistory from "@/components/expenses/ExpenseHistory";
import BalanceSection from "../balance/BalanceSection";

export default function HomeClient() {
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

  // Tabs: usamos URLSearchParams sobre window.location (cliente) en vez de useSearchParams
  const [tab, setTab] = useState<string>("panel");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    setTab((sp.get("tab") ?? "panel").toLowerCase());
  }, []);

  const mockSavings = {
    current: 1350,
    goal: 2000,
    remainingDays: 14,
    dailySavings: [50, 75, 100, 60, 90, 120, 80, 120, 70, 85, 95, 63, 100],
  };

  const mockData = {
    month: "Octubre",
    categories: [
      {
        category: "Alimentación",
        current: 1500,
        previous: 1300,
        color: "green",
      },
      { category: "Transporte", current: 1000, previous: 1200, color: "red" },
      {
        category: "Entretenimiento",
        current: 750,
        previous: 500,
        color: "yellow",
      },
      { category: "Servicios", current: 1250, previous: 1100, color: "red" },
      { category: "Otros", current: 500, previous: 600, color: "yellow" },
    ],
  };

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
    return <p className="text-red-400 font-pixel">Error: {String(error)}</p>;

  const onBuyGlobal = (item: { name: string; price: number }) => {
    console.log("Compra:", item.name, item.price);
    if (typeof window !== "undefined")
      window.alert(`Has comprado ${item.name} por ${item.price}`);
  };

  return (
    <div className="mx-4  text-white min-h-screen bg-[var(--back)] flex flex-col">
      <header className="fixed top-0 left-0 w-full mb-3 z-50 bg-[var(--back)]">
        <div className="w-[80%] mx-auto">
          <Header {...stats} />

          <nav className="w-full px-2 py-2 flex justify-center items-center gap-2 bg-[var(--back)]">
            <Tabsnav />
            <ExpenseButton />
            <LogoutButton />
          </nav>
        </div>
      </header>

      <main className="flex-1 pt-[300px] sm:pt-[300px]">
        {tab === "misiones" && (
          <div className="w-full mt-2 mb-6 ">
            <ChallengeSectionActive />
            <ChallengeSectionCompleted />
          </div>
        )}

        {tab === "arena" && (
          <div className="w-full mt-2 mb-6 ">
            <ArenaSection />
          </div>
        )}
        {tab === "historial" && (
          <div className="w-full mt-2 mb-6 ">
            <ExpenseHistory />
          </div>
        )}

        {tab === "tienda" && (
          <div className="w-full mt-2 mb-6 ">
            <ShopContainer onBuyItem={onBuyGlobal} />
          </div>
        )}

        {tab === "inventario" && (
          <div className="w-full mt-2 mb-6 ">
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
