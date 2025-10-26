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
      className="h-8 w-8 flex items-center justify-center bg-[var(--color-navy)]
                 text-yellow-300 border border-yellow-500
                 hover:bg-red-600 hover:border-red-500 hover:text-white
                 transition-all duration-150 font-['PressStart2P'] text-[10px]
                 rounded-none shadow-[1px_1px_0_#000]"
    >
      <LogOut className="h-4 w-4" />
    </button>
  );
}
