import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

import { UserUpdateProvider } from "../context/UserUpdateContext"
import PWAPrompt from "@/components/PWA";

// Tipografía retro pixelada
const pressStart = localFont({
  src: "../../public/fonts/PressStart2P.ttf",
  variable: "--font-press-start",
  display: "swap",
});


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Monevo",
  description: "Accede al reino financiero",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          ${pressStart.variable} 
          bg-black text-green-400 font-press-start antialiased
        `}
      >
        <UserUpdateProvider>
          {children}
          <PWAPrompt />
        </UserUpdateProvider>
      </body>
    </html>
  );
}

