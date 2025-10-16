import { StatBox } from './StatBox'
import { ProgressBar } from './ProgressBar'

interface HeaderProps {
    username: string
    level: number
    health: number // valor actual
    maxHealth: number
    experience: number // valor actual
    maxExperience: number
    attack: number
    defense: number
    coins: number
}

export const Header = ({
    username,
    level,
    health,
    maxHealth,
    experience,
    maxExperience,
    attack,
    defense,
    coins,
}: HeaderProps) => (
    <header className="bg-navy text-white p-4 m-4 font-pixel border-2 rounded">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <h1 className="text-sm md:text-lg">HOLA, {username.toUpperCase()}</h1>
            <span className="text-xs md:text-sm">Nivel {level}</span>
        </div>

        <div className="flex gap-4 mt-4">
            <div className="flex gap-4 mt-4">
                <StatBox icon="attack" value={attack} borderColor="border-outline-red" textColor="text-outline-red" />
                <StatBox icon="defense" value={defense} borderColor="border-outline-blue" textColor="text-outline-blue" />
                <StatBox icon="coins" value={coins} borderColor="border-coin-bright" textColor="text-coin-bright" />
            </div>
        </div>

        <div className="mt-4 space-y-2">
            <ProgressBar label="Vida" current={health} max={maxHealth} color="bg-red-500" />
            <ProgressBar label="Experiencia" current={experience} max={maxExperience} color="bg-green-500" />
        </div>
    </header>
)

