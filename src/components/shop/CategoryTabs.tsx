import { FC } from "react";

interface CategoryTabsProps {
    selected: string;
    onSelect: (category: string) => void;
}

export const CategoryTabs: FC<CategoryTabsProps> = ({ selected, onSelect }) => {
    const categories = ["Todos", "Armas", "Armaduras", "Consumibles"];
    return (
        <div className="flex justify-start gap-4 mb-4">
            {categories.map(cat => (
                <button
                    key={cat}
                    className={`tab font-press px-2 py-1 ${selected === cat ? "tab-active" : ""}`}
                    onClick={() => onSelect(cat)}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};
