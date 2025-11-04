import { ItemCardProps } from "@/components/shop/cosas/shop";
import { useEffect, useState } from "react";


export function useItems() {
    const [items, setItems] = useState<ItemCardProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No se encontró el token");
                }

                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/items`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error(`Error ${res.status}: ${res.statusText}`);
                }

                const data = await res.json();
                setItems(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error al obtener los items");
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    return { items, loading, error };
}
