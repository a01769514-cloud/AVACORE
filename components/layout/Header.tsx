"use client";

import { useState, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { LogOut, ChevronDown, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface HeaderProps {
  userName: string | null;
  isAdmin: boolean;
}

const DATE_RANGES = [
  { label: "Hoy", value: "today" },
  { label: "Esta semana", value: "week" },
  { label: "30 dias", value: "30d" },
  { label: "90 dias", value: "90d" },
];

// Routes where date filter should be visible
const DATE_FILTER_ROUTES = ["/admin", "/admin/clientes/"];

function shouldShowDateFilter(pathname: string): boolean {
  if (pathname === "/admin") return true;
  if (pathname.match(/^\/admin\/clientes\/[^/]+(\?.*)?$/)) return true;
  if (pathname.match(/^\/dashboard\/[^/]+(\?.*)?$/)) return true;
  return false;
}

function HeaderContent({ userName, isAdmin }: HeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const currentRange = searchParams.get("range") ?? "30d";
  const showDateFilter = shouldShowDateFilter(pathname);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  function handleRangeChange(range: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", range);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <header
      className="sticky top-0 z-10 bg-card flex items-center justify-between px-6"
      style={{ height: "52px", borderBottom: "2px solid rgba(10,25,47,0.1)" }}
    >
      <div className="flex items-center gap-1.5">
        {showDateFilter && (
          <>
            <Calendar size={13} style={{ color: "var(--color-text-muted)" }} />
            <div className="flex items-center gap-0.5 ml-1">
              {DATE_RANGES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => handleRangeChange(r.value)}
                  className="px-3 py-1.5 text-xs rounded-md transition-colors font-medium"
                  style={{
                    background: currentRange === r.value ? "#0A192F" : "transparent",
                    color: currentRange === r.value ? "white" : "var(--color-text-secondary)",
                  }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors hover:bg-slate-50"
        >
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "#0A192F" }}>
            {userName?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{userName ?? "Usuario"}</span>
          <ChevronDown size={13} style={{ color: "var(--color-text-muted)" }} />
        </button>

        {userMenuOpen && (
          <div className="absolute right-0 top-full mt-1 w-44 bg-card rounded-lg py-1 z-20" style={{ border: "2px solid rgba(10,25,47,0.12)", boxShadow: "0 4px 16px -2px rgba(0,0,0,0.1)" }}>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors hover:bg-slate-50"
              style={{ color: "var(--color-text-secondary)" }}
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

export default function Header(props: HeaderProps) {
  return (
    <Suspense fallback={
      <header className="sticky top-0 z-10 bg-card" style={{ height: "52px", borderBottom: "2px solid rgba(10,25,47,0.1)" }} />
    }>
      <HeaderContent {...props} />
    </Suspense>
  );
}
