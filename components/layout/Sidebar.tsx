"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart2,
  Megaphone,
  Users,
  CalendarCheck,
  FileText,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  clienteId?: string;
  isAdmin?: boolean;
}

export default function Sidebar({ clienteId, isAdmin }: SidebarProps) {
  const pathname = usePathname();
  const base = clienteId ? `/dashboard/${clienteId}` : "";

  const clientItems: NavItem[] = [
    { label: "Dashboard", href: `${base}`, icon: <LayoutDashboard size={16} /> },
    { label: "Metricas", href: `${base}/analytics`, icon: <BarChart2 size={16} /> },
    { label: "Campanas", href: `${base}/campaigns`, icon: <Megaphone size={16} /> },
    { label: "Leads", href: `${base}/leads`, icon: <Users size={16} /> },
    { label: "Citas", href: `${base}/meetings`, icon: <CalendarCheck size={16} /> },
    { label: "Proyectos", href: `${base}/projects`, icon: <FileText size={16} /> },
  ];

  const adminItems: NavItem[] = [
    { label: "Clientes", href: "/admin", icon: <Users size={16} /> },
    { label: "Operaciones", href: "/admin/operations", icon: <Settings size={16} /> },
  ];

  const items = isAdmin && !clienteId ? adminItems : clientItems;

  return (
    <aside className="w-56 shrink-0 bg-card border-r border-border h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border flex items-center gap-2.5">
        <div className="w-7 h-7 bg-brand rounded flex items-center justify-center">
          <span className="text-white font-display text-[10px] font-bold tracking-widest">AV</span>
        </div>
        <span className="font-display text-base font-bold text-text-primary">AVACORE</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {items.map((item) => {
          const active = item.href === "" ? pathname === base || pathname === base + "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href || "/"}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-brand-light text-brand font-medium"
                  : "text-text-secondary hover:bg-slate-bg hover:text-text-primary"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Admin badge */}
      {isAdmin && (
        <div className="px-4 py-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-brand">
            <ShieldCheck size={12} />
            <span>Administrador</span>
          </div>
        </div>
      )}
    </aside>
  );
}
