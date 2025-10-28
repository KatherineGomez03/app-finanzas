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
    <div
        className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded bg-opacity-20 ${borderColor} ${textColor} text-xs sm:text-sm`}
    >
        {IconMap[icon]}
        <span>{value}</span>
    </div>


)
