import { Shield, Sword } from 'lucide-react'

export const LoginHeader = () => (
  <div className="flex items-center justify-center gap-2 text-white font-pixel text-sm mb-6">
    <Sword className="w-12 h-12 sm:w-5 sm:h-5 text-blue-400" />
    <h1 className="text-center">Bienvenido aventurero</h1>
    <Shield className="w-12 h-12 sm:w-5 sm:h-5 text-blue-400" />
  </div>
)
