import { useEffect, useState } from 'react'
import type { HeaderProps } from '../components/header/Header'
import { useUserUpdate } from '../context/UserUpdateContext'

export const useUserStats = () => {
    const [stats, setStats] = useState<HeaderProps | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const { updateFlag } = useUserUpdate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            setError('No hay token')
            setLoading(false)
            return
        }

        setLoading(true)
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                const { username, level, health, maxHealth, experience, maxExperience, attack, defense, coins } = data._doc
                setStats({ username, level, health, maxHealth, experience, maxExperience, attack, defense, coins })
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [updateFlag])

    return { stats, loading, error }
}
