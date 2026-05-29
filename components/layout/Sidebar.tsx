"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Building2, Settings, ArrowLeftRight, Menu, ChevronLeft } from "lucide-react";

interface SidebarProps {
  isAdmin?: boolean;
  collapsed?: boolean;
  onToggle?: () => void;
}

const AVALogo = () => (
  <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="42,20 58,20 80,78 66,78 50,36 34,78 20,78" fill="white"/>
  </svg>
);

export default function Sidebar({ isAdmin, collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isClientMode = pathname.startsWith("/dashboard");

  const adminItems = [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={16} strokeWidth={1.8}/> },
    { label: "Clientes", href: "/admin/clientes", icon: <Building2 size={16} strokeWidth={1.8}/> },
    { label: "Operaciones", href: "/admin/operations", icon: <Settings size={16} strokeWidth={1.8}/> },
  ];

  const clientItems = [
    { label: "Dashboard", href: "/dashboard/cli_templasur_2026", icon: <LayoutDashboard size={16} strokeWidth={1.8}/> },
  ];

  const items = isClientMode ? clientItems : adminItems;

  return (
    <aside
      className="shrink-0 h-screen sticky top-0 flex flex-col"
      style={{
        width: collapsed ? "56px" : "216px",
        background: "#0A192F",
        boxShadow: "2px 0 12px 0 rgba(0,0,0,0.18)",
        transition: "width 0.3s ease-in-out",
        overflow: "hidden",
      }}
    >
      {/* Toggle + Logo */}
      <div className="flex items-center px-3 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", minHeight: "68px" }}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <AVALogo />
            <div className="min-w-0">
              <p className="font-display font-extrabold leading-none text-white tracking-tight" style={{ fontSize: "15px" }}>AVACORE</p>
              <p className="font-sans text-[10px] mt-0.5 leading-tight" style={{ color: "rgba(241,245,249,0.4)" }}>Command Center</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center w-full">
            <AVALogo />
          </div>
        )}
        <button
          onClick={onToggle}
          className="shrink-0 flex items-center justify-center w-7 h-7 rounded-md transition-colors"
          style={{ color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.06)", marginLeft: collapsed ? "0" : "4px" }}
        >
          {collapsed ? <Menu size={14}/> : <ChevronLeft size={14}/>}
        </button>
      </div>

      {/* Mode badge */}
      {isAdmin && !collapsed && (
        <div className="px-3 pt-3 pb-1">
          <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded" style={{
            background: isClientMode ? "rgba(29,111,164,0.3)" : "rgba(255,255,255,0.08)",
            color: isClientMode ? "#7EC8F0" : "rgba(241,245,249,0.4)",
          }}>
            {isClientMode ? "Vista Cliente" : "Vista Admin"}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {items.map((item) => {
          const active = item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className="flex items-center gap-2.5 rounded-md transition-all"
              style={{
                padding: collapsed ? "9px 10px" : "9px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                background: active ? "rgba(255,255,255,0.1)" : "transparent",
                color: active ? "white" : "rgba(241,245,249,0.5)",
                fontWeight: active ? 500 : 400,
                fontSize: "13.5px",
                borderLeft: active ? "2px solid white" : "2px solid transparent",
              }}
            >
              {item.icon}
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      {/* Role Switcher */}
      {isAdmin && (
        <div className="px-2 pb-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "10px" }}>
          <button
            onClick={() => router.push(isClientMode ? "/admin" : "/dashboard/cli_templasur_2026")}
            className="w-full flex items-center rounded-md text-xs font-medium transition-all"
            style={{
              gap: collapsed ? "0" : "8px",
              padding: collapsed ? "9px 10px" : "9px 12px",
              justifyContent: collapsed ? "center" : "flex-start",
              background: isClientMode ? "rgba(29,111,164,0.25)" : "rgba(255,255,255,0.07)",
              color: isClientMode ? "#7EC8F0" : "rgba(241,245,249,0.6)",
              border: "1px solid",
              borderColor: isClientMode ? "rgba(29,111,164,0.4)" : "rgba(255,255,255,0.1)",
            }}
            title={collapsed ? (isClientMode ? "Volver a Admin" : "Simular Cliente") : undefined}
          >
            <ArrowLeftRight size={13}/>
            {!collapsed && (isClientMode ? "Volver a Admin" : "Simular Cliente")}
          </button>
        </div>
      )}
    </aside>
  );
}
