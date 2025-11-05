import { useUserInventory } from "@/hooks/useUserInventory";
import { EquipCard } from "./equipCard";

export default function EquipContainer() {
    const { items, loading, error } = useUserInventory();

    if (loading) return <p>Cargando inventario...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
                <EquipCard key={item.id} {...item} />
            ))}
        </section>
    );
}
