"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

/* =========================
   Utilidades de fecha
   ========================= */
function daysToMonthEnd(d: Date = new Date()) {
  const y = d.getFullYear();
  const m = d.getMonth();
  const last = new Date(y, m + 1, 0); // último día del mes
  const diff = Math.ceil((last.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(diff, 0);
}

function isLastDayOfMonth(d: Date = new Date()) {
  const y = d.getFullYear();
  const m = d.getMonth();
  return d.getDate() === new Date(y, m + 1, 0).getDate();
}

/* =========================
   Enemigos fijos por mes
   ========================= */
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

/* =========================
   Props (opcional player)
   ========================= */
type ArenaProps = {
  player?: {
    nombre: string;
    maxHP: number;
    atk: number;
  };
};

/* =========================
   UI helpers
   ========================= */
function Bar({
  title,
  cur,
  max,
  color = "bg-red-500",
}: {
  title: string;
  cur: number;
  max: number;
  color?: string;
}) {
  const pct = Math.max(0, Math.round((cur / max) * 100));
  return (
    <div className="p-3 rounded bg-[var(--surface)]">
      <div className="text-xs opacity-80 mb-1">{title}</div>
      <div className="h-3 w-full rounded bg-black/40 overflow-hidden">
        <div className={`h-3 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="text-xs opacity-60 mt-1">
        {cur}/{max}
      </div>
    </div>
  );
}

/* =========================
   Componente principal
   ========================= */
export default function ArenaSection({ player }: ArenaProps = {}) {
  const sp = useSearchParams();
  const forced = sp.get("forceBattle") === "1";

  const playerBase = player ?? { nombre: "Tú", maxHP: 120, atk: 30 };

  // enemigo del mes
  const hoy = new Date();
  const mes = hoy.getMonth();
  const enemigo = useMemo<Enemy>(
    () => ENEMIGOS_MENSUALES[mes] ?? ENEMIGOS_MENSUALES[0],
    [mes]
  );

  // Countdown y habilitación de batalla
  const diasRestantes = daysToMonthEnd(hoy);
  const hoyEsUltimoDia = isLastDayOfMonth(hoy);
  const hoyEsBatalla: boolean = forced || hoyEsUltimoDia;

  // Estado de batalla
  const [playerHP, setPlayerHP] = useState<number>(playerBase.maxHP);
  const [bossHP, setBossHP] = useState<number>(enemigo.maxHP);
  const [turno, setTurno] = useState<"tú" | "enemigo">("tú");
  const [log, setLog] = useState<string[]>([]);
  const [ended, setEnded] = useState<boolean>(false);

  // Consumibles (simples)
  const [potsVida, setPotsVida] = useState<number>(0);
  const [potsVeneno, setPotsVeneno] = useState<number>(0);

  /* ============
     Lógica
     ============ */
  function appendLog(line: string) {
    setLog((l) => [line, ...l].slice(0, 120));
  }

  function reset() {
    setPlayerHP(playerBase.maxHP);
    setBossHP(enemigo.maxHP);
    setTurno("tú");
    setEnded(false);
    setLog([]);
  }

  function start() {
    if (!hoyEsBatalla) {
      appendLog("⚠️ La batalla solo está disponible el último día del mes.");
      return;
    }
    if (ended) {
      appendLog("✔️ Batalla reiniciada.");
      reset();
      return;
    }
    appendLog("⚔️ ¡La batalla comienza!");
  }

  // daño aleatorio moderado según el ATK (±20%)
  const roll = (atk: number) => {
    const min = Math.floor(atk * 0.8);
    const max = Math.ceil(atk * 1.2);
    return Math.max(1, Math.floor(Math.random() * (max - min + 1)) + min);
  };

  // enemigo elige una habilidad al azar y calcula daño
  function enemyStrike() {
    const name =
      enemigo.habilidades[
        Math.floor(Math.random() * enemigo.habilidades.length)
      ] ?? "ataque";
    let dmg = roll(enemigo.atk);
    if (/(mordisco|aliento)/i.test(name)) dmg = Math.round(dmg * 1.15); // un toque de variedad
    return { name, dmg };
  }

  function turnoEnemigo(postHPActual: number) {
    setTurno("enemigo");
    setTimeout(() => {
      const { name, dmg: edmg } = enemyStrike();
      const nextPlayer = Math.max(0, postHPActual - edmg);
      setPlayerHP(nextPlayer);
      appendLog(`💥 ${enemigo.nombre} usa ${name} y golpea por ${edmg}`);
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
    if (potsVida <= 0) {
      appendLog("⚠️ No tienes pociones de vida.");
      return;
    }
    const heal = 25;
    const next = Math.min(playerBase.maxHP, playerHP + heal);
    setPlayerHP(next);
    setPotsVida((p) => p - 1);
    appendLog(`🧪 Usas Poción de Vida (+${heal})`);

    turnoEnemigo(next);
  }

  function usarPocionVeneno() {
    if (!hoyEsBatalla || ended || turno !== "tú") return;
    if (potsVeneno <= 0) {
      appendLog("⚠️ No tienes pociones de veneno.");
      return;
    }
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

  /* ============
     UI
     ============ */
  return (
    <div className="space-y-8">
      {/* Título / subtítulo */}
      <div>
        <h2 className="text-lg opacity-70">✖ ARENA DE COMBATE</h2>
        <div className="text-xs opacity-60">
          Enfréntate a los enemigos del ahorro y demuestra tu valor
        </div>
      </div>

      {/* Mensaje de countdown */}
      {!hoyEsBatalla && (
        <div className="mt-2 text-xs opacity-80">
          Faltan <b>{diasRestantes}</b> día(s) para la batalla (último día del mes).
        </div>
      )}

      {/* Enemigo del mes */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Enemigo del mes</h3>
          <span className="opacity-70">Nivel {enemigo.nivel}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Tú */}
          <div className="card p-4">
            <h4 className="font-medium">🗡️ Maximiliano Guerra</h4>
            <Bar title="VIDA (Tú)" cur={playerHP} max={playerBase.maxHP} color="bg-red-500" />
            <div className="text-xs mt-2">ATK: {playerBase.atk}</div>
          </div>

          {/* Enemigo */}
          <div className="card p-4">
            <h4 className="font-medium">🧟 {enemigo.nombre}</h4>
            <Bar title="VIDA (Enemigo)" cur={bossHP} max={enemigo.maxHP} color="bg-red-500" />
            <div className="text-xs mt-2">ATK: {enemigo.atk}</div>
          </div>
        </div>

        {/* Habilidades y recompensas */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="card p-3 bg-[var(--surface)] rounded border border-[var(--grid)]">
            <div className="font-medium mb-2">Habilidades</div>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {enemigo.habilidades.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>

          <div className="card p-3 bg-[var(--surface)] rounded border border-[var(--grid)]">
            <div className="font-medium mb-2">Recompensas por victoria</div>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {enemigo.recompensas.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="card p-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Acciones</h3>
          <span className="text-xs opacity-70">
            Turno: {turno === "tú" ? "Tú" : "Enemigo"}
          </span>
        </div>

        {/* Registro arriba de la botonera */}
        <div className="bg-[var(--surface)] border border-[var(--grid)] rounded-lg p-3 mb-4 max-h-56 overflow-auto">
          <ul className="text-xs space-y-1">
            {log.map((l, i) => (
              <li key={i}>• {l}</li>
            ))}
          </ul>
        </div>

        {/* Botonera – Atacar → Vida → Veneno → Reiniciar */}
        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={atacar}
            disabled={!hoyEsBatalla || ended || turno !== "tú"}
            className="inline-flex items-center justify-center rounded-xl border-2 border-red-300 bg-red-600 hover:bg-red-700 text-white px-6 py-3 font-semibold tracking-wide shadow-[0_2px_0_#000] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ❌ ATACAR
          </button>

          <button
            onClick={usarPocionVida}
            disabled={!hoyEsBatalla || ended || turno !== "tú"}
            className="inline-flex items-center justify-center rounded-xl border-2 border-emerald-300 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 font-semibold tracking-wide shadow-[0_2px_0_#000] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💚 USAR POCIÓN
          </button>

          <button
            onClick={usarPocionVeneno}
            disabled={!hoyEsBatalla || ended || turno !== "tú"}
            className="inline-flex items-center justify-center rounded-xl border-2 border-purple-300 bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 font-semibold tracking-wide shadow-[0_2px_0_#000] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ☠️ VENENO
          </button>

          <button
            onClick={reset}
            className="inline-flex items-center justify-center md:ml-auto rounded-xl border-2 border-slate-400 bg-slate-800 hover:bg-slate-700 text-white px-5 py-3 font-semibold tracking-wide shadow-[0_2px_0_#000] transition"
          >
            ⟲ REINICIAR
          </button>
        </div>

        {/* Tips para testear sin esperar fin de mes */}
        {!forced && (
          <div className="text-[10px] opacity-60 mt-3">
          </div>
        )}
      </div>
    </div>
  );
}
