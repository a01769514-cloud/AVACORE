"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface HeaderProps {
  userName: string | null;
  isAdmin: boolean;
  clienteId?: string;
  currentView?: "admin" | "client";
  onViewChange?: (view: "admin" | "client") => void;
}

export default function Header({ userName, isAdmin, currentView = "admin", onViewChange }: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* View toggle — admin only */}
        {isAdmin && onViewChange && (
          <div className="flex items-center bg-slate-bg border border-border rounded-md p-0.5">
            <button
              onClick={() => onViewChange("admin")}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                currentView === "admin"
                  ? "bg-brand text-white"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Administrador
            </button>
            <button
              onClick={() => onViewChange("client")}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                currentView === "client"
                  ? "bg-brand text-white"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Cliente
            </button>
          </div>
        )}
      </div>

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="flex items-center gap-2 hover:bg-slate-bg px-2.5 py-1.5 rounded-md transition-colors"
        >
          <div className="w-7 h-7 bg-brand-light rounded-full flex items-center justify-center">
            <span className="text-brand text-xs font-semibold">
              {userName?.charAt(0).toUpperCase() ?? "U"}
            </span>
          </div>
          <span className="text-sm text-text-primary font-medium">{userName ?? "Usuario"}</span>
          <ChevronDown size={14} className="text-text-muted" />
        </button>

        {userMenuOpen && (
          <div className="absolute right-0 top-full mt-1 w-44 bg-card border border-border rounded-md shadow-elevated py-1 z-20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:bg-slate-bg hover:text-danger transition-colors"
            >
              <LogOut size={14} />
              Cerrar sesion
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
