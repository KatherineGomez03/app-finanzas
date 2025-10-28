"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  // Un loading state sencillo mientras ocurre la redirección
  return (
    <div className="min-h-screen bg-[var(--back)] flex items-center justify-center">
      <p className="text-white font-pixel animate-pulse">
        Bienvenido a tu aventura financiera...
      </p>
    </div>
  );
}