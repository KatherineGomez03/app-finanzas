// next.config.ts
import type { NextConfig } from "next";
import path from "path";

/**
 * next-pwa setup:
 * usamos require(...) para pasar el objeto de opciones directamente.
 * disable: true en desarrollo (NODE_ENV === 'development').
 */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  // opcional:
  // runtimeCaching: require('next-pwa/cache'),
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Configurar rewrites para proxy hacia el backend
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      throw new Error("BACKEND_URL environment variable is not set");
    }
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },

  // si tenés más settings (images, i18n, etc.) agregalos acá
};

// Exportamos la config envuelta por next-pwa
const PORT = process.env.PORT || "3001";
process.env.PORT = PORT;

export default withPWA(nextConfig);
