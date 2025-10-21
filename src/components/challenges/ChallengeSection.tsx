"use client";
import { Trophy, Target, Coffee, Car, Utensils, Calendar } from "lucide-react";
import { Badge } from "./Badge";
import { ChallengeCard } from "./ChallengeCard";


interface Challenge {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  progress: number;
  total: number;
  reward: string;
  status: "activo" | "completo"; 
}

const challenges: Challenge[] = [
  {
    id: 1,
    title: "Café Consciente",
    description: "No compres café fuera durante 7 días.",
    icon: Coffee,
    progress: 5,
    total: 7,
    reward: "25 monedas + Poción de Energía",
    status: "activo",
  },
  {
    id: 2,
    title: "Transporte Inteligente",
    description: "Usa transporte público o camina 5 veces esta semana.",
    icon: Car,
    progress: 3,
    total: 5,
    reward: "40 monedas + Botas de Velocidad",
    status: "activo",
  },
  {
    id: 3,
    title: "Chef Casero",
    description: "Cocina en casa 10 comidas este mes.",
    icon: Utensils,
    progress: 10,
    total: 10,
    reward: "60 monedas + Poción de Vida",
    status: "completo",
  },
  {
    id: 4,
    title: "Presupuesto Mensual",
    description: "Mantente dentro del presupuesto durante todo el mes.",
    icon: Calendar,
    progress: 22,
    total: 30,
    reward: "100 monedas + Espada de Hierro",
    status: "activo",
  },
  {
    id: 5,
    title: "Maestro del Registro",
    description: "Registra tus gastos durante 15 días consecutivos.",
    icon: Target,
    progress: 12,
    total: 15,
    reward: "75 monedas + Escudo Mágico",
    status: "activo",
  },
  {
    id: 6,
    title: "Semana Sin Delivery",
    description: "Evita pedir comida a domicilio durante 5 días.",
    icon: Utensils,
    progress: 4,
    total: 5,
    reward: "30 monedas + Ración de Energía",
    status: "activo",
  },
  {
    id: 7,
    title: "Ahorro Express",
    description: "Ahorra al menos $500 en una semana.",
    icon: Target,
    progress: 1,
    total: 1,
    reward: "80 monedas + Bolsa de Oro",
    status: "completo",
  },
  {
    id: 8,
    title: "Camina Más",
    description: "Camina un total de 20 kilómetros este mes.",
    icon: Car,
    progress: 8,
    total: 20,
    reward: "50 monedas + Zapatillas Legendarias",
    status: "activo",
  },
  {
    id: 9,
    title: "Comprador Inteligente",
    description: "Compara precios antes de realizar 3 compras grandes.",
    icon: Coffee,
    progress: 2,
    total: 3,
    reward: "45 monedas + Gafas del Ahorro",
    status: "activo",
  },
  {
    id: 10,
    title: "Semana Zen",
    description: "Evita gastos impulsivos durante 7 días.",
    icon: Calendar,
    progress: 6,
    total: 7,
    reward: "90 monedas + Amuleto de Calma",
    status: "activo",
  },
];


export function ChallengeSection() {
  // filtra las misiones segun su estado
  const active = challenges.filter((c) => c.status === "activo");
  const completed = challenges.filter((c) => c.status === "completo");

  return (
    <div className="space-y-6 px-2 md:px-4 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-mission-primary flex items-center gap-2 text-sm md:text-base">
          <Target className="h-5 w-5" />
          MISIONES ACTIVAS
        </h2>
        <Badge className="bg-mission-primary border border-mission-primary text-xs text-center">
          {active.length} EN PROGRESO
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {active.map((c) => (
          <ChallengeCard key={c.id} {...c} />
        ))}
      </div>


      {completed.length > 0 && (
        <>
          <div className="flex items-center justify-between mt-8">
            <h2 className="text-mission-success flex items-center gap-2 text-sm md:text-base">
              <Trophy className="h-5 w-5 text-mission-success"/>
               MISIONES COMPLETAS
            </h2>
            <Badge className="bg-mission-success border border-mission-success text-xs text-center">
              {completed.length} COMPLETAS
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completed.map((c) => (
              <ChallengeCard key={c.id} {...c} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
