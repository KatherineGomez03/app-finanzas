"use client";
import { useState } from "react";
import { useUploadExperience } from "./useUploadExperience";

export const useRegisterExpense = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { uploadExperience } = useUploadExperience();

  const registerExpense = async ({
    amount,
    category,
    date, // solo para el formulario, no se envía
    description,
    userId,
  }: {
    amount: number;
    category: string;
    date: string;
    description: string;
    userId: string;
  }) => {
    setLoading(true);
    setError(null);

    // 🔹 Solo lo que el backend acepta
    const payload = {
      amount: Number(amount),
      category: mapCategory(category),
      description,
      userId,
      date,
      type: "expense",
    };

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      console.log("📤 Payload enviado:", payload);

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Respuesta del backend:", res.status, text);
        throw new Error("Error al registrar el gasto");
      }

      console.log("Gasto registrado con éxito 🎉");
      await uploadExperience(10);
    } catch (err: unknown) {
      console.error("🚨 Falló el registro:", err);
      if (err instanceof Error) setError(err.message)
      else setError(String(err))
    } finally {
      setLoading(false);
    }
  };

  return { registerExpense, loading, error };
};

const mapCategory = (input: string): string => {
  const map: Record<string, string> = {
    alimentacion: "food",
    transporte: "transport",
    vivienda: "housing",
    servicios: "utilities",
    entretenimiento: "entertainment",
    salud: "health",
    educacion: "education",
    compras: "shopping",
    otros: "other_expense",
    salario: "salary",
    freelance: "freelance",
    inversion: "investment",
    regalo: "gift",
    ingreso_extra: "other_income",
  };
  return map[input.toLowerCase()] || "other_expense";
};