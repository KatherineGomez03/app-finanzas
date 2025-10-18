import { useState } from 'react'
import { LogIn } from 'lucide-react'

interface LoginFormProps {
    onLoginSuccess: (token: string) => void
}

export const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        try {
            const res = await fetch(`${process.env.BACKEND_PORT}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Error de inicio de sesión')

            onLoginSuccess(data.access_token)
        } catch (err: any) {
            setError(err.message)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xs mx-auto text-white font-pixel text-xs">
            <label className="flex flex-col gap-1">
                <span className="text-blue-300">EMAIL DEL AVENTURERO</span>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="border border-blue-500 px-2 py-1 text-white placeholder:text-gray-500"
                    placeholder="aventurero@financequest.com"
                    required
                />
            </label>

            <label className="flex flex-col gap-1">
                <span className="text-blue-300">CONTRASEÑA SECRETA</span>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="border border-blue-500 px-2 py-1 text-white"
                    required
                />
            </label>

            {error && <p className="text-red-400 text-center">{error}</p>}

            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 flex items-center justify-center gap-2"
            >
                <LogIn className="w-4 h-4" />
                ENTRAR AL REINO
            </button>
        </form>
    )
}
