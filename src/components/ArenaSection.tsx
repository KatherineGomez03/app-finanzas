"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

/* ============ util fechas ============ */
function daysToMonthEnd(d: Date = new Date()) {
  const y = d.getFullYear();
  const m = d.getMonth();
  const last = new Date(y, m + 1, 0);
  const diff = Math.ceil((last.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(diff, 0);
}
function isLastDayOfMonth(d: Date = new Date()) {
  const y = d.getFullYear();
  const m = d.getMonth();
  return d.getDate() === new Date(y, m + 1, 0).getDate();
}

/* ============ data enemigo ============ */
type Enemy = {
  nombre: string;
  nivel: number;
  maxHP: number;
  atk: number;
  habilidades: string[];
  recompensas: string[];
};

const ENEMIGOS_MENSUALES: Record<number, Enemy> = {
  0: {
    nombre: "Zombie Corrupto",
    nivel: 15,
    maxHP: 150,
    atk: 25,
    habilidades: ["Mordisco Tóxico", "Rugido Aterrador"],
    recompensas: ["100 monedas", "50 XP", "Poción de Vida"],
  },
  1: {
    nombre: "Dragón de Fuego",
    nivel: 18,
    maxHP: 220,
    atk: 32,
    habilidades: ["Aliento Ígneo", "Garra Flamígera"],
    recompensas: ["120 monedas", "70 XP", "Fragmento Escama"],
  },
  2: {
    nombre: "Bruja de las Sombras",
    nivel: 20,
    maxHP: 240,
    atk: 34,
    habilidades: ["Maldición", "Brebaje Oscuro"],
    recompensas: ["140 monedas", "90 XP", "Ampolla de Sombras"],
  },
};

/* ============ props ============ */
type ArenaProps = {
  player?: { nombre: string; maxHP: number; atk: number };
};

/* ============ barra HP al estilo misiones ============ */
function HPBar({
  label,
  cur,
  max,
  fillClass = "bg-red-500",
}: {
  label: string;
  cur: number;
  max: number;
  fillClass?: string;
}) {
  const pct = Math.max(0, Math.round((cur / max) * 100));
  return (
    <div>
      <div className="text-xs opacity-80 mb-1">{label}</div>
      <div className="hpbar">
        <div className={`hpbar__fill ${fillClass}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="text-xs opacity-60 mt-1">
        {cur}/{max}
      </div>
    </div>
  );
}

/* ============ arena ============ */
export default function ArenaSection({ player }: ArenaProps = {}) {
  const sp = useSearchParams();
  const forced = sp.get("forceBattle") === "1";

  const playerBase = player ?? { nombre: "Tú", maxHP: 120, atk: 30 };

  const hoy = new Date();
  const mes = hoy.getMonth();
  const enemigo = useMemo<Enemy>(() => ENEMIGOS_MENSUALES[mes] ?? ENEMIGOS_MENSUALES[0], [mes]);

  const diasRestantes = daysToMonthEnd(hoy);
  const hoyEsBatalla = forced || isLastDayOfMonth(hoy);

  const [playerHP, setPlayerHP] = useState<number>(playerBase.maxHP);
  const [bossHP, setBossHP] = useState<number>(enemigo.maxHP);
  const [turno, setTurno] = useState<"tú" | "enemigo">("tú");
  const [log, setLog] = useState<string[]>([]);
  const [ended, setEnded] = useState<boolean>(false);

  const [potsVida, setPotsVida] = useState<number>(0);
  const [potsVeneno, setPotsVeneno] = useState<number>(0);

  const appendLog = (line: string) => setLog((l) => [line, ...l].slice(0, 120));
  const reset = () => {
    setPlayerHP(playerBase.maxHP);
    setBossHP(enemigo.maxHP);
    setTurno("tú");
    setEnded(false);
    setLog([]);
  };

  const roll = (atk: number) => {
    const min = Math.floor(atk * 0.8);
    const max = Math.ceil(atk * 1.2);
    return Math.max(1, Math.floor(Math.random() * (max - min + 1)) + min);
  };

  function enemyStrike() {
    const name = enemigo.habilidades[Math.floor(Math.random() * enemigo.habilidades.length)] ?? "ataque";
    let dmg = roll(enemigo.atk);
    if (/(mordisco|aliento)/i.test(name)) dmg = Math.round(dmg * 1.15);
    return { name, dmg };
  }

  function turnoEnemigo(postHPActual: number) {
    setTurno("enemigo");
    setTimeout(() => {
      const { name, dmg } = enemyStrike();
      const nextPlayer = Math.max(0, postHPActual - dmg);
      setPlayerHP(nextPlayer);
      appendLog(`💥 ${enemigo.nombre} usa ${name} y golpea por ${dmg}`);
      if (nextPlayer <= 0) {
        setEnded(true);
        appendLog("💀 Has sido derrotado…");
      } else {
        setTurno("tú");
      }
    }, 300);
  }

  function atacar() {
    if (!hoyEsBatalla || ended || turno !== "tú") return;
    const dmg = roll(playerBase.atk);
    const nextBoss = Math.max(0, bossHP - dmg);
    setBossHP(nextBoss);
    appendLog(`🗡️ Tú golpeas por ${dmg}`);
    if (nextBoss <= 0) {
      setEnded(true);
      appendLog("🎉 ¡Victoria! Recompensas: " + enemigo.recompensas.join(", "));
      return;
    }
    turnoEnemigo(playerHP);
  }

  function usarPocionVida() {
    if (!hoyEsBatalla || ended || turno !== "tú") return;
    if (potsVida <= 0) return appendLog("⚠️ No tienes pociones de vida.");
    const heal = 25;
    const next = Math.min(playerBase.maxHP, playerHP + heal);
    setPlayerHP(next);
    setPotsVida((p) => p - 1);
    appendLog(`🧪 Usas Poción de Vida (+${heal})`);
    turnoEnemigo(next);
  }

  function usarPocionVeneno() {
    if (!hoyEsBatalla || ended || turno !== "tú") return;
    if (potsVeneno <= 0) return appendLog("⚠️ No tienes pociones de veneno.");
    const poison = 18;
    const nextBoss = Math.max(0, bossHP - poison);
    setBossHP(nextBoss);
    setPotsVeneno((p) => p - 1);
    appendLog(`☠️ Usas Veneno (-${poison} HP enemigo)`);
    if (nextBoss <= 0) {
      setEnded(true);
      appendLog("🎉 ¡Victoria! Recompensas: " + enemigo.recompensas.join(", "));
      return;
    }
    turnoEnemigo(playerHP);
  }

  return (
    <section className="mission-section space-y-6">
      {/* Título */}
      <div className="mission-title">✖ ARENA DE COMBATE</div>
      <div className="text-xs opacity-70">
        <span className="badge badge-outline">Beta</span>
        &nbsp;Enfréntate a los enemigos del ahorro y demuestra tu valor
      </div>

      {/* Countdown */}
      {!hoyEsBatalla && (
        <div className="text-xs opacity-80">
          Faltan <b>{diasRestantes}</b> día(s) para la batalla (último día del mes).
        </div>
      )}

      {/* Enemigo del mes */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="mission-title">Enemigo del mes</h3>
        <span className="badge badge-primary">Nivel {enemigo.nivel}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* usuario */}
        <div className="mission-panel">
        <div className="font-medium mb-2">🗡️ {playerBase.nombre ?? "Tú"}</div>
        <div className="text-xs opacity-80 mb-1">VIDA (Tú)</div>
        <div className="hpbar"><div className="hpbar__fill" style={{width: `${Math.round(playerHP/playerBase.maxHP*100)}%`}} /></div>
        <div className="text-xs opacity-60 mt-1">{playerHP}/{playerBase.maxHP}</div>
        <div className="text-xs mt-2">ATK: {playerBase.atk}</div>
      </div>

        {/* Enemigo */}
        <div className="mission-panel">
          <div className="font-medium mb-2">🧟 {enemigo.nombre}</div>
          <div className="text-xs opacity-80 mb-1">VIDA (Enemigo)</div>
          <div className="hpbar"><div className="hpbar__fill" style={{width: `${Math.round(bossHP/enemigo.maxHP*100)}%`}} /></div>
          <div className="text-xs opacity-60 mt-1">{bossHP}/{enemigo.maxHP}</div>
          <div className="text-xs mt-2">ATK: {enemigo.atk}</div>
        </div>
      </div>

      {/* Habilidades / Recompensas */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="mission-panel">
          <div className="font-medium mb-2">Habilidades</div>
          <ul className="mission-list list-disc list-inside space-y-1 text-sm">
            {enemigo.habilidades.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>

        <div className="mission-panel">
          <div className="font-medium mb-2">Recompensas por victoria</div>
          <ul className="mission-list list-disc list-inside space-y-1 text-sm">
            {enemigo.recompensas.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Acciones */}
      <div className="mission-panel">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Acciones</h4>
          <span className="text-xs opacity-70">Turno: {turno === "tú" ? "Tú" : "Enemigo"}</span>
        </div>

        <div className="rounded-lg border-2 border-[var(--grid)] bg-black/20 p-3 mb-3 max-h-48 overflow-auto">
          <ul className="text-xs space-y-1">
            {log.map((l, i) => (
              <li key={i}>• {l}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={atacar}
            disabled={!hoyEsBatalla || ended || turno !== "tú"}
            className="badge bg-red-600 text-white hover:opacity-90 px-5 py-3 rounded-xl border-2 border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ❌ ATACAR
          </button>

          <button
            onClick={usarPocionVida}
            disabled={!hoyEsBatalla || ended || turno !== "tú"}
            className="badge bg-emerald-600 text-white hover:opacity-90 px-5 py-3 rounded-xl border-2 border-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💚 USAR POCIÓN
          </button>

          <button
            onClick={usarPocionVeneno}
            disabled={!hoyEsBatalla || ended || turno !== "tú"}
            className="badge bg-purple-600 text-white hover:opacity-90 px-5 py-3 rounded-xl border-2 border-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ☠️ VENENO
          </button>

          <button
            onClick={reset}
            className="badge px-5 py-3 rounded-xl border-2 border-slate-400 bg-slate-800 text-white md:ml-auto hover:opacity-90"
          >
            ⟲ REINICIAR
          </button>
        </div>

        {!forced && (
          <div className="text-[10px] opacity-60 mt-3">
            para probar sin esperar fin de mes, abrí Arena con <code>?forceBattle=1</code>
          </div>
        )}
      </div>
    </section>
  );
}
