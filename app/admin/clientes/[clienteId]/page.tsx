import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Cliente {
  cliente_id: string;
  company_name: string;
  active: boolean;
  created_at: string;
}

interface Brief {
  brief_id: string;
  lead_name: string | null;
  project_type: string | null;
  intent_to_proceed: string | null;
  urgency_level: string | null;
  meeting_status: string | null;
  created_at: string;
}

interface Meeting {
  meeting_id: string;
  meeting_status: string | null;
  created_at: string;
}

interface Project {
  project_id: string;
  quote_step: string | null;
  booking_flow: string | null;
  created_at: string;
}

type InsightType = "fortaleza" | "oportunidad";
type TabOrigin = "dashboard" | "pipeline" | "anuncios" | "email" | "landing";
type Importance = "ALTA" | "MEDIA" | "BAJA";

interface OperationalInsight {
  type: InsightType;
  tabOrigin: TabOrigin;
  title: string;
  description: string;
  importance: Importance;
  recommendedAction: string;
}

// ─── Pipeline mapping ─────────────────────────────────────────────────────────

const PIPELINE_STAGES = [
  { key: "contacto", label: "Contacto inicial" },
  { key: "calificado", label: "Lead calificado" },
  { key: "agendado", label: "Lead agendado" },
  { key: "recordatorio", label: "Recordatorio mandado" },
];

function classifyStage(project: Project): string {
  const step = (project.quote_step ?? project.booking_flow ?? "").toLowerCase();
  if (step.includes("recordatorio") || step.includes("reminder")) return "recordatorio";
  if (step.includes("agendado") || step.includes("meeting") || step.includes("cita")) return "agendado";
  if (step.includes("calificado") || step.includes("brief") || step.includes("qualified")) return "calificado";
  return "contacto";
}

// ─── Insights engine ──────────────────────────────────────────────────────────

