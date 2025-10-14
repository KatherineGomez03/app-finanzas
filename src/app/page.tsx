"use client";

import Link from "next/link";
import { useGame } from "@/lib/game-store";

export default function Home() {
  return (
    <div className="space-y-4">
      <HeaderHero />
      <NavTabs />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Distribución de Gastos">
          <p className="text-sm opacity-70">lugar donde va el gráfico — (luego lo pasamos del Dashboard).</p>
        </Card>
        <Card title="Meta de Ahorro Mensual">
          <p className="text-sm opacity-70">lugar de la meta — progreso, días restantes.</p>
        </Card>
      </div>
    </div>
  );
}

function HeaderHero() {
  const { player } = useGame();
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-12 grid place-items-center rounded-full" style={{ background: "var(--grid)" }}>AM</div>
          <div>
            <div className="text-lg">¡Hola, Alex Martínez!</div>
            <div className="mt-1 flex gap-2 text-xs">
              <span className="badge" style={{ background:"var(--accent)", color:"#0b1220" }}>Nivel 14 · Veterano</span>
              <span className="badge" style={{ borderColor:"var(--danger)", color:"var(--danger)" }}>❤️ VIDA 120/120</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl">💰 {player.monedas}</div>
          <div className="text-xs opacity-70">monedas</div>
          <div className="mt-2 text-xs" style={{ color:"var(--success)" }}>⭐ EXP 2150 XP</div>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <Link href="/gastos" className="btn btn-primary">+ Registrar gasto</Link>
      </div>
    </div>
  );
}

function NavTabs() {
  const tabs = [
    { href: "/", label: "Panel" },
    { href: "/misiones", label: "Misiones" },
    { href: "/tienda", label: "Tienda" },
    { href: "/inventario", label: "Inventario" },
    { href: "/arena", label: "Arena" },
    { href: "/gastos", label: "Historial" },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map(t => (
        <Link key={t.href} href={t.href} className="btn" style={{ background:"#192235" }}>
          {t.label}
        </Link>
      ))}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-4">
      <h3 className="font-medium mb-2 uppercase tracking-wide">{title}</h3>
      {children}
    </div>
  );
}
