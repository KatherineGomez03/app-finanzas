"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

/* =========================
   Utilidades de fecha
   ========================= */
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
   Barra de vida (usa estilos de missions)
   ========================= */
function HPBar({
  label,
  cur,
  max,
  fillClass = "",
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
        <div
          className={`hpbar__fill ${fillClass}`}
          style={{ width: `${pct}%` }}
        />
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

  // Consumibles
  const [potsVida, setPotsVida] = useState<number>(0);
  const [potsVeneno, setPotsVeneno] = useState<number>(0);

  /* ===== Lógica ===== */
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

  // daño aleatorio moderado según el ATK (±20%)
  const roll = (atk: number) => {
    const min = Math.floor(atk * 0.8);
    const max = Math.ceil(atk * 1.2);
    return Math.max(1, Math.floor(Math.random() * (max - min + 1)) + min);
  };

  // enemigo elige una habilidad al azar y calcula el daño
  function enemyStrike() {
    const name =
      enemigo.habilidades[
        Math.floor(Math.random() * enemigo.habilidades.length)
      ] ?? "ataque";
    let dmg = roll(enemigo.atk);
    if (/(mordisco|aliento)/i.test(name)) dmg = Math.round(dmg * 1.15);
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

  /* ===== UI ===== */
  return (
    <section className="mission-section space-y-6">
      {/* Título */}
      <div className="mission-title">✖ ARENA DE COMBATE</div>
      <div className="text-xs opacity-70">
        <span className="badge badge--outline">Beta</span>&nbsp;Enfréntate a los
        enemigos del ahorro y demuestra tu valor
      </div>

      {/* Mensaje de countdown */}
      {!hoyEsBatalla && (
        <div className="text-xs opacity-80">
          Faltan <b>{diasRestantes}</b> día(s) para la batalla (último día del mes).
        </div>
      )}

      {/* Enemigo del mes */}
      <div className="flex items-center justify-between">
        <div className="font-medium">Enemigo del mes</div>
        <span className="badge badge--primary">Nivel {enemigo.nivel}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* yo */}
        <div className="mission-panel">
          <div className="font-medium mb-2">🗡️ {playerBase.nombre ?? "Tú"}</div>
          <HPBar label="VIDA (Tú)" cur={playerHP} max={playerBase.maxHP} fillClass="bg-red-500" />
          <div className="text-xs mt-2">ATK: {playerBase.atk}</div>
        </div>

        {/* Enemigo */}
        <div className="mission-panel">
          <div className="font-medium mb-2">🧟 {enemigo.nombre}</div>
          <HPBar label="VIDA (Enemigo)" cur={bossHP} max={enemigo.maxHP} fillClass="bg-red-500" />
          <div className="text-xs mt-2">ATK: {enemigo.atk}</div>
        </div>
      </div>

      {/* Habilidades y recompensas */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="mission-panel">
          <div className="font-medium mb-2">Habilidades</div>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {enemigo.habilidades.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>

        <div className="mission-panel">
          <div className="font-medium mb-2">Recompensas por victoria</div>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {enemigo.recompensas.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Acciones */}
      <div className="mission-panel">
        <div className="flex items-center justify-between mb-3">
          <div className="font-medium">Acciones</div>
          <span className="badge">
            Turno:&nbsp;{turno === "tú" ? "Tú" : "Enemigo"}
          </span>
        </div>

        {/* Registro arriba de la botonera */}
        <div className="bg-[var(--color-card)] border border-[var(--grid)] rounded-lg p-3 mb-4 max-h-56 overflow-auto">
          <ul className="text-xs space-y-1">
            {log.map((l, i) => (
              <li key={i}>• {l}</li>
            ))}
          </ul>
        </div>

        {/* Botonera con estilos */}
        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={atacar}
            disabled={!hoyEsBatalla || ended || turno !== "tú"}
            className="btn btn--danger"
          >
            ❌ ATACAR
          </button>

          <button
            onClick={usarPocionVida}
            disabled={!hoyEsBatalla || ended || turno !== "tú"}
            className="btn btn--success"
          >
            💚 USAR POCIÓN
          </button>

          <button
            onClick={usarPocionVeneno}
            disabled={!hoyEsBatalla || ended || turno !== "tú"}
            className="btn btn--venom"
          >
            ☠️ VENENO
          </button>

          <button onClick={reset} className="btn btn--ghost md:ml-auto">
            ⟲ REINICIAR
          </button>
        </div>

        {!forced && (
          <div className="text-[10px] opacity-60 mt-3">
            para probar sin esperar fin de mes, abrí Arena con <code>?forceBattle=1</code>.
          </div>
        )}
      </div>
    </section>
  );
}
