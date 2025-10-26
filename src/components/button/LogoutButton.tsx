"use client";

import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userid");
      localStorage.clear();
      window.location.href = "http://localhost:3001/login";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      title="Salir del Reino"
      className="flex items-center justify-center gap-1 px-2 h-8 sm:h-9
                 bg-[var(--color-navy)] text-yellow-300 border border-yellow-500
                 hover:bg-red-600 hover:border-red-500 hover:text-white
                 active:translate-y-[1px] transition-all duration-150
                 font-['PressStart2P'] text-[8px] sm:text-[9px]
                 rounded-sm shadow-[1px_1px_0_#000]"
    >
      <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      <span className="hidden sm:inline">Salir</span>
    </button>
  );
}
