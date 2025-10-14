import "./globals.css";
import type { Metadata } from "next";
import GameProvider from "@/lib/game-store";
import LayoutShell from "@/components/layoutshell";

export const metadata: Metadata = {
  title: "Finlúdica",
  description: "Finanzas gamificadas estilo RPG",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        <GameProvider>
          <LayoutShell>{children}</LayoutShell>
        </GameProvider>
      </body>
    </html>
  );
}

