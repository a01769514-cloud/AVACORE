import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types";

export default async function ProjectsPage({ params }: { params: Promise<{ clienteId: string }> }) {
  const { clienteId } = await params;
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("cliente_id", clienteId)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">Proyectos</h1>
        <p className="text-sm text-text-secondary mt-0.5">{projects?.length ?? 0} proyectos encontrados</p>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-slate-bg">
              {["Lead", "Tipo", "Ubicacion", "Intencion", "Urgencia", "Estado", "Quote Step"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(projects as Project[])?.map((p, i) => (
              <tr key={p.project_id} className={`border-b border-border last:border-0 hover:bg-slate-bg/50 transition-colors ${i % 2 === 0 ? "" : "bg-slate-bg/30"}`}>
                <td className="px-4 py-3 font-medium text-text-primary">{p.lead_name ?? "—"}</td>
                <td className="px-4 py-3 text-text-secondary">{p.project_type ?? "—"}</td>
                <td className="px-4 py-3 text-text-secondary">{p.project_location ?? "—"}</td>
                <td className="px-4 py-3 text-text-secondary">{p.intent_to_proceed ?? "—"}</td>
                <td className="px-4 py-3 text-text-secondary">{p.urgency_level ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-brand-light text-brand">
                    {p.project_status ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-text-muted">{p.quote_step ?? "—"}</td>
              </tr>
            ))}
            {(!projects || projects.length === 0) && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-text-muted text-sm">Sin proyectos registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
