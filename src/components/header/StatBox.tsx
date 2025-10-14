import { Sword, Shield, Coins } from 'lucide-react'

interface StatBoxProps {
    icon: 'attack' | 'defense' | 'coins'
    value: number
    borderColor: string
    textColor: string
}

const IconMap = {
    attack: <Sword size={16} strokeWidth={2} />,
    defense: <Shield size={16} strokeWidth={2} />,
    coins: <Coins size={16} strokeWidth={2} />,
}

export const StatBox = ({ icon, value, borderColor, textColor }: StatBoxProps) => (
    <div className={`flex items-center gap-2 px-3 py-2 rounded bg-opacity-20 ${borderColor} ${textColor}`}>
        {IconMap[icon]}
        <span className="text-sm">{value}</span>
    </div>
)
