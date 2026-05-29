import { createClient } from "@/lib/supabase/server";

interface InfraModule {
  title: string;
  subtitle: string;
  envUrl: string | undefined;
}

const operationsModules: InfraModule[] = [
  { title: "N8N", subtitle: "Workflow automations", envUrl: process.env.NEXT_PUBLIC_N8N_URL },
  { title: "SUPABASE", subtitle: "Backend and database", envUrl: process.env.NEXT_PUBLIC_SUPABASE_URL },
  { title: "GOOGLE CALENDAR", subtitle: "Appointment handling", envUrl: process.env.NEXT_PUBLIC_GCAL_URL },
  { title: "GITHUB", subtitle: "Code version control", envUrl: process.env.NEXT_PUBLIC_GITHUB_URL },
  { title: "VERCEL", subtitle: "Frontend, deployment and hosting", envUrl: process.env.NEXT_PUBLIC_VERCEL_URL },
  { title: "GOOGLE ADS", subtitle: "Ad campaigns", envUrl: process.env.NEXT_PUBLIC_GOOGLE_ADS_URL },
];

interface BriefRow {
  brief_id: string;
  lead_name: string | null;
  created_at: string;
  meeting_status: string | null;
  lead_source: string | null;
}

export default async function OperationsPage() {
  const supabase = await createClient();
  const { data: recentActivity } = await supabase
    .from("briefs")
    .select("brief_id, lead_name, created_at, meeting_status, lead_source")
    .order("created_at", { ascending: false })
    .limit(20);

  const rows = (recentActivity ?? []) as BriefRow[];
  const alerts = rows.filter(r => !r.lead_name || !r.meeting_status || !r.lead_source);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>Operaciones</h1>
      </div>

      {/* Infrastructure Grid */}
      <div className="grid grid-cols-3 gap-3">
        {operationsModules.map((mod) => (
          <a
            key={mod.title}
            href={mod.envUrl ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-card rounded-xl p-5 flex flex-col gap-3 group cursor-pointer"
            style={{
              border: "2px solid rgba(10,25,47,0.12)",
              boxShadow: "var(--shadow-card)",
              transition: "box-shadow 0.2s ease, transform 0.2s ease",
              textDecoration: "none",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px -4px rgba(10,25,47,0.15)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            <div className="flex items-center justify-between">
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--color-success)", boxShadow: "0 0 0 3px rgba(5,150,105,0.15)" }} />
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 10L10 2M10 2H4M10 2V8" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="font-display font-bold tracking-tight" style={{ color: "var(--color-text-primary)", fontSize: "15px" }}>{mod.title}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{mod.subtitle}</p>
            </div>
            {!mod.envUrl && (
              <p className="text-[10px] font-mono" style={{ color: "var(--color-warning)" }}>env var no configurada</p>
            )}
          </a>
        ))}
      </div>

      {/* Webhook Activity Log */}
      <div className="bg-card rounded-xl overflow-hidden" style={{ border: "2px solid rgba(10,25,47,0.1)" }}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(10,25,47,0.08)" }}>
          <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Monitor de Actividad — Webhooks</p>
          <span className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>Ultimos 20 eventos</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(10,25,47,0.08)", background: "var(--color-slate-bg)" }}>
              {["Lead", "Origen", "Estado Cita", "Timestamp", "Brief ID"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.brief_id} style={{ borderBottom: "1px solid rgba(10,25,47,0.05)", background: i % 2 !== 0 ? "rgba(248,250,252,0.6)" : "transparent" }}>
                <td className="px-5 py-3 font-medium" style={{ color: "var(--color-text-primary)" }}>{r.lead_name ?? "—"}</td>
                <td className="px-5 py-3" style={{ color: "var(--color-text-secondary)" }}>{r.lead_source ?? "—"}</td>
                <td className="px-5 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{
                    background: r.meeting_status === "Agendada" ? "rgba(5,150,105,0.1)" : r.meeting_status === "Cancelada" ? "rgba(220,38,38,0.1)" : "rgba(148,163,184,0.15)",
                    color: r.meeting_status === "Agendada" ? "var(--color-success)" : r.meeting_status === "Cancelada" ? "var(--color-danger)" : "var(--color-text-muted)",
                  }}>
                    {r.meeting_status ?? "—"}
                  </span>
                </td>
                <td className="px-5 py-3 font-mono text-xs" style={{ color: "var(--color-text-muted)" }}>{new Date(r.created_at).toLocaleString("es-MX")}</td>
                <td className="px-5 py-3 font-mono text-xs" style={{ color: "var(--color-text-muted)" }}>{r.brief_id.substring(0, 20)}...</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>Sin actividad reciente.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Alerts */}
      <div className="bg-card rounded-xl overflow-hidden" style={{ border: "2px solid rgba(10,25,47,0.1)" }}>
        <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(10,25,47,0.08)" }}>
          <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Alertas del Sistema</p>
          {alerts.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(220,38,38,0.1)", color: "var(--color-danger)" }}>{alerts.length}</span>
          )}
        </div>
        <div className="p-5">
          {alerts.length > 0 ? (
            <div className="space-y-2">
              {alerts.map((a) => (
                <div key={a.brief_id} className="rounded-lg px-3 py-2.5 text-xs" style={{ background: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.15)", color: "var(--color-text-primary)" }}>
                  Brief <span className="font-mono">{a.brief_id.substring(0, 18)}...</span> — campos nulos:
                  {!a.lead_name && " lead_name"}{!a.meeting_status && " meeting_status"}{!a.lead_source && " lead_source"}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg px-3 py-2.5 text-xs" style={{ background: "rgba(5,150,105,0.05)", border: "1px solid rgba(5,150,105,0.15)", color: "var(--color-success)" }}>
              Sin alertas activas. Todos los webhooks recientes estan completos.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
