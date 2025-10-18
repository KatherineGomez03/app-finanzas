'use client';

import React from "react"
import { Header } from "./header/Header"
import { PanelContainer } from "./panel/PanelContainer"
import SaveContainer from "./save/SaveContainer";
import { ShopContainer, ShopItem } from "./shop/ShopContainer";

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
    }

    const mockSavings = {
        current: 1350,
        goal: 2000,
        remainingDays: 14,
        dailySavings: [50, 75, 100, 60, 90, 80, 120, 70, 85, 95, 60, 100, 65, 100],
    };


    const mockItems: ShopItem[] = [
        {
            id: "1",
            name: "Espada de Hierro",
            rarity: "Común",
            description: "Una espada básica que aumenta el daño ligeramente.",
            effect: "+5 Ataque",
            price: 50,
            category: "Armas",
        },
        {
            id: "2",
            name: "Espada de Diamante",
            rarity: "Legendario",
            description: "Espada legendaria con poder devastador.",
            effect: "+25 Ataque",
            price: 200,
            category: "Armas",
        },
        {
            id: "3",
            name: "Poción de Vida",
            rarity: "Común",
            description: "Restaura 50 puntos de vida.",
            price: 25,
            category: "Consumibles",
        },
        {
            id: "4",
            name: "Poción de Veneno",
            rarity: "Raro",
            description: "Causa daño por veneno al enemigo.",
            effect: "+10 Daño de veneno",
            price: 40,
            category: "Consumibles",
        },
        {
            id: "5",
            name: "Escudo Mágico",
            rarity: "Raro",
            description: "Reduce el daño recibido.",
            effect: "+10 Defensa",
            price: 100,
            category: "Armaduras",
        },
        {
            id: "6",
            name: "Poción de Energía",
            rarity: "Común",
            description: "Aumenta temporalmente el ataque.",
            effect: "+4 Ataque temporal",
            price: 35,
            category: "Consumibles",
        },
        {
            id: "7",
            name: "Casco de Acero",
            rarity: "Común",
            description: "Protege la cabeza contra ataques físicos.",
            effect: "+3 Defensa",
            price: 45,
            category: "Armaduras",
        },
        {
            id: "8",
            name: "Arco de Cazador",
            rarity: "Raro",
            description: "Ideal para ataques a distancia.",
            effect: "+8 Ataque",
            price: 80,
            category: "Armas",
        },
        {
            id: "9",
            name: "Botas de Velocidad",
            rarity: "Raro",
            description: "Aumenta la velocidad de movimiento.",
            effect: "+5 Velocidad",
            price: 70,
            category: "Armaduras",
        },
        {
            id: "10",
            name: "Elixir de Furia",
            rarity: "Legendario",
            description: "Multiplica el daño por un corto tiempo.",
            effect: "+15 Ataque temporal",
            price: 150,
            category: "Consumibles",
        },
    ];

    const handlePurchase = (itemId: string) => {
        console.log(`Item comprado: ${itemId}`);
        // POST al endpoint de compra
    };

    return (
        <div className="mx-4 min-h-screen text-white">
            <Header {...userData} />
            <div className="m-2 flex justify-items-center grid grid-cols-1 md:grid-cols-2">
                <PanelContainer />
                <SaveContainer
                    current={mockSavings.current}
                    goal={mockSavings.goal}
                    remainingDays={mockSavings.remainingDays}
                    dailySavings={mockSavings.dailySavings}
                />
            </div>

            <div className="mx-4 min-h-screen text-white">
                <h1 className="font-press text-xl py-4">🛒 Tienda</h1>
                <ShopContainer items={mockItems} onPurchase={handlePurchase} />
            </div>

        </div>
    )
}

export default App
