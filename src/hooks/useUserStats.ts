import { useEffect, useState, useCallback } from 'react'
import type { HeaderProps } from '../components/header/Header'
import { useUserUpdate } from '../context/UserUpdateContext'

export const useUserStats = () => {
    const [stats, setStats] = useState<HeaderProps | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const { updateFlag, triggerUpdate } = useUserUpdate()

    const fetchStats = useCallback(async () => {
        const token = localStorage.getItem('token')
        if (!token) {
            setError('No hay token')
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            
            if (!res.ok) {
                throw new Error(`Error al obtener datos: ${res.status} ${res.statusText}`);
            }
            
            const data = await res.json()
            console.log('Datos recibidos:', data); // Para debug
            
            if (!data) {
                throw new Error('No se recibieron datos del servidor');
            }

            // Extraer datos directamente del objeto data
            const { username, level, health, maxHealth, experience, maxExperience, attack, defense, coins } = data
            setStats({ username, level, health, maxHealth, experience, maxExperience, attack, defense, coins })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchStats()
    }, [updateFlag, fetchStats])

    // Escuchar el evento de misión completada
    useEffect(() => {
        const handleChallengeComplete = async (event: Event) => {
            const customEvent = event as CustomEvent<{ reward: { coins: number }, challengeId: string }>;
            console.log('Challenge completed, updating stats...', customEvent.detail);
            
            // Primero actualizamos optimistamente las coins locales
            if (stats) {
                setStats(prev => prev ? {
                    ...prev,
                    coins: prev.coins + customEvent.detail.reward.coins
                } : prev);
            }

            // Luego actualizamos desde el servidor para asegurarnos de tener el estado correcto
            await fetchStats();
        };

        window.addEventListener('challengeCompleted', handleChallengeComplete);

        return () => {
            window.removeEventListener('challengeCompleted', handleChallengeComplete);
        };
    }, [stats, fetchStats]);

    return { stats, loading, error }
}
