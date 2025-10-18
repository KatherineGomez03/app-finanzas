"use client";

import React from "react";
import { Header } from "./header/Header";                
import { PanelContainer } from "./panel/PanelContainer";  
import SaveContainer from "./save/SaveContainer";         // ← default (sin llaves)
import Tabsnav from "./Tabsnav";                           
import ArenaSection from "../components/ArenaSection";
import { useSearchParams } from "next/navigation";   

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
    </div>
  );
}
export default App;
