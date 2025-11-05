import { ItemCardProps } from "@/components/shop/cosas/shop";
import { useEffect, useState } from "react";

interface Transaction {
    _id: string;
    userId: string | { _id: string };
    itemId: ItemCardProps;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
}

export function useUserInventory() {
    const [items, setItems] = useState<ItemCardProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const userId = localStorage.getItem("userid");
                const token = localStorage.getItem("token");

                if (!userId || !token) {
                    throw new Error("Faltan credenciales (userId o token)");
                }

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/internaltransaction/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error(`Error ${res.status}: ${res.statusText}`);
                }

                const data: Transaction[] = await res.json();

                // extrae los itemId de cada transacción
                const extractedItems = data.map((t) => t.itemId);

                setItems(extractedItems);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error desconocido");
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, []);

    return { items, loading, error };
}
