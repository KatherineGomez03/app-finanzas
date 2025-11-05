import React, { useMemo, useState } from "react";
import { ItemCardProps } from "./cosas/shop";
import { mockShop } from "./cosas/mockShop";
import { CategoryTabs } from "./CategoryTabs";
import { ItemCard } from "./ItemCard";
import { Store } from "lucide-react";
import { useItems } from "@/hooks/useItems";


interface ShopContainerProps {
    items?: ItemCardProps[]; // viene del backend
    categories?: string[];   // opcional
}

export const ShopContainer: React.FC<ShopContainerProps> = ({
    categories,
}) => {
    const { items, loading, error } = useItems();
    const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

    const filtered = useMemo(() => {
        if (selectedCategory === "Todos") return items;
        return items.filter((it) => it.category === selectedCategory);
    }, [items, selectedCategory]);

    return (
        <section className="min-h-screen p-4 text-gray-100">

            <h2 className="text-mission-primary flex items-center gap-2 text-sm md:text-base mb-6 font-retro">
                <Store className="h-5 w-5" aria-hidden="true" />
                TIENDA DEL AVENTURERO
            </h2>

            <CategoryTabs selected={selectedCategory} onSelect={setSelectedCategory} categories={categories} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((it) => (
                    <ItemCard
                        key={`${it.name}-${it.price}`}
                        {...it}
                    />
                ))}
            </div>
        </section>
    );
};
