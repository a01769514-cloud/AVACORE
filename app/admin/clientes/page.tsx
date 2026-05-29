import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Cliente } from "@/types";

export default async function ClientesPage() {
  const supabase = await createClient();
  const { data: clientes } = await supabase
    .from("clientes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>Clientes</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
          {clientes?.length ?? 0} constructoras registradas
        </p>
      </div>

      <div className="bg-card rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--color-border)", background: "var(--color-slate-bg)" }}>
              {["Empresa", "ID Cliente", "Email de Contacto", "Estado", "Alta", "Accion"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(clientes as Cliente[])?.map((c, i) => (
              <tr
                key={c.cliente_id}
                className="border-b last:border-0 transition-colors"
                style={{ borderColor: "var(--color-border)", background: i % 2 !== 0 ? "rgba(248,250,252,0.6)" : "transparent" }}
              >
                <td className="px-4 py-3 font-medium" style={{ color: "var(--color-text-primary)" }}>{c.company_name}</td>
                <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--color-text-muted)" }}>{c.cliente_id}</td>
                <td className="px-4 py-3" style={{ color: "var(--color-text-secondary)" }}>{c.contact_email ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{
                    background: c.active ? "rgba(5,150,105,0.1)" : "rgba(148,163,184,0.15)",
                    color: c.active ? "var(--color-success)" : "var(--color-text-muted)",
                  }}>
                    {c.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--color-text-muted)" }}>
                  {new Date(c.created_at).toLocaleDateString("es-MX")}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/clientes/${c.cliente_id}`}
                    className="text-xs px-3 py-1.5 rounded-md border font-medium transition-colors inline-block"
                    style={{ borderColor: "var(--color-brand)", color: "var(--color-brand)" }}
                  >
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))}
            {(!clientes || clientes.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
                  Sin clientes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
