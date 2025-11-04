import React, { JSX, useState } from "react";
import { ItemCardProps, Rarity, Category } from "./cosas/shop"
import { Sword, Shield, Heart, Star } from "lucide-react";
import { useUserStats } from "@/hooks/useUserStats";
import { useUserUpdate } from "@/context/UserUpdateContext";
import { useInternalTransaction } from "@/hooks/useInternalTransaction";


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

export const ItemCard: React.FC<ItemCardProps> = ({
  id,
  name,
  rarity,
  description,
  effect,
  price,
  category,

}) => {
  const [rpgMessage, setRpgMessage] = useState("");
  const [isPurchased, setIsPurchased] = useState(false);

  const user = useUserStats();
  const { triggerUpdate } = useUserUpdate();
  const transaction = useInternalTransaction();
  const canAfford = (user?.stats?.coins ?? 0) >= price;

  const handleBuy = () => {
    if (!canAfford) return; // evita clic si no tiene suficiente
    setRpgMessage(`¡Compraste ${name} por ${price} 🔥!`);
    setTimeout(() => setRpgMessage(""), 2000);
    const update = price * (-1);
    coins.updateCoins(update);
    transaction.createTransaction(id, price);
  };

  return (
    <>
      {rpgMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[var(--color-navy)] text-yellow-300 border border-yellow-500 px-4 py-2 font-['PressStart2P'] text-xs animate-bounce z-50">
          {rpgMessage}
        </div>
      )}

      <article
        className={`w-full rounded-lg border-2 p-4 flex flex-col justify-between font-retro text-[11px] ${rarityColors[rarity]}`}
        aria-label={name}
      >
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

        <div className="mb-3 flex-1">
          <p className="text-[12px] leading-tight opacity-90 mb-2">
            {description}
          </p>
          {effect && (
            <div className="border border-blue-400/40 bg-black/10 p-2 rounded text-center text-[12px] mb-2">
              {effect}
            </div>
          )}
        </div>

        <footer className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="9" />
            </svg>
            <span className="text-[14px] font-bold">{price}</span>
          </div>
          <button
            onClick={handleBuy}
            disabled={!canAfford || isPurchased}
            className={`px-3 py-1 border-2 rounded-md font-bold text-[12px] transition
    ${isPurchased
                ? "bg-green-600/80 cursor-default"
                : canAfford
                  ? "bg-blue-700/80 hover:bg-blue-700/100"
                  : "bg-gray-500/50 cursor-not-allowed opacity-50"
              }`}
          >
            {isPurchased
              ? "ADQUIRIDO🎒"
              : canAfford
                ? "COMPRAR"
                : "NO ALCANZA 💸"}
          </button>

        </footer>
      </article>

    </>
  );
};

