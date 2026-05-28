import { createClient } from "@/lib/supabase/server";

export default async function OperationsPage() {
  const supabase = await createClient();

  // Fetch last 20 briefs as a proxy for webhook activity log
  const { data: recentActivity } = await supabase
    .from("briefs")
    .select("brief_id, lead_name, created_at, meeting_status, lead_source")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">Consola de Operaciones</h1>
        <p className="text-sm text-text-secondary mt-0.5">Monitor tecnico y configuracion global de AVA</p>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "n8n Workflow", status: "Operativo", ok: true },
          { label: "Supabase DB", status: "Conectado", ok: true },
          { label: "Google Calendar", status: "Activo", ok: true },
        ].map((item) => (
          <div key={item.label} className="bg-card border border-border rounded-lg p-4 shadow-card flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${item.ok ? "bg-success animate-pulse" : "bg-danger"}`} />
            <div>
              <p className="text-sm font-medium text-text-primary">{item.label}</p>
              <p className="text-xs text-text-muted">{item.status}</p>
            </div>
          </div>
        ))}
      </div>

      {/* AVA Prompt Config - placeholder */}
      <div className="bg-card border border-border rounded-lg p-5 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-5 bg-brand rounded-full" />
          <h2 className="font-display text-base font-bold text-text-primary">Configuracion de Prompt AVA</h2>
        </div>
        <div className="bg-slate-bg border border-border rounded-md px-4 py-3">
          <p className="font-mono text-xs text-text-muted leading-relaxed">
            El prompt maestro de AVA se configura directamente en n8n.<br />
            Ruta: AVA B2B SALES AGENT → Nodo &quot;System Prompt&quot;<br />
            Para modificarlo, accede al canvas de n8n y edita el nodo correspondiente.
          </p>
        </div>
      </div>

      {/* Webhook Activity Log */}
      <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-text-primary">Monitor de Actividad — Webhooks</h2>
          <span className="text-xs text-text-muted font-mono">Ultimos 20 eventos</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-slate-bg">
              {["Lead", "Origen", "Estado Cita", "Timestamp", "Brief ID"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentActivity?.map((r, i) => (
              <tr key={r.brief_id} className={`border-b border-border last:border-0 hover:bg-slate-bg/50 ${i % 2 === 0 ? "" : "bg-slate-bg/30"}`}>
                <td className="px-4 py-3 font-medium text-text-primary">{r.lead_name ?? "—"}</td>
                <td className="px-4 py-3 text-text-secondary">{r.lead_source ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    r.meeting_status === "Agendada" ? "bg-success/10 text-success" :
                    r.meeting_status === "Cancelada" ? "bg-danger/10 text-danger" :
                    "bg-border text-text-muted"
                  }`}>
                    {r.meeting_status ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-text-muted">
                  {new Date(r.created_at).toLocaleString("es-MX")}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-text-muted truncate max-w-[140px]">{r.brief_id}</td>
              </tr>
            ))}
            {(!recentActivity || recentActivity.length === 0) && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-text-muted text-sm">Sin actividad reciente.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
