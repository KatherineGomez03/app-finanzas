import { useState } from 'react'
import { Eye, EyeOff, LogIn } from 'lucide-react'

type LoginFormProps = {
    onLoginSuccess?: (token: string) => void
}

export const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Error de inicio de sesión')

            localStorage.setItem('token', data.access_token)
            localStorage.setItem('userid', data.user._id) //me guardo el id
            // Si la página que usa el componente pasa onLoginSuccess, la llamamos (mejor para tests/SSR-safe flows).
            if (onLoginSuccess) {
                onLoginSuccess(data.access_token)
            } else {
                // Fallback a navegación tradicional en cliente
                if (typeof window !== 'undefined') window.location.href = '/home'
            }
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message)
            else setError(String(err))
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

            <label className="flex flex-col gap-1 relative">
                <span className="text-blue-300">CONTRASEÑA SECRETA</span>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="border border-blue-500 px-2 py-1 pr-10 text-white w-full rounded"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-100 cursor-pointer"
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </label>

            {error && <p className="text-red-400 text-center">{error}</p>}

            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 flex items-center justify-center gap-2 cursor-pointer"
            >
                <LogIn className="w-4 h-4" />
                ENTRAR AL REINO
            </button>
        </form>
    )
}
