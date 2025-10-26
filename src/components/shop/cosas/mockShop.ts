import { ItemCardProps } from "./shop";

/**
 * Mock local de la "base de datos".
 * Cada item incluye onBuy como placeholder.
 */

export const mockShop: ItemCardProps[] = [
    {
        name: "Espada de Hierro",
        rarity: "Común",
        description: "Una espada básica que aumenta tu ataque",
        effect: "+5 Ataque",
        price: 50,
        category: "Armas",
        onBuy: () => window.alert("Compraste la Espada de Hierro"),
    },
    {
        name: "Espada de Diamante",
        rarity: "Legendario",
        description: "Espada legendaria con poder devastador",
        effect: "+20 Ataque",
        price: 200,
        category: "Armas",
        onBuy: () => window.alert("Compraste la Espada de Diamante"),
    },
    {
        name: "Poción de Vida",
        rarity: "Común",
        description: "Restaura 50 puntos de vida",
        effect: "+50 Vida",
        price: 25,
        category: "Consumibles",
        onBuy: () => window.alert("Compraste la Poción de Vida"),
    },
    {
        name: "Escudo Mágico",
        rarity: "Raro",
        description: "Aumenta tu defensa mágica por 5 turnos",
        effect: "+10 Defensa",
        price: 100,
        category: "Armaduras",
        onBuy: () => window.alert("Compraste el Escudo Mágico"),
    },
];
