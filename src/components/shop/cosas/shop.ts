export type Rarity = "Común" | "Raro" | "Legendario";
export type Category = "Armas" | "Armaduras" | "Consumibles";

export interface ItemCardProps {
    name: string;
    rarity: Rarity;
    description: string;
    effect?: string;
    price: number;
    category: Category;
}
