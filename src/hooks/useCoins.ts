import { useState } from 'react';
import { useUserUpdate } from "../context/UserUpdateContext"

export function useUpdateCoins() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<null | string>(null);
    const { triggerUpdate } = useUserUpdate()
    const updateCoins = async (coins: number) => {
        const userId = localStorage.getItem("userid");
        const token = localStorage.getItem('token')

        if (!userId) {
            setError('No se encontró userId en localStorage');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}/coins`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "amount": coins }),
            });

            console.log(coins)
            if (!res.ok) {
                throw new Error(`Error ${res.status}: ${res.statusText}`);
            }
            triggerUpdate()

        } catch (err: unknown) {
            console.error('Falló actualizacion de monedas:', err);
            if (err instanceof Error) setError(err.message)
            else setError(String(err))
        } finally {
            setLoading(false);
        }
    };

    return { updateCoins, loading, error };
}