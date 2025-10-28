import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurar el puerto para desarrollo
  async rewrites() {
    return [];
  }
};

// Exportar la configuración y agregar el puerto vía env
const PORT = process.env.PORT || "3001";
process.env.PORT = PORT;

export default nextConfig;
