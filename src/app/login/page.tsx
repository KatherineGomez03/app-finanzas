'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/login/LoginForm'
import { LoginHeader } from '@/components/login/LoginHeader'
import { RegisterContainer } from '@/components/login/RegisterContainer'

export default function AuthPage() {
  const router = useRouter()
  const [view, setView] = useState<'login' | 'register'>('login')

  // Si ya hay sesión mandamos al Home
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    if (token) router.replace('/home')
  }, [router])

  const handleLoginSuccess = (token: string) => {
    // Guardamos el token
    localStorage.setItem('access_token', token)
    // Redirigimos al Home 
    router.push('/home')
  }

  return (
    <main className="min-h-screen text-white font-pixel px-4 py-8 flex flex-col items-center justify-center">
      <div className="border-2 rounded p-4 m-4 w-full max-w-md">
        <LoginHeader />

        {view === 'login' ? (
          <>
            <p className="text-sm mb-4 text-center">
              ACCESO AL REINO<br />Ingresa tus credenciales de aventurero
            </p>

            {/* Mantiene tu LoginForm tal cual; sólo le pasamos el callback */}
            <LoginForm onLoginSuccess={handleLoginSuccess} />

            <button
              onClick={() => setView('register')}
              className="mt-6 underline text-xs w-full text-center"
              type="button"
            >
              ¿Nuevo aventurero? Registrarse
            </button>
          </>
        ) : (
          <>
            <RegisterContainer />

            <button
              onClick={() => setView('login')}
              className="mt-6 underline text-xs w-full text-center"
              type="button"
            >
              ¿Ya tienes cuenta? Iniciar sesión
            </button>
          </>
        )}
      </div>
    </main>
  )
}

