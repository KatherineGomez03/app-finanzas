# 💸 Finlúdica – Frontend

> Interfaz web gamificada para gestionar tus finanzas personales.

---

## 🎯 Descripción

El *Frontend de Finlúdica* es la capa visual e interactiva del proyecto.  
Su objetivo es ofrecer una experiencia moderna, fluida y lúdica para que los usuarios puedan *gestionar sus finanzas personales de forma entretenida*, combinando métricas financieras con elementos de gamificación.

A través de esta interfaz, el usuario puede:
- Visualizar su resumen financiero (dashboard).  
- Registrar gastos e ingresos.  
- Ver su progreso en metas de ahorro.  
- Participar en desafíos, obtener logros y subir de nivel.  

---

## 🧩 Características principales

- *Dashboard dinámico:* muestra distribución de gastos, progreso de metas y estado de cuenta.  
- *Registro rápido:* formulario intuitivo para añadir gastos e ingresos.  
- *Gamificación:* niveles, logros, puntos y desafíos semanales.  
- *Historial filtrable:* permite visualizar y editar transacciones anteriores.  
- *Diseño responsive:* adaptado a móviles, tablets y escritorio.  
- *Integración con API Backend (Nest.js).*

---

## 🧠 Tecnologías Utilizadas

| Área | Tecnología | Descripción |
|------|-------------|-------------|
| *Framework* | [Next.js](https://nextjs.org/) | Framework de React con renderizado híbrido (SSR/SSG). |
| *Lenguaje* | TypeScript | Tipado estático para mayor robustez y escalabilidad. |
| *Estilos* | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) | Componentes modernos y diseño limpio y adaptable. |
| *Gráficos* | [Recharts](https://recharts.org/) | Visualización de datos financieros (barras, círculos, progreso). |
| *Estado Global* | Zustand / Context API | Gestión simple del estado compartido. |
| *Autenticación* | JWT o Firebase Auth | Control de acceso seguro a las rutas protegidas. |

---

## 🧱 Estructura del Proyecto
---

## 🔗 Conexión con Backend

El frontend se comunica con la API desarrollada en *Nest.js* mediante peticiones HTTP.  
Endpoints principales:

- /auth/login  
- /auth/register  
- /expenses  
- /goals  
- /achievements  
- /challenges

Configuración base (ejemplo):

```env
NEXT_PUBLIC_API_URL=https://api.finludica.app
```
