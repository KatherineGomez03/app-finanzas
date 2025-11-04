import { useEffect, useState } from "react";

type Expense = {
    id: string;
    userId: string;
    amount: number;
    type: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    pointsEarned: number;
    tags: string[];
};

type ExpenseCategory = {
    category: string;
    amount: number;
    color: string;
};

const categoryColors: Record<string, string> = {
    food: "#5dd9c1",
    transport: "#ff7f7f",
    entertainment: "#ffe599",
    utilities: "#95d5b2",
    other_expense: "#64b5f6",
};

export function useUserExpenses(monthOffset: number = 0) {
    const [expenses, setExpenses] = useState<ExpenseCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const userId = localStorage.getItem("userid");
                const token = localStorage.getItem("token");

                if (!userId || !token) {
                    setError("Faltan credenciales");
                    setLoading(false);
                    return;
                }

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/expenses/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) throw new Error(`Error ${res.status}`);

                const data: Expense[] = await res.json();

                //Obtener fecha de inicio y fin del mes que se pide, too much
                const now = new Date();
                const targetMonth = now.getMonth() + monthOffset;
                const targetYear =
                    targetMonth < 0
                        ? now.getFullYear() - 1
                        : targetMonth > 11
                            ? now.getFullYear() + 1
                            : now.getFullYear();

                const month = ((targetMonth + 12) % 12); // Asegura que sea 0–11
                const start = new Date(targetYear, month, 1);
                const end = new Date(targetYear, month + 1, 0);

                //filtro gastos del mes correspondiente
                const filtered = data.filter((exp) => {
                    const expDate = new Date(exp.createdAt);
                    return expDate >= start && expDate <= end;
                });

                //Agrupar por categoría
                const sumByCategory = filtered.reduce((acc, exp) => {
                    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
                    return acc;
                }, {} as Record<string, number>);

                const formatted: ExpenseCategory[] = Object.entries(sumByCategory).map(
                    ([category, amount]) => ({
                        category: formatCategoryName(category),
                        amount,
                        color: categoryColors[category] || categoryColors["other_expense"],
                    })
                );

                setExpenses(formatted);
            } catch (err) {
                console.error(err);
                setError("Error al obtener los gastos");
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, [monthOffset]);

    return { expenses, loading, error };
}

function formatCategoryName(category: string): string {
    const names: Record<string, string> = {
        food: "Alimentación",
        transport: "Transporte",
        entertainment: "Entretenimiento",
        utilities: "Servicios",
        other_expense: "Otros",
    };
    return names[category] || category;
}

