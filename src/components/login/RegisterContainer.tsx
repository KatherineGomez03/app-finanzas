import { useState } from 'react'
import { UserPlus } from 'lucide-react'

export const RegisterContainer = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validatePassword = (pwd: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
    return regex.test(pwd)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    if (!validatePassword(form.password)) {
      setError('La contraseña no cumple los requisitos.')
      return
    }

    try {
      const formSolito = {
        "email": form.email,
        "firstName": form.firstName,
        "lastName": form.lastName,
        "password": form.password,
        "username": form.username
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formSolito),
      })

      console.log(form)
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error al registrar')

      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xs mx-auto text-white text-xs">
      <p className="text-green-400 font-pixel text-center mb-4">
        NUEVO AVENTURERO<br />Crea tu cuenta y comienza tu aventura financiera
      </p>

      {['firstName', 'lastName', 'username', 'email'].map(field => (
        <label key={field} className="flex flex-col gap-1">
          <span className="text-green-300 uppercase">{field === 'firstName' ? 'Nombre' : field === 'lastName' ? 'Apellido' : field === 'username' ? 'Username' : 'Email'}</span>
          <input
            type={field === 'email' ? 'email' : 'text'}
            name={field}
            value={form[field as keyof typeof form]}
            onChange={handleChange}
            className="border px-2 py-1 text-white placeholder:text-gray-500"
            required
          />
        </label>
      ))}

      <label className="flex flex-col gap-1">
        <span className="text-green-300 uppercase">Contraseña</span>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="border px-2 py-1 text-white"
          required
        />
        <span className="text-[10px] text-gray-400">
          Mín. 8 caracteres, 1 mayúscula, 1 minúscula, 1 número, 1 símbolo
        </span>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-green-300 uppercase">Confirmar Contraseña</span>
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          className="border px-2 py-1 text-white"
          required
        />
      </label>

      {error && <p className="text-red-400 text-center">{error}</p>}
      {success && <p className="text-green-400 text-center">{success}</p>}

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 flex items-center justify-center gap-2"
      >
        <UserPlus className="w-4 h-4" />
        REGISTRAR
      </button>
    </form>
  )
}
