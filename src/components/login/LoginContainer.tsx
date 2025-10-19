import { LoginForm } from './LoginForm'
import { LoginHeader } from './LoginHeader'

export const LoginContainer = () => {
    const handleLoginSuccess = (token: string) => {
        localStorage.setItem('access_token', token)
        // Redirigir o mostrar dashboard
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center border-2 border-blue-400 px-4 py-8">
            <LoginHeader />
            <h2 className="text-blue-400 font-pixel text-sm md:text-lg text-center">ACCESO AL REINO<br />Ingresa tus credenciales de aventurero</h2>
            <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
    )
}
