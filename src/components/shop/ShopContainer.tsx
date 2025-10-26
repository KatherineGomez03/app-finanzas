import React, { useMemo, useState } from "react";
import { ItemCardProps } from "./cosas/shop";
import { mockShop } from "./cosas/mockShop";
import { CategoryTabs } from "./CategoryTabs";
import { ItemCard } from "./ItemCard";


interface ShopContainerProps {
    items?: ItemCardProps[]; // viene del backend
    categories?: string[];   // opcional
    onBuyItem?: (item: ItemCardProps) => void;
}

export const ShopContainer: React.FC<ShopContainerProps> = ({
    items = mockShop,
    categories,
    onBuyItem,
}) => {
    const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

    const filtered = useMemo(() => {
        if (selectedCategory === "Todos") return items;
        return items.filter((it) => it.category === selectedCategory);
    }, [items, selectedCategory]);

    // handler que envuelve el onBuy de cada item
    const handleBuy = (item: ItemCardProps) => {
        if (onBuyItem) onBuyItem(item);
        else item.onBuy();
    };

    return (
        <section className="min-h-screen p-4 bg-[#0a0f1e] text-gray-100">
            <h1 className="mb-4 text-center text-lg font-retro text-blue-300">TIENDA DEL AVENTURERO</h1>

            <CategoryTabs selected={selectedCategory} onSelect={setSelectedCategory} categories={categories} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((it) => (
                    <ItemCard
                        key={`${it.name}-${it.price}`}
                        {...it}
                        onBuy={() => handleBuy(it)}
                    />
                ))}
            </div>
        </section>
    );
};