function generateInsights(
  briefs: Brief[],
  meetings: Meeting[],
  _leads: Brief[]
): OperationalInsight[] {
  const results: OperationalInsight[] = [];

  const scheduled = meetings.filter(m => m.meeting_status === "Agendada").length;
  const cancelled = meetings.filter(m => m.meeting_status === "Cancelada").length;
  const total = meetings.length;

  // Cancellation rate check
  if (total > 0) {
    const cancelRate = (cancelled / total) * 100;
    if (cancelRate > 30) {
      results.push({
        type: "oportunidad",
        tabOrigin: "dashboard",
        title: "Tasa de cancelacion elevada",
        description: `${cancelRate.toFixed(0)}% de las citas fueron canceladas.`,
        importance: "ALTA",
        recommendedAction: "Revisar los tiempos de envio del flujo Recordatorio mandado y ajustar la ventana de confirmacion previa a la cita.",
      });
    } else if (scheduled > 3) {
      results.push({
        type: "fortaleza",
        tabOrigin: "dashboard",
        title: "Pipeline de citas activo",
        description: `${scheduled} citas agendadas con tasa de cancelacion dentro del rango aceptable.`,
        importance: "MEDIA",
        recommendedAction: "Mantener el flujo actual de calificacion.",
      });
    }
  }

  // MQL rate
  const mqls = briefs.filter(b => b.intent_to_proceed?.toLowerCase() === "alto" || b.intent_to_proceed?.toLowerCase() === "alta").length;
  if (briefs.length > 0 && mqls / briefs.length < 0.3) {
    results.push({
      type: "oportunidad",
      tabOrigin: "pipeline",
      title: "Baja tasa de calificacion",
      description: `Solo ${mqls} de ${briefs.length} leads tienen intencion alta de avanzar.`,
      importance: "ALTA",
      recommendedAction: "Revisar las preguntas de calificacion en el flujo de AVA para filtrar prospectos de mayor interes.",
    });
  }

  // Landing CTA mock check — placeholder rule for WhatsApp CTA
  const mockCtaClicks = 12;
  const mockVisits = 320;
  if (mockCtaClicks / mockVisits < 0.08) {
    results.push({
      type: "oportunidad",
      tabOrigin: "landing",
      title: "CTA de WhatsApp con bajo CTR",
      description: `Solo ${mockCtaClicks} clics sobre ${mockVisits} visitas (${((mockCtaClicks / mockVisits) * 100).toFixed(1)}%).`,
      importance: "ALTA",
      recommendedAction: "Optimizar el copy del boton CTA y considerar reubicarlo en una posicion de mayor visibilidad dentro del viewport inicial.",
    });
  }

  return results;
}

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getClienteData(clienteId: string) {
  const supabase = await createClient();
  const [clienteRes, briefsRes, meetingsRes, projectsRes] = await Promise.all([
    supabase.from("clientes").select("*").eq("cliente_id", clienteId).single(),
    supabase.from("briefs").select("*").eq("cliente_id", clienteId).order("created_at", { ascending: false }).limit(50),
    supabase.from("meetings").select("*").eq("cliente_id", clienteId).order("created_at", { ascending: false }).limit(50),
    supabase.from("projects").select("*").eq("cliente_id", clienteId).order("created_at", { ascending: false }).limit(50),
  ]);
  return {
    cliente: clienteRes.data as Cliente | null,
    briefs: (briefsRes.data ?? []) as Brief[],
    meetings: (meetingsRes.data ?? []) as Meeting[],
    projects: (projectsRes.data ?? []) as Project[],
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ClienteDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ clienteId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { clienteId } = await params;
  const { tab = "dashboard" } = await searchParams;
  const { cliente, briefs, meetings, projects } = await getClienteData(clienteId);
  if (!cliente) notFound();

  const insights = generateInsights(briefs, meetings, briefs);

  // Pipeline counts
  const pipelineCounts: Record<string, number> = { contacto: 0, calificado: 0, agendado: 0, recordatorio: 0 };
  projects.forEach(p => { pipelineCounts[classifyStage(p)]++; });
  const maxPipeline = Math.max(...Object.values(pipelineCounts), 1);

  const scheduled = meetings.filter(m => m.meeting_status === "Agendada").length;
  const cancelled = meetings.filter(m => m.meeting_status === "Cancelada").length;

  const TABS = [
    { key: "dashboard", label: "Dashboard" },
    { key: "pipeline", label: "Pipeline" },
    { key: "anuncios", label: "Anuncios" },
    { key: "email", label: "Email Marketing" },
    { key: "landing", label: "Landing Pages" },
    { key: "insights", label: "Insights" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
          <Link href="/admin/clientes" className="hover:underline" style={{ color: "#0A192F" }}>Clientes</Link>
          <span>/</span>
          <span>{cliente.company_name}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: "#0A192F" }}>
              {cliente.company_name.charAt(0)}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>{cliente.company_name}</h1>
              <p className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>{cliente.cliente_id}</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(5,150,105,0.1)", color: "var(--color-success)" }}>
            {cliente.active ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Briefs recibidos", value: briefs.length },
          { label: "Citas agendadas", value: scheduled },
          { label: "Proyectos activos", value: projects.length },
        ].map((s) => (
          <div key={s.label} className="bg-card border-2 rounded-xl p-4" style={{ borderColor: "rgba(10,25,47,0.1)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-secondary)" }}>{s.label}</p>
            <p className="font-display text-3xl font-bold" style={{ color: "var(--color-text-primary)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tab panel */}
      <div className="bg-card rounded-xl overflow-hidden" style={{ border: "2px solid rgba(10,25,47,0.1)" }}>
        <div className="flex" style={{ borderBottom: "2px solid rgba(10,25,47,0.08)" }}>
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={`/admin/clientes/${clienteId}?tab=${t.key}`}
              className="px-4 py-3 text-xs font-medium transition-colors border-b-2 whitespace-nowrap"
              style={{
                borderBottomColor: tab === t.key ? "#0A192F" : "transparent",
                color: tab === t.key ? "#0A192F" : "var(--color-text-secondary)",
                background: tab === t.key ? "rgba(10,25,47,0.03)" : "transparent",
              }}
            >
              {t.label}
            </Link>
          ))}
        </div>

        <div className="p-5">

          {/* ── DASHBOARD TAB ── */}
          {tab === "dashboard" && (
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>Resumen de operaciones</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Citas agendadas", value: scheduled, color: "var(--color-success)" },
                  { label: "Citas canceladas", value: cancelled, color: "var(--color-danger)" },
                  { label: "MQLs (intent alto)", value: briefs.filter(b => b.intent_to_proceed?.toLowerCase() === "alto" || b.intent_to_proceed?.toLowerCase() === "alta").length, color: "#0A192F" },
                  { label: "Tasa cancelacion", value: meetings.length > 0 ? `${((cancelled / meetings.length) * 100).toFixed(1)}%` : "0%", color: "var(--color-warning)" },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-4" style={{ border: "2px solid rgba(10,25,47,0.08)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--color-text-secondary)" }}>{s.label}</p>
                    <p className="font-display text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PIPELINE TAB ── */}
          {tab === "pipeline" && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: "var(--color-text-secondary)" }}>
                Pipeline de conversion — {projects.length} proyectos
              </p>
              <div className="space-y-3">
                {PIPELINE_STAGES.map(({ key, label }) => {
                  const count = pipelineCounts[key] ?? 0;
                  return (
                    <div key={key} className="flex items-center gap-4">
                      <p className="w-40 text-xs font-medium shrink-0" style={{ color: "var(--color-text-secondary)" }}>{label}</p>
                      <div className="flex-1 h-7 rounded-lg overflow-hidden" style={{ background: "rgba(10,25,47,0.06)", border: "1px solid rgba(10,25,47,0.1)" }}>
                        <div
                          className="h-full flex items-center px-3 rounded-lg transition-all"
                          style={{ width: count > 0 ? `${(count / maxPipeline) * 100}%` : "0%", minWidth: count > 0 ? "40px" : "0", background: "#0A192F" }}
                        >
                          {count > 0 && <span className="text-xs font-bold text-white">{count}</span>}
                        </div>
                      </div>
                      <p className="w-6 text-xs font-mono text-right shrink-0" style={{ color: "var(--color-text-muted)" }}>{count}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── ANUNCIOS TAB ── */}
          {tab === "anuncios" && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--color-text-secondary)" }}>Rendimiento de campanas</p>
              <div className="rounded-lg px-4 py-3 mb-4 text-xs" style={{ background: "rgba(2,132,199,0.06)", border: "1px solid rgba(2,132,199,0.2)", color: "var(--color-info)" }}>
                Modulo en preparacion. Se activara con la integracion de Google Ads API.
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(10,25,47,0.08)" }}>
                    {["Campana", "Plataforma", "Inversion", "Clics", "Impresiones"].map(h => (
                      <th key={h} className="text-left pb-2.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Busqueda — Remodelacion CDMX", platform: "Google Ads", inv: 8500, clicks: 312, imp: 4200 },
                    { name: "Awareness — Construccion Residencial", platform: "Meta Ads", inv: 5200, clicks: 198, imp: 11800 },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(10,25,47,0.05)" }}>
                      <td className="py-2.5 pr-4 font-medium" style={{ color: "var(--color-text-primary)" }}>{row.name}</td>
                      <td className="py-2.5 pr-4" style={{ color: "var(--color-text-secondary)" }}>{row.platform}</td>
                      <td className="py-2.5 pr-4 font-mono" style={{ color: "var(--color-text-primary)" }}>${row.inv.toLocaleString()}</td>
                      <td className="py-2.5 pr-4" style={{ color: "var(--color-text-secondary)" }}>{row.clicks.toLocaleString()}</td>
                      <td className="py-2.5" style={{ color: "var(--color-text-secondary)" }}>{row.imp.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── EMAIL TAB ── */}
          {tab === "email" && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--color-text-secondary)" }}>Secuencias activas</p>
              <div className="rounded-lg px-4 py-3 mb-4 text-xs" style={{ background: "rgba(2,132,199,0.06)", border: "1px solid rgba(2,132,199,0.2)", color: "var(--color-info)" }}>
                Modulo en preparacion. Se activara con la integracion de la plataforma de email seleccionada.
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(10,25,47,0.08)" }}>
                    {["Secuencia", "Estado", "Enviados", "Apertura", "CTR"].map(h => (
                      <th key={h} className="text-left pb-2.5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Bienvenida + Credenciales", status: "Activa", sent: 48, open: "61%", ctr: "12%" },
                    { name: "Seguimiento post-cita", status: "Activa", sent: 22, open: "44%", ctr: "8%" },
                    { name: "Re-engagement 30 dias", status: "Pausada", sent: 14, open: "28%", ctr: "3%" },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(10,25,47,0.05)" }}>
                      <td className="py-2.5 pr-4 font-medium" style={{ color: "var(--color-text-primary)" }}>{row.name}</td>
                      <td className="py-2.5 pr-4">
                        <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: row.status === "Activa" ? "rgba(5,150,105,0.1)" : "rgba(148,163,184,0.15)", color: row.status === "Activa" ? "var(--color-success)" : "var(--color-text-muted)" }}>{row.status}</span>
                      </td>
                      <td className="py-2.5 pr-4 font-mono" style={{ color: "var(--color-text-primary)" }}>{row.sent}</td>
                      <td className="py-2.5 pr-4 font-mono" style={{ color: "var(--color-text-secondary)" }}>{row.open}</td>
                      <td className="py-2.5 font-mono" style={{ color: "var(--color-text-secondary)" }}>{row.ctr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── LANDING TAB ── */}
          {tab === "landing" && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--color-text-secondary)" }}>Rendimiento de landing pages</p>
              <div className="grid grid-cols-3 gap-4 mb-5">
                {[
                  { label: "Visitas totales", value: "320" },
                  { label: "Tasa de rebote", value: "58%" },
                  { label: "Clics CTA WhatsApp", value: "12" },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-4" style={{ border: "2px solid rgba(10,25,47,0.1)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--color-text-secondary)" }}>{s.label}</p>
                    <p className="font-display text-3xl font-bold" style={{ color: "var(--color-text-primary)" }}>{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg px-4 py-3 text-xs" style={{ background: "rgba(2,132,199,0.06)", border: "1px solid rgba(2,132,199,0.2)", color: "var(--color-info)" }}>
                Datos mock. Se conectaran con LandingSite AI o Google Analytics al activar la integracion.
              </div>
            </div>
          )}

          {/* ── INSIGHTS TAB ── */}
          {tab === "insights" && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: "var(--color-text-secondary)" }}>
                Centro de inteligencia — {insights.length} observaciones
              </p>
              {insights.length === 0 ? (
                <p className="text-sm text-center py-8" style={{ color: "var(--color-text-muted)" }}>Sin datos suficientes para generar observaciones.</p>
              ) : (
                <div className="space-y-3">
                  {insights.map((ins, i) => (
                    <div key={i} className="rounded-xl p-4" style={{
                      border: `1px solid ${ins.type === "fortaleza" ? "rgba(5,150,105,0.2)" : "rgba(217,119,6,0.2)"}`,
                      background: ins.type === "fortaleza" ? "rgba(5,150,105,0.04)" : "rgba(217,119,6,0.04)",
                    }}>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded" style={{
                              background: ins.type === "fortaleza" ? "rgba(5,150,105,0.15)" : "rgba(217,119,6,0.15)",
                              color: ins.type === "fortaleza" ? "var(--color-success)" : "var(--color-warning)",
                            }}>
                              {ins.type}
                            </span>
                            <span className="text-[10px] font-mono uppercase" style={{ color: "var(--color-text-muted)" }}>{ins.tabOrigin}</span>
                          </div>
                          <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{ins.title}</p>
                        </div>
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0" style={{
                          background: ins.importance === "ALTA" ? "rgba(220,38,38,0.1)" : ins.importance === "MEDIA" ? "rgba(217,119,6,0.1)" : "rgba(148,163,184,0.15)",
                          color: ins.importance === "ALTA" ? "var(--color-danger)" : ins.importance === "MEDIA" ? "var(--color-warning)" : "var(--color-text-muted)",
                        }}>
                          {ins.importance}
                        </span>
                      </div>
                      <p className="text-xs mb-2" style={{ color: "var(--color-text-secondary)" }}>{ins.description}</p>
                      <div className="rounded-lg px-3 py-2 text-xs" style={{ background: "rgba(10,25,47,0.04)", border: "1px solid rgba(10,25,47,0.08)" }}>
                        <span className="font-semibold" style={{ color: "var(--color-text-primary)" }}>Accion recomendada: </span>
                        <span style={{ color: "var(--color-text-secondary)" }}>{ins.recommendedAction}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
