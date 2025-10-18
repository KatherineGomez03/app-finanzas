'use client';

import { FC } from "react";
import {
    Sword,
    Shield,
    FlaskConical,
    FlaskRound,
    Zap,
    Gem,
    Crosshair,
    ShoppingCart,
    Coins,
    Move,
    HardHat
} from "lucide-react";

interface ItemCardProps {
    name: string;
    rarity: "Común" | "Raro" | "Legendario";
    description: string;
    effect?: string;
    price: number;
    category: "Armas" | "Armaduras" | "Consumibles";
    onBuy: () => void;
}


const getItemIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("espada")) return <Sword size={20} />;
    if (lower.includes("escudo")) return <Shield size={20} />;
    if (lower.includes("vida")) return <FlaskRound size={20} />;
    if (lower.includes("veneno")) return <FlaskConical size={20} />;
    if (lower.includes("energía") || lower.includes("furia")) return <Zap size={20} />;
    if (lower.includes("botas")) return <Move size={20} />;
    if (lower.includes("diamante") || lower.includes("elixir")) return <Gem size={20} />;
    if (lower.includes("arco")) return <Crosshair size={20} />;
    if (lower.includes("casco")) return <HardHat size={20} />;
    return <Gem size={20} />;
};

export const ItemCard: FC<ItemCardProps> = ({
    name, rarity, description, effect, price, category, onBuy
}) => {
    return (
        <div
            className={`item-card w-full border-4 rarity-${rarity.toLowerCase()} flex flex-col justify-between items-center text-center p-2 rounded-md`}
        >
            <div className="flex items-center space-x-2">
                <div className="w-10 h-10 p-2 border border-white flex items-center justify-center">
                    {getItemIcon(name)}
                </div>
                <div className="flex flex-col justify-center leading-tight">
                    <h3 className="font-press text-xs text-white">{name}</h3>
                    <p className="text-[0.6rem] italic text-gray-400">{rarity}</p>
                </div>
            </div>

            <div>
                <p className="text-[0.65rem] mt-1 text-gray-200">{description}</p>
                {effect && <p className="w full text-xs border-2 font-semibold mt-1 text-green-400">{effect}</p>}
            </div>

            <div className="w-full mt-2 flex flex-col items-center">
                <span className="flex items-center gap-1 font-press text-yellow-400 text-xs">
                    {price} <Coins size={14} strokeWidth={2} />
                </span>
                <button
                    onClick={onBuy}
                    className="mt-1 bg-blue-600 hover:bg-blue-700 text-white text-[0.6rem] font-press px-2 py-1 rounded border-2 border-white flex items-center gap-1"
                >
                    <ShoppingCart size={12} /> COMPRAR
                </button>
            </div>
        </div>
    );
};
