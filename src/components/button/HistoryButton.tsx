import { Download } from "lucide-react";
import { useState } from "react";

export default function ExportButton() {
    const [rpgMessage, setRpgMessage] = useState("");

    const handleExport = async () => {
        const userId = localStorage.getItem("userid");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
            setRpgMessage("Faltan credenciales 🛑");
            setTimeout(() => setRpgMessage(""), 3000);
            return;
        }

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/expenses/export/${userId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) throw new Error("Error en la descarga");

            const blob = await res.blob();

            // Crear una URL para el blob
            const url = window.URL.createObjectURL(blob);

            // Crear un enlace de descarga
            const a = document.createElement("a");
            a.href = url;
            a.download = "historial.xlsx";
            document.body.appendChild(a);
            a.click();

            // Limpiar
            a.remove();
            window.URL.revokeObjectURL(url);

            setRpgMessage("Historial descargado con éxito! 🔥");
            setTimeout(() => setRpgMessage(""), 3000);
        } catch (err) {
            console.log("Error al descargar historial ⚠️");
        }
    };

    return (
        <>
            <button
                onClick={handleExport}
                className="flex items-center gap-2 bg-yellow-300 text-[var(--color-navy)] font-['PressStart2P'] px-3 py-1.5 text-[10px] border border-yellow-500 hover:bg-yellow-400 transition-all
             md:px-4 md:py-2 md:text-xs"
            >
                <Download className="h-3 w-3 -mt-px" />
                Descargar Historial
            </button>


            {rpgMessage && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[var(--color-navy)] text-yellow-300 border border-yellow-500 px-4 py-2 font-['PressStart2P'] text-xs animate-bounce z-50">
                    {rpgMessage}
                </div>
            )}
        </>
    );
}
