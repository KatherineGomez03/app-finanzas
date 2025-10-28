import { useState } from 'react';
import { useUserUpdate } from "../context/UserUpdateContext"

export function useUploadExperience() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<null | string>(null);
    const { triggerUpdate } = useUserUpdate()
    const uploadExperience = async (experience: number) => {
        const userId = localStorage.getItem("userid");
        const token = localStorage.getItem('token')
        console.log(userId)
        if (!userId) {
            setError('No se encontró userId en localStorage');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}/experience`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "experience": experience }),
            });

            if (!res.ok) {
                throw new Error(`Error ${res.status}: ${res.statusText}`);
            }
            triggerUpdate()
            console.log(`Experiencia subida con éxito (+${experience} XP)`);
        } catch (err: unknown) {
            console.error('Falló la subida de experiencia:', err);
            if (err instanceof Error) setError(err.message)
            else setError(String(err))
        } finally {
            setLoading(false);
        }
    };

    return { uploadExperience, loading, error };
}
