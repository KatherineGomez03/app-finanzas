import { LoginForm } from './LoginForm'
import { LoginHeader } from './LoginHeader'

export const LoginContainer = () => {
    const handleLoginSuccess = (token: string) => {
        localStorage.setItem('access_token', token)
        // Redirigir o mostrar dashboard
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
            <LoginHeader />
            <p className="text-blue-400 font-pixel text-xs mb-4 text-center">ACCESO AL REINO<br />Ingresa tus credenciales de aventurero</p>
            <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
    )
}
