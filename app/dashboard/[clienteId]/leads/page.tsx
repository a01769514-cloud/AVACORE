import { createClient } from "@/lib/supabase/server";
import type { Lead } from "@/types";

export default async function LeadsPage({ params }: { params: Promise<{ clienteId: string }> }) {
  const { clienteId } = await params;
  const supabase = await createClient();

  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .eq("cliente_id", clienteId)
    .order("created_at", { ascending: false })
    .limit(100);

  const statusColor: Record<string, string> = {
    Nuevo: "bg-brand-light text-brand",
    Contactado: "bg-warning/10 text-warning",
    Calificado: "bg-success/10 text-success",
    Descartado: "bg-danger/10 text-danger",
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">Leads</h1>
        <p className="text-sm text-text-secondary mt-0.5">{leads?.length ?? 0} registros encontrados</p>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-slate-bg">
              {["Nombre", "Plataforma", "Origen", "Temperatura", "Estado", "Fecha"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(leads as Lead[])?.map((lead, i) => (
              <tr key={lead.lead_id} className={`border-b border-border last:border-0 hover:bg-slate-bg/50 transition-colors ${i % 2 === 0 ? "" : "bg-slate-bg/30"}`}>
                <td className="px-4 py-3 font-medium text-text-primary">{lead.lead_name ?? "—"}</td>
                <td className="px-4 py-3 text-text-secondary">{lead.platform ?? "—"}</td>
                <td className="px-4 py-3 text-text-secondary">{lead.lead_source ?? "—"}</td>
                <td className="px-4 py-3 text-text-secondary">{lead.lead_temperature ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[lead.lead_status ?? ""] ?? "bg-border text-text-muted"}`}>
                    {lead.lead_status ?? "Sin estado"}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-text-muted">
                  {new Date(lead.created_at).toLocaleDateString("es-MX")}
                </td>
              </tr>
            ))}
            {(!leads || leads.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-text-muted text-sm">
                  Sin leads registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
