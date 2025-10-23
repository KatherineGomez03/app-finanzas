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
import AdviceAI from "@/components/IA/AdviceAI";
import InventoryPage from "@/components/inventory/InventoryPage";


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

  // AdviceAI esperaria un objeto { [categoria]: monto }
  const expensesByCategory = Object.fromEntries(
    mockExpenses.map((e) => [e.category, e.amount])
  );

  return (
    <div className="mx-4 min-h-screen text-white">
      <Header {...userData} />

    
      <div className="mx-auto max-w-5xl px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Tabsnav />
        <ExpenseButton
          onSubmit={({ description, amount, category, date }) => {
            console.log("Nuevo gasto registrado:", { description, amount, category, date });
            // acá mas tarde podemos actualizar el store y volver a pasar a AdviceAI
          }}
        />
      </div>
      
      {tab === "misiones" && (
        <div className="w-full mt-10 mb-8">
          <div className="mx-auto max-w-6xl px-4 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] justify-center">
            <ChallengeSection />
          </div>
        </div>
      )}

      {tab === "arena" && (
        <div className="mx-auto max-w-5xl px-4">
          <ArenaSection />
        </div>
      )}
        {tab === "inventory" && (
        <div className="mx-auto max-w-5xl px-4">
          < InventoryPage />
        </div>
      )}
      {/* Panel gráficos + IA de consejos */}
      {tab === "panel" && (
        <>
          <div className="m-2 flex justify-around gap-4 md:grid-cols-2">
            <PanelContainer />
            {/*BalanceSection userId={""}  */}
            <TestBalanceStatic />
          </div>

          {/* Consejo financiero de la IA abajo del gráfico */}
          <div className="mx-auto max-w-5xl px-4 mt-6">
            <AdviceAI
              // si tenés un ingreso mensual real se reemplaza aca
              monthlyIncome={3000}
              savingsGoal={mockSavings.goal}
              currentSavings={mockSavings.current}
              daysLeft={mockSavings.remainingDays}
              expensesByCategory={expensesByCategory}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
