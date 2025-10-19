'use client'

import { LoginForm } from '@/components/login/LoginForm'
import { LoginHeader } from '@/components/login/LoginHeader'
import { RegisterContainer } from '@/components/login/RegisterContainer'
import { useState } from 'react'
export default function AuthPage() {
    const [view, setView] = useState<'login' | 'register'>('login')

    const handleLoginSuccess = (token: string) => {
        localStorage.setItem('access_token', token)
        // Redirigir o mostrar dashboard
    }

    return (
        <main className="min-h-screen text-white font-pixel px-4 py-8 flex flex-col items-center justify-center">
            <div className='border-2 rounded p-4 m-4'>
                <LoginHeader />

                {view === 'login' ? (
                    <>
                        <p className=" text-xs mb-4 text-center">
                            ACCESO AL REINO<br />Ingresa tus credenciales de aventurero
                        </p>
                        <LoginForm onLoginSuccess={handleLoginSuccess} />
                        <button
                            onClick={() => setView('register')}
                            className="mt-6 underline text-xs"
                        >
                            ¿Nuevo aventurero? Registrarse
                        </button>
                    </>
                ) : (
                    <>
                        <RegisterContainer />
                        <button
                            onClick={() => setView('login')}
                            className="mt-6 underline text-xs"
                        >
                            ¿Ya tienes cuenta? Iniciar sesión
                        </button>
                    </>
                )}
            </div>
        </main>
    )
}

