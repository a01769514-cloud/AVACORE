"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface ClientLayoutProps {
  userName: string | null;
  isAdmin: boolean;
  children: React.ReactNode;
}

export default function ClientLayout({ userName, isAdmin, children }: ClientLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isAdmin={isAdmin} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{ transition: "all 0.3s ease-in-out" }}
      >
        <Header userName={userName} isAdmin={isAdmin} />
        <main
          className="flex-1 overflow-y-auto px-6 py-6"
          style={{ background: "var(--color-slate-bg)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
