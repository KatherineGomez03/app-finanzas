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
    date,
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

    const payload = {
      amount: Number(amount),
      category: mapCategory(category),
      date,
      description,
      userId,
      type: "expense",
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Payload enviado:", payload);

      if (!res.ok) throw new Error("Error al registrar el gasto");

      // guarda el gasto en localstorage
      const current = JSON.parse(localStorage.getItem("expenses") || "[]");
      const updated = [
        ...current,
        { ...payload, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
      ];
      localStorage.setItem("expenses", JSON.stringify(updated));

      
      localStorage.setItem("lastExpenseUpdate", Date.now().toString());

      await uploadExperience(10);
      console.log("Gasto registrado con éxito ");
    } catch (err: any) {
      console.error("Falló el registro:", err);
      setError(err.message || "Error desconocido");
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
  };
  return map[input.toLowerCase()] || "other_expense";
};
