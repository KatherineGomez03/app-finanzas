# Etapa de desarrollo
FROM node:18-alpine AS development

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Crear directorio de la aplicación
WORKDIR /app

# Copiar archivos de configuración
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install

# Copiar el código fuente
COPY . .

# Comando para desarrollo
CMD ["pnpm", "run", "dev"]

# Etapa de producción
FROM node:18-alpine AS production

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Crear directorio de la aplicación
WORKDIR /app

# Copiar todo el código fuente
COPY . .

# Instalar dependencias y construir
RUN pnpm install
RUN pnpm run build

# Exponer puerto
EXPOSE 3000

# Comando para ejecutar la aplicación en producción
CMD ["pnpm", "start"]