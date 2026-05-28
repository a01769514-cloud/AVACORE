import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Cliente } from "@/types";

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: clientes } = await supabase
    .from("clientes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Directorio de Clientes</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {clientes?.length ?? 0} constructoras activas bajo servicio AVA
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-slate-bg">
              {["Empresa", "ID Cliente", "Email de Contacto", "Estado", "Alta", "Accion"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(clientes as Cliente[])?.map((c, i) => (
              <tr
                key={c.cliente_id}
                className={`border-b border-border last:border-0 hover:bg-slate-bg/50 transition-colors ${i % 2 === 0 ? "" : "bg-slate-bg/30"}`}
              >
                <td className="px-4 py-3 font-medium text-text-primary">{c.company_name}</td>
                <td className="px-4 py-3 font-mono text-xs text-text-muted">{c.cliente_id}</td>
                <td className="px-4 py-3 text-text-secondary">{c.contact_email ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    c.active ? "bg-success/10 text-success" : "bg-border text-text-muted"
                  }`}>
                    {c.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-text-muted">
                  {new Date(c.created_at).toLocaleDateString("es-MX")}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/${c.cliente_id}`}
                    className="text-xs text-brand border border-brand/30 px-3 py-1.5 rounded-md hover:bg-brand-light transition-colors inline-block"
                  >
                    Gestionar Cliente
                  </Link>
                </td>
              </tr>
            ))}
            {(!clientes || clientes.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-text-muted text-sm">
                  Sin clientes registrados. Agrega el primer cliente desde Supabase.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
