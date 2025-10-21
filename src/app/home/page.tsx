"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header/Header";
import Tabsnav from "@/components/navbar/Tabsnav";
import ArenaSection from "@/components/ArenaSection";
import { PanelContainer } from "@/components/panel/PanelContainer";
import TestBalanceStatic from "@/components/balance/TestBalanceStatic";
import BalanceSection from "@/components/balance/BalanceSection";

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

    const mockData = {
        month: "Octubre",
        categories: [
            {
                category: "Alimentación",
                current: 1500,
                previous: 1300,
                color: "green",
            },
            {
                category: "Transporte",
                current: 1000,
                previous: 1200,
                color: "red",
            },
            {
                category: "Entretenimiento",
                current: 750,
                previous: 500,
                color: "yellow",
            },
            {
                category: "Servicios",
                current: 1250,
                previous: 1100,
                color: "red",
            },
            {
                category: "Otros",
                current: 500,
                previous: 600,
                color: "yellow",
            },
        ],
    };

    const mockExpenses = [
        { category: "Alimentación", amount: 1500, color: "#5dd9c1" },
        { category: "Transporte", amount: 1000, color: "#ff7f7f" },
        { category: "Entretenimiento", amount: 750, color: "#ffe599" },
        { category: "Servicios", amount: 1250, color: "#95d5b2" },
        { category: "Otros", amount: 500, color: "#64b5f6" }
    ];

    return (
        <div className="mx-4 min-h-screen text-white">
            <Header {...userData} />

            {/* Navbar debajo de la experiencia */}
            <div className="w-full px-4 py-3 sm:max-w-5xl sm:mx-auto">
                <Tabsnav />
            </div>

            {tab === "arena" ? (
                <div className="mx-auto max-w-5xl px-4">
                    <ArenaSection />
                </div>
            ) : (
                <div className="m-2 grid grid-cols-1 gap-3 md:grid-cols-3">


                    <PanelContainer />
                    {/* <BalanceSection userId={""}/> */}
                    <TestBalanceStatic />

                </div>
            )}
        </div>
    );
}
export default App;
