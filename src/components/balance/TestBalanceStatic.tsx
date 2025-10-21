import BalanceSectionStatic from "./BalanceSectionStatic";

export default function TestBalanceStatic() {
    const current = [
        { amount: 1200, category: "Alimentación", date: "2025-10-01" },
        { amount: 800, category: "Transporte", date: "2025-10-02" },
        { amount: 500, category: "Entretenimiento", date: "2025-10-03" },
        { amount: 900, category: "Servicios", date: "2025-10-04" },
        { amount: 300, category: "Otros", date: "2025-10-05" },
    ];

    const previous = [
        { amount: 1000, category: "Alimentación", date: "2025-09-01" },
        { amount: 950, category: "Transporte", date: "2025-09-02" },
        { amount: 400, category: "Entretenimiento", date: "2025-09-03" },
        { amount: 850, category: "Servicios", date: "2025-09-04" },
        { amount: 500, category: "Otros", date: "2025-09-05" },
    ];

    return <BalanceSectionStatic current={current} previous={previous} />;
}