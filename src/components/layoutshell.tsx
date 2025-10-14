"use client";

import TabsNav from "@/components/tabsnav";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh" style={{ background: "var(--background)" }}>
     
      <div className="mx-auto max-w-6xl px-3 md:px-6 py-6 space-y-6">
       
        <TabsNav />

       
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}

