"use client";

import { useMemo, useState } from "react";

/* ──────────────────────────────
   Utils
──────────────────────────────── */

function daysUntilMonthEnd() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const lastDay = new Date(y, m + 1, 0);
  const diff = Math.ceil((lastDay.getTime() - new Date(y, m, now.getDate()).getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(diff, 0);
}

type EnemyDef = {
  nombre: string;
  nivel: number;
  hp: number;
  atk: number;
  icon?: string;
  habilidades?: string[];
  recompensas?: string[];
};

// Un enemigo fijo por mes
const ENEMIGOS_MENSUALES: EnemyDef[] = [
  { nombre: "Zombie Corrupto", nivel: 15, hp: 150, atk: 25, icon: "🧟", habilidades: ["Mordisco Tóxico", "Rugido Aterrador"], recompensas: ["100 monedas", "50 XP", "Poción de Vida"] },
  { nombre: "Dragón de Fuego", nivel: 18, hp: 200, atk: 35, icon: "🐲", habilidades: ["Llama Infernal", "Ala Cortante"], recompensas: ["150 monedas", "75 XP", "Fragmento Dragón"] },
  { nombre: "Bruja de las Sombras", nivel: 20, hp: 220, atk: 40, icon: "🧙‍♀️", habilidades: ["Hex Sombrío", "Niebla Oscura"], recompensas: ["200 monedas", "100 XP", "Esencia Sombría"] },
];

function enemigoDelMes(fecha = new Date()): EnemyDef {
  const mes = fecha.getMonth();
  return ENEMIGOS_MENSUALES[mes % ENEMIGOS_MENSUALES.length];
}

/* ──────────────────────────────
   Barra simple 
──────────────────────────────── */
function Bar({
  label,
  cur,
  max,
  color = "bg-green-500",
}: {
  label: string;
  cur: number;
  max: number;
  color?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round((cur / max) * 100)));
  return (
    <div className="space-y-1">
      <div className="text-xs opacity-80 flex justify-between">
        <span>{label}</span>
        <span>
          {cur}/{max}
        </span>
      </div>
      <div className="h-2 bg-black/40 rounded">
        <div className={`h-2 ${color} rounded`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ──────────────────────────────
   ArenaSection (estructura clásica)
──────────────────────────────── */
export default function ArenaSection() {

  const player = { hpMax: 120, atk: 30 };

  const enemigoBase = useMemo(() => enemigoDelMes(), []);
  const [playerHP, setPlayerHP] = useState(player.hpMax);
  const [enemyHP, setEnemyHP] = useState(enemigoBase.hp);
  const [turnoJugador, setTurnoJugador] = useState(true);
  const [ended, setEnded] = useState(false);

  // consumibles
  const [potHP, setPotHP] = useState(0);
  const [potVeneno, setPotVeneno] = useState(0);

  const [log, setLog] = useState<string[]>([]);

  const diasRestantes = daysUntilMonthEnd();
  const hoyEsBatalla = diasRestantes === 0;

  const pushLog = (s: string) => setLog((L) => [s, ...L].slice(0, 200));

  function reset() {
    setPlayerHP(player.hpMax);
    setEnemyHP(enemigoBase.hp);
    setTurnoJugador(true);
    setEnded(false);
    // dejé las pociones igual; si quiern que se reinicien, reseteen acá
    setLog([]);
    pushLog("Reiniciaste el combate.");
  }

  function atacar() {
    if (!hoyEsBatalla || ended) return;

    if (turnoJugador) {
      const dmg = player.atk;
      const e = Math.max(0, enemyHP - dmg);
      setEnemyHP(e);
      pushLog(`Tú golpeas por ${dmg}`);
      setTurnoJugador(false);
      if (e <= 0) {
        setEnded(true);
        pushLog("¡Has vencido al enemigo del ahorro!");
      }
    } else {
      const dmg = enemigoBase.atk;
      const p = Math.max(0, playerHP - dmg);
      setPlayerHP(p);
      pushLog(`${enemigoBase.nombre} golpea por ${dmg}`);
      setTurnoJugador(true);
      if (p <= 0) {
        setEnded(true);
        pushLog("Has sido derrotado…");
      }
    }
  }

  function usarPocionVida() {
    if (!hoyEsBatalla || ended || potHP <= 0) return;
    const heal = 25;
    setPotHP((n) => n - 1);
    setPlayerHP((hp) => Math.min(player.hpMax, hp + heal));
    pushLog(`Usas Poción de Vida (+${heal}).`);
  }

  function usarPocionVeneno() {
    if (!hoyEsBatalla || ended || potVeneno <= 0) return;
    const tick = 15;
    setPotVeneno((n) => n - 1);
    setEnemyHP((hp) => Math.max(0, hp - tick));
    pushLog(`Usas Veneno (-${tick}).`);
  }

  return (
    <div className="space-y-6">
      <div className="text-sm opacity-70">⚔️ ARENA DE COMBATE</div>

      {!hoyEsBatalla ? (
        <div className="text-xs opacity-80">
          Faltan <b>{diasRestantes} día(s)</b> para la batalla (último día del mes).
        </div>
      ) : (
        <div className="text-xs text-emerald-400">¡La batalla está disponible hoy!</div>
      )}

      {/* Jefe actual / info */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Enemigo del mes</h2>
          <span className="badge">Nivel {enemigoBase.nivel}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-3 mt-3">
          <div>
            <div className="text-sm mb-2">🧍‍♂️ Tú</div>
            <Bar label="VIDA" cur={playerHP} max={player.hpMax} color="bg-red-500" />
            <div className="text-xs mt-1 opacity-70">ATK: {player.atk}</div>
          </div>

          <div>
            <div className="text-sm mb-2">
              {enemigoBase.icon ?? "🕱"} {enemigoBase.nombre}
            </div>
            <Bar label="VIDA (Enemigo)" cur={enemyHP} max={enemigoBase.hp} color="bg-red-500" />
            <div className="text-xs mt-1 opacity-70">ATK: {enemigoBase.atk}</div>
          </div>
        </div>

        {/* Habilidades y recompensas */}
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium mb-2">Habilidades</div>
            <div className="flex flex-wrap gap-2">
              {(enemigoBase.habilidades ?? []).map((h) => (
                <span key={h} className="badge">
                  {h}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium mb-2">Recompensas por victoria</div>
            <ul className="text-xs opacity-80 list-disc pl-5">
              {(enemigoBase.recompensas ?? []).map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Acciones</h3>
          <div className="text-xs opacity-70">
            Turno: <b>{turnoJugador ? "Tú" : enemigoBase.nombre}</b>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <button
            className="btn btn-primary"
            onClick={atacar}
            disabled={!hoyEsBatalla || ended}
            title={!hoyEsBatalla ? "Disponible solo el último día del mes" : ""}
          >
            {turnoJugador ? "Atacar" : "Esperar turno"}
          </button>
          <button className="btn" onClick={reset}>
            Reiniciar
          </button>
        </div>
      </div>

      {/* Consumibles */}
      <div className="card p-4">
        <h3 className="font-medium mb-3">Consumibles</h3>
        <div className="flex items-center gap-4">
          <button
            className="btn"
            onClick={usarPocionVida}
            disabled={!hoyEsBatalla || ended || potHP <= 0}
          >
            ✚ Vida ({potHP})
          </button>
          <button
            className="btn"
            onClick={usarPocionVeneno}
            disabled={!hoyEsBatalla || ended || potVeneno <= 0}
          >
            ☠ Veneno ({potVeneno})
          </button>
        </div>
        <p className="text-xs opacity-70 mt-2">
          Las pociones se consumen al usarlas.
        </p>
      </div>

      {/* Registro */}
      <div className="card p-4">
        <h3 className="font-medium mb-2">Registro de batalla</h3>
        <ul className="text-xs space-y-1 max-h-60 overflow-auto">
          {log.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
