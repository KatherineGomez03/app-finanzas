import { NextResponse } from "next/server";

type TipsRequest = {
  monthlyIncome?: number;
  savingsGoal?: number;
  currentSavings?: number;
  daysLeft?: number;
  expensesByCategory: Record<string, number>;
};

export async function POST(req: Request) {
  const payload = (await req.json()) as TipsRequest;

  // Fallback local (reglas simples)
  const localHeuristics = () => {
    const tips: any[] = [];
    const { expensesByCategory, savingsGoal, currentSavings, daysLeft } = payload;
    const total = Object.values(expensesByCategory || {}).reduce((a, b) => a + b, 0);

    // top 2 categorías de gasto
    const top = Object.entries(expensesByCategory || {}).sort((a, b) => b[1] - a[1]).slice(0, 2);
    top.forEach(([cat, val]) => {
      tips.push({
        title: `Bajá ${cat} un 10%`,
        body: `Gastás $${val} al mes en ${cat}. Si recortás un 10%, ahorrás $${Math.round(
          val * 0.1
        )} sin tocar necesidades básicas.`,
        impact: "medium",
        category: cat,
      });
    });

    // meta de ahorro
    if (
      typeof savingsGoal === "number" &&
      typeof currentSavings === "number" &&
      typeof daysLeft === "number" &&
      daysLeft > 0
    ) {
      const faltante = Math.max(0, savingsGoal - currentSavings);
      const porDia = Math.ceil(faltante / daysLeft);
      tips.push({
        title: "Ritmo para alcanzar tu meta",
        body: `Te faltan $${faltante} para tu meta. Objetivo sugerido: ahorrar ~$${porDia}/día durante los próximos ${daysLeft} días.`,
        impact: faltante > total * 0.3 ? "high" : "medium",
      });
    }

    // regla de “ingresos vs gastos”
    if (payload.monthlyIncome && total > payload.monthlyIncome * 0.9) {
      tips.push({
        title: "Gasto cerca de tus ingresos",
        body: `Tus gastos ($${total}) están cerca de tus ingresos ($${payload.monthlyIncome}). Reservá al menos 10% para ahorro/colchón de seguridad.`,
        impact: "high",
      });
    }

    // tip genérico de hábitos
    tips.push({
      title: "Gasto consciente",
      body: "Agrupá compras discrecionales en un solo día por semana para reducir impulsos y comparar precios con calma.",
      impact: "low",
    });

    return tips;
  };

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ tips: localHeuristics() });
  }

  // === OpenAI (si hay API key) ===
  try {
    const prompt = `
Generá 5 consejos financieros claros y accionables en español, formato JSON:
[{ "title": "...", "body": "...", "impact":"low|medium|high", "category":"opcional" }, ...]
Contexto: ${JSON.stringify(payload)}
Enfocate en reducir gastos altos por categoría, ritmo diario para meta de ahorro, y hábitos prácticos.
    `.trim();

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Sos un asesor financiero claro y conciso." },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
      }),
    });

    const data = await r.json();
    const text = data?.choices?.[0]?.message?.content || "[]";
    // Intentá parsear JSON del modelo
    let tips;
    try {
      tips = JSON.parse(text);
    } catch {
      tips = localHeuristics();
    }
    return NextResponse.json({ tips });
  } catch {
    return NextResponse.json({ tips: localHeuristics() });
  }
}
