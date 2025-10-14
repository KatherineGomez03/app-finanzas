"use client";
import { useMemo, useState } from "react";
import { BOSSES } from "@/lib/game-data";
import { useGame } from "@/lib/game-store";

export default function ArenaPage() {
  const { player, inventario, usar } = useGame();
  const [bossId, setBossId] = useState(BOSSES[0].id);
  const bossBase = useMemo(() => BOSSES.find(b => b.id === bossId)!, [bossId]);

  const [bossHP, setBossHP] = useState(bossBase.vida);
  const [playerHP, setPlayerHP] = useState(player.vida);
  const [log, setLog] = useState<string[]>([]);
  const [ended, setEnded] = useState(false);

  // inventario → consumibles
  const potHP   = useMemo(() => inventario.filter(i => i.tipo === "pocion" && "cura"   in i), [inventario]);
  const potPOIS = useMemo(() => inventario.filter(i => i.tipo === "pocion" && "veneno" in i), [inventario]);

  function reset() {
    const fresh = BOSSES.find(b => b.id === bossId)!;
    setBossHP(fresh.vida);
    setPlayerHP(player.vida);
    setLog([]);
    setEnded(false);
  }

  function turno() {
    if (ended) return;
    // jugador ataca
    const dmgP = Math.max(5, player.ataque + Math.floor(Math.random() * 6) - 3);
    const nb = Math.max(0, bossHP - dmgP);
    setBossHP(nb);
    setLog(l => [`Tú golpeas por ${dmgP}`, ...l]);
    if (nb <= 0) { setEnded(true); setLog(l => [`🏆 ¡Venciste a ${bossBase.nombre}!`, ...l]); return; }

    // jefe ataca
    const dmgB = Math.max(3, bossBase.ataque + Math.floor(Math.random() * 6) - 3);
    const np = Math.max(0, playerHP - dmgB);
    setPlayerHP(np);
    setLog(l => [`${bossBase.icon} ${bossBase.nombre} golpea por ${dmgB}`, ...l]);
    if (np <= 0) { setEnded(true); setLog(l => [`💀 Perdiste… vuelve con más items.`, ...l]); }
  }

  function usarPocionVida() {
    const it = potHP[0]; if (!it || ended) return;
    setPlayerHP(hp => Math.min(player.vida, hp + it.cura));
    usar(it.id);
    setLog(l => [`🧪 Usaste Poción de Vida (+${it.cura} HP)`, ...l]);
  }
  function usarPocionVeneno() {
    const it = potPOIS[0]; if (!it || ended) return;
    setBossHP(hp => Math.max(0, hp - it.veneno));
    usar(it.id);
    setLog(l => [`☠️ Lanzaste Poción de Veneno (-${it.veneno} HP al jefe)`, ...l]);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl">⚔️ Arena mensual</h1>

      <div className="flex gap-2 items-center">
        <span>Jefe:</span>
        <select className="btn" value={bossId} onChange={e => { setBossId(e.target.value); reset(); }}>
          {BOSSES.map(b => <option key={b.id} value={b.id}>{b.icon} {b.nombre}</option>)}
        </select>
        <button className="btn" onClick={reset}>Reiniciar</button>
      </div>

      <Bars
        you={{ hp: playerHP, max: player.vida, atk: player.ataque }}
        boss={{ hp: bossHP, max: bossBase.vida, atk: bossBase.ataque, name: bossBase.nombre, icon: bossBase.icon! }}
      />

      {/* Acciones */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="card p-3 flex flex-wrap items-center gap-2">
          <button className="btn btn-primary" onClick={turno} disabled={ended}>Atacar</button>
        </div>

        {/* Consumibles */}
        <div className="card p-3">
          <h3 className="font-medium mb-2">Consumibles</h3>
          <div className="flex flex-wrap gap-2">
            <button className="btn" onClick={usarPocionVida}  disabled={ended || potHP.length === 0}>🧪 Vida ({potHP.length})</button>
            <button className="btn" onClick={usarPocionVeneno} disabled={ended || potPOIS.length === 0}>☠️ Veneno ({potPOIS.length})</button>
          </div>
          <p className="text-xs opacity-70 mt-2">Las pociones se consumen al usarlas.</p>
        </div>
      </div>

      <div className="card p-3">
        <h4 className="mb-2">Registro</h4>
        <ul className="space-y-1 text-sm">
          {log.map((l, i) => <li key={i}>• {l}</li>)}
        </ul>
      </div>
    </div>
  );
}

/* ==== UI helpers ==== */
function Bars({
  you, boss,
}: {
  you: { hp: number; max: number; atk: number },
  boss: { hp: number; max: number; atk: number; name: string; icon: string }
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card p-4">
        <h3 className="font-medium mb-1">👤 Tú</h3>
        <Bar label={`HP ${you.hp}/${you.max}`} pct={Math.round((you.hp / you.max) * 100)} color="var(--success)" />
        <p className="mt-2 text-sm">ATK {you.atk}</p>
      </div>
      <div className="card p-4">
        <h3 className="font-medium mb-1">{boss.icon} {boss.name}</h3>
        <Bar label={`HP ${boss.hp}/${boss.max}`} pct={Math.round((boss.hp / boss.max) * 100)} color="var(--danger)" />
        <p className="mt-2 text-sm">ATK {boss.atk}</p>
      </div>
    </div>
  );
}

function Bar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div className="bar">
        <div className="fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="mt-1 text-xs opacity-70">{label}</div>
    </div>
  );
}
