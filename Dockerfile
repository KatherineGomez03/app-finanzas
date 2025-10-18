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

# Construir la aplicación
RUN pnpm run build

# Etapa de producción
FROM node:18-alpine AS production

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Crear directorio de la aplicación
WORKDIR /app

# Copiar archivos de configuración y dependencias
COPY package.json pnpm-lock.yaml ./
COPY --from=development /app/.next ./.next
COPY --from=development /app/public ./public
COPY --from=development /app/node_modules ./node_modules

# Exponer puerto
EXPOSE 3001

# Comando para ejecutar la aplicación
CMD ["pnpm", "start"]