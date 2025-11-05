"use client";

import { JSX, useState } from "react";

import { Sword, Shield, Heart, Star } from "lucide-react";
import { Category, ItemCardProps, Rarity } from "../shop/cosas/shop";

const rarityColors: Record<Rarity, string> = {
    Común: "bg-gray-800 border-gray-600 text-gray-200 bg-opacity-60",
    Raro: "rarity-raro",
    Legendario: "rarity-legendario",
};

const getCategoryIcon = (category: Category): JSX.Element => {
    switch (category) {
        case "Armas":
            return <Sword className="w-5 h-5" />;
        case "Armaduras":
            return <Shield className="w-5 h-5" />;
        case "Consumibles":
            return <Heart className="w-5 h-5" />;
        default:
            return <Star className="w-5 h-5" />;
    }
};

export const EquipCard: React.FC<ItemCardProps> = ({
    id,
    name,
    rarity,
    effect,
    category,
}) => {
    const [isEquipped, setIsEquipped] = useState(false);
    const [message, setMessage] = useState("");

    const handleEquip = () => {
        if (isEquipped) return;
        setIsEquipped(true);
        setMessage(`¡Equipaste ${name}! ⚔️`);
        setTimeout(() => setMessage(""), 2000);
    };

    return (
        <>
            {message && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[var(--color-navy)] text-yellow-300 border border-yellow-500 px-4 py-2 font-['PressStart2P'] text-xs animate-bounce z-50">
                    {message}
                </div>
            )}

            <article
                className={`w-full rounded-lg border-2 p-4 flex flex-col justify-between font-retro text-[11px] ${rarityColors[rarity]}`}
                aria-label={name}
            >
                {/* HEADER */}
                <header className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-black/20 rounded-md">
                        {getCategoryIcon(category)}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm leading-none">{name.toUpperCase()}</h3>
                        <span className="inline-block mt-1 px-2 py-[3px] text-[10px] border-2 rounded bg-black/30">
                            {rarity.toUpperCase()}
                        </span>
                    </div>
                </header>

                {effect && (
                    <div className="border border-blue-400/40 bg-black/10 p-2 rounded text-center text-[12px] mb-3">
                        {effect}
                    </div>
                )}

                <footer className="flex justify-end mt-auto">
                    <button
                        onClick={handleEquip}
                        disabled={isEquipped}
                        className={`px-3 py-1 border-2 rounded-md font-bold text-[12px] transition
              ${isEquipped
                                ? "bg-green-600/80 cursor-default"
                                : "bg-blue-700/80 hover:bg-blue-700/100"}
            `}
                    >
                        {isEquipped ? "EQUIPADO ✅" : "EQUIPAR"}
                    </button>
                </footer>
            </article>
        </>
    );
};
