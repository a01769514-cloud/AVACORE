"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Credenciales incorrectas. Verifica tu email y contrasena.");
      setLoading(false);
      return;
    }
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo mark */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-brand rounded-md flex items-center justify-center">
              <span className="text-white font-display text-xs font-bold tracking-widest">AV</span>
            </div>
            <span className="font-display text-xl font-bold text-text-primary tracking-tight">AVACORE</span>
          </div>
          <p className="text-text-secondary text-sm pl-11">Panel de Operaciones</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-lg p-8 shadow-card">
          <h1 className="font-display text-lg font-bold text-text-primary mb-6">Acceso al sistema</h1>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5">
                Correo electronico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full px-3.5 py-2.5 text-sm border border-border rounded-md bg-slate-bg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
                placeholder="usuario@empresa.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1.5">
                Contrasena
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full px-3.5 py-2.5 text-sm border border-border rounded-md bg-slate-bg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="px-3.5 py-2.5 bg-danger/8 border border-danger/20 rounded-md">
                <p className="text-xs text-danger">{error}</p>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="w-full py-2.5 px-4 bg-brand hover:bg-brand-dark text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verificando..." : "Ingresar"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-text-muted mt-6">
          AVA Systems — Acceso restringido
        </p>
      </div>
    </div>
  );
}
