"use client";

import React from "react";
import { Header } from "./header/Header";                
import { PanelContainer } from "./panel/PanelContainer";  
import SaveContainer from "./save/SaveContainer";
import Tabsnav from "./Tabsnav";                           
import ArenaSection from "../components/ArenaSection";
import { useSearchParams } from "next/navigation";   
import { ChallengeSection } from "./challenges/ChallengeSection";
import ExpenseButton from "./button/ExpenseButton";


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
  const sp = useSearchParams();                    
  const tab = (sp.get("tab") ?? "panel").toLowerCase();
  const mockSavings = {
    current: 1350,
    goal: 2000,
    remainingDays: 14,
    dailySavings: [50, 75, 100, 60, 90, 120, 80, 120, 70, 85, 95, 63, 100],
  };
  return (
  <div className="mx-4 min-h-screen text-white">
    <Header {...userData} />

    {/* Navbar debajo de la experiencia */}
    <div className="mx-auto max-w-5xl px-4 py-3">
      <Tabsnav />
    </div>

    
    {tab === "misiones" && (
      <div className="w-full mt-10 mb-8">
        <div className=" mx-auto max-w-6xl px-4 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] justify-center">
          <ChallengeSection />
        </div>
      </div>
    )}


    {tab === "panel" && (
      <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
        <ExpenseButton
          onSubmit={({ description, amount, category, date }) => {
            console.log("Nuevo gasto registrado:", {
              description,
              amount,
              category,
              date,
            });
          }}
        />
      </div>
    )}
    {tab === "panel" && (
      
      <div className="m-2 flex justify-around gap-4 md:grid-cols-2">
        <PanelContainer />
        <SaveContainer
          current={mockSavings.current}
          goal={mockSavings.goal}
          remainingDays={mockSavings.remainingDays}
          dailySavings={mockSavings.dailySavings}
        />
      </div>
    )}

    {tab === "arena" && (
      <div className="mx-auto max-w-5xl px-4">
          <ArenaSection />
      </div>
    )}

    {/* 

      {tab === "arena" ? (
        <div className="mx-auto max-w-5xl px-4">
          <ArenaSection />
        </div>
      ) : (
        <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
          <PanelContainer />
          <SaveContainer
            current={mockSavings.current}
            goal={mockSavings.goal}
            remainingDays={mockSavings.remainingDays}
            dailySavings={mockSavings.dailySavings}
          />
        </div>
      )}
    */}
  </div> 
);

}

export default App;
