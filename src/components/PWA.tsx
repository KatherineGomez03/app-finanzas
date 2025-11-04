"use client";

import { useEffect } from "react";
import Swal from "sweetalert2";
import { usePWA } from "@/hooks/usePWA";

export default function PWAPrompt() {
    const { isInstallable, promptInstall } = usePWA();

    useEffect(() => {
        const alreadyShown = sessionStorage.getItem("pwaPromptShown");

        if (isInstallable && !alreadyShown) {
            Swal.fire({
                title: "📱 ¡Instalá la App!",
                text: "Accedé más rápido desde tu pantalla principal.",
                icon: "info",
                showCancelButton: true,
                confirmButtonText: "Instalar",
                cancelButtonText: "Más tarde",
                background: "var(--back)",
                color: "#fff",
                confirmButtonColor: "#22c55e",
                cancelButtonColor: "#444",
                backdrop: `
          rgba(0,0,0,0.6)
          left top
          no-repeat
        `,
            }).then((result) => {
                if (result.isConfirmed) {
                    promptInstall();
                }
            });
        }

        sessionStorage.setItem("pwaPromptShown", "true");
    }, [isInstallable, promptInstall]);

    return null;
}

