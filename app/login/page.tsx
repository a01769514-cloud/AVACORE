"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const AVALogoBlue = () => (
  <svg width="44" height="44" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="42,20 58,20 80,78 66,78 50,36 34,78 20,78" fill="#0A192F"/>
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Credenciales invalidas. Verifica tu email y contrasena.");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-slate-bg)" }}>
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-card rounded-xl p-8" style={{ border: "2px solid rgba(10,25,47,0.12)", boxShadow: "0 4px 24px -4px rgba(10,25,47,0.1)" }}>
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <AVALogoBlue />
            <p className="font-display text-lg font-bold mt-3" style={{ color: "var(--color-text-primary)" }}>AVACORE</p>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Command Center</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="usuario@empresa.com"
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{
                  border: "2px solid rgba(10,25,47,0.12)",
                  color: "var(--color-text-primary)",
                  background: "var(--color-slate-bg)",
                }}
                onFocus={e => (e.target.style.borderColor = "#0A192F")}
                onBlur={e => (e.target.style.borderColor = "rgba(10,25,47,0.12)")}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                Contrasena
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{
                  border: "2px solid rgba(10,25,47,0.12)",
                  color: "var(--color-text-primary)",
                  background: "var(--color-slate-bg)",
                }}
                onFocus={e => (e.target.style.borderColor = "#0A192F")}
                onBlur={e => (e.target.style.borderColor = "rgba(10,25,47,0.12)")}
              />
            </div>

            {error && (
              <div className="rounded-lg px-3 py-2 text-xs" style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", color: "var(--color-danger)" }}>
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity mt-2"
              style={{ background: "#0A192F", opacity: loading ? 0.6 : 1 }}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs mt-5" style={{ color: "var(--color-text-muted)" }}>AVA Systems — Acceso restringido</p>
      </div>
    </div>
  );
}
