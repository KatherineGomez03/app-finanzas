import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurar el puerto para desarrollo y rewrites para el backend
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      throw new Error('BACKEND_URL environment variable is not set');
    }
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  }
};

// Exportar la configuración y agregar el puerto vía env
const PORT = process.env.PORT || "3001";
process.env.PORT = PORT;

export default nextConfig;
