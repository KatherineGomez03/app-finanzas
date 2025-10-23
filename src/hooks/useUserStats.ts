import { useEffect, useState } from 'react'
import type { HeaderProps } from '../components/header/Header'


export const useUserStats = () => {
    const [stats, setStats] = useState<HeaderProps | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            setError('No hay token')
            setLoading(false)
            return
        }

        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                const {
                    username,
                    level,
                    health,
                    maxHealth,
                    experience,
                    maxExperience,
                    attack,
                    defense,
                    coins,
                } = data._doc
                setStats({
                    username,
                    level,
                    health,
                    maxHealth,
                    experience,
                    maxExperience,
                    attack,
                    defense,
                    coins,
                })
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [])

    return { stats, loading, error }
}
