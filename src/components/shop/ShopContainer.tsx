'use client';

import { FC, useState } from "react";
import { ItemCard } from "./ItemCard";
import { CategoryTabs } from "./CategoryTabs";

export interface ShopItem {
    id: string;
    name: string;
    rarity: "Común" | "Raro" | "Legendario";
    description: string;
    effect?: string;
    price: number;
    category: "Armas" | "Armaduras" | "Consumibles";
}

interface ShopContainerProps {
    items: ShopItem[];
    onPurchase: (itemId: string) => void;
}

export const ShopContainer: FC<ShopContainerProps> = ({ items, onPurchase }) => {
    const [selectedCategory, setSelectedCategory] = useState("Todos");

    const filteredItems = selectedCategory === "Todos"
        ? items
        : items.filter(item => item.category === selectedCategory);

    return (
        <div className="shop-container p-4">
            <CategoryTabs selected={selectedCategory} onSelect={setSelectedCategory} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredItems.map(item => (
                    <ItemCard
                        key={item.id}
                        {...item}
                        onBuy={() => onPurchase(item.id)}
                    />
                ))}
            </div>
        </div>
    );
};
