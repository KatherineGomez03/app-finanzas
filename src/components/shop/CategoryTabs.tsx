import React from "react";

interface CategoryTabsProps {
    selected: string;
    onSelect: (category: string) => void;
    categories?: string[]; //  pasamos las categorías desde backend??
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
    selected,
    onSelect,
    categories = ["Todos", "Armas", "Armaduras", "Consumibles"],
}) => {
    return (
        <nav className="mb-4">
            <ul className="flex gap-2 flex-wrap font-retro text-[11px]">
                {categories.map((c) => {
                    const active = c === selected;
                    return (
                        <li key={c}>
                            <button
                                onClick={() => onSelect(c)}
                                className={`px-3 py-2 rounded-md border-2 transition-all ${active
                                    ? "bg-blue-600 border-blue-400 text-white"
                                    : "bg-transparent border-gray-700 text-gray-200 hover:bg-gray-800"
                                    }`}
                            >
                                {c.toUpperCase()}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};
