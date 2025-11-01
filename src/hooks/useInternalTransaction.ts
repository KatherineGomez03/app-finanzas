import { useState } from "react";

export function useInternalTransaction() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createTransaction = async (itemId: string, totalAmount: number) => {
        const userId = localStorage.getItem("userid");
        const token = localStorage.getItem('token')

        if (!userId) {
            setError('No se encontró userId en localStorage');
            return;
        }

        setLoading(true);
        setError(null);

        try {

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/internaltransaction`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    itemId,
                    totalAmount,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Error al realizar la transacción");
            }

            return data;
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message)
            console.error("Error en la transacción interna:", err);
        } finally {
            setLoading(false);
        }
    };

    return { createTransaction, loading, error };
}
