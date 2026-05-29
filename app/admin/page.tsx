import { createClient } from "@/lib/supabase/server";

function getRangeDate(range: string): string {
  const now = new Date();
  switch (range) {
    case "today": { const d = new Date(now); d.setHours(0,0,0,0); return d.toISOString(); }
    case "week": { const d = new Date(now); d.setDate(d.getDate() - 7); return d.toISOString(); }
    case "90d": { const d = new Date(now); d.setDate(d.getDate() - 90); return d.toISOString(); }
    default: { const d = new Date(now); d.setDate(d.getDate() - 30); return d.toISOString(); }
  }
}

async function getDashboardStats(since: string) {
  const supabase = await createClient();

  const [leadsTotal, meetingsScheduled, meetingsCancelled, mqls, leadsByDay, tempData] = await Promise.all([
    supabase.from("leads").select("lead_id", { count: "exact", head: true }).gte("created_at", since),
    supabase.from("meetings").select("meeting_id", { count: "exact", head: true }).eq("meeting_status", "Agendada").gte("created_at", since),
    supabase.from("meetings").select("meeting_id", { count: "exact", head: true }).eq("meeting_status", "Cancelada").gte("created_at", since),
    supabase.from("briefs").select("brief_id", { count: "exact", head: true }).eq("intent_to_proceed", "Alto").gte("created_at", since),
    supabase.from("leads").select("created_at").gte("created_at", since).order("created_at"),
    supabase.from("briefs").select("urgency_level").gte("created_at", since),
  ]);

  const totalMeetings = (meetingsScheduled.count ?? 0) + (meetingsCancelled.count ?? 0);
  const cancellationRate = totalMeetings > 0 ? (((meetingsCancelled.count ?? 0) / totalMeetings) * 100).toFixed(1) : "0";
  const conversionRate = leadsTotal.count ? (((meetingsScheduled.count ?? 0) / leadsTotal.count) * 100).toFixed(1) : "0";

  // Temperature distribution
  const temps: Record<string, number> = { "Alto": 0, "Medio": 0, "Bajo": 0 };
  (tempData.data ?? []).forEach((b: any) => {
    const v = b.urgency_level ?? "Bajo";
    if (v === "Alto" || v.toLowerCase() === "alta" || v.toLowerCase() === "high") temps["Alto"]++;
    else if (v === "Medio" || v.toLowerCase() === "media" || v.toLowerCase() === "medium") temps["Medio"]++;
    else temps["Bajo"]++;
  });

  return {
    totalLeads: leadsTotal.count ?? 0,
    scheduledMeetings: meetingsScheduled.count ?? 0,
    conversionRate,
    mqls: mqls.count ?? 0,
    cancellationRate,
    leadsByDay: leadsByDay.data ?? [],
    temps,
  };
}

function buildChartData(leads: { created_at: string }[]) {
  const grouped: Record<string, number> = {};
  leads.forEach(({ created_at }) => {
    const d = new Date(created_at);
    const key = `${d.getDate()}/${d.getMonth() + 1}`;
    grouped[key] = (grouped[key] ?? 0) + 1;
  });
  return Object.entries(grouped).map(([date, count]) => ({ date, count }));
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ range?: string }>;
}) {
  const params = await searchParams;
  const range = params?.range ?? "30d";
  const since = getRangeDate(range);
  const stats = await getDashboardStats(since);
  const chartData = buildChartData(stats.leadsByDay);
  const maxCount = Math.max(...chartData.map(d => d.count), 1);
  const totalTemp = Object.values(stats.temps).reduce((a, b) => a + b, 0) || 1;

  const RANGE_LABELS: Record<string, string> = {
    today: "Hoy", week: "Esta semana", "30d": "Ultimos 30 dias", "90d": "Ultimos 90 dias"
  };

  const tempConfig = [
    { key: "Alto", label: "Caliente", color: "#DC2626" },
    { key: "Medio", label: "Templado", color: "#D97706" },
    { key: "Bajo", label: "Frio", color: "#475569" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>Dashboard</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>{RANGE_LABELS[range]}</p>
      </div>

      {/* KPI Row 1 */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Leads", value: stats.totalLeads, accent: "#0A192F" },
          { label: "Citas Agendadas", value: stats.scheduledMeetings, accent: "var(--color-success)" },
          { label: "Tasa de Conversion", value: `${stats.conversionRate}%`, accent: "#0A192F" },
        ].map((card) => (
          <div key={card.label} className="bg-card rounded-xl p-5" style={{ border: "2px solid rgba(10,25,47,0.1)", boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>{card.label}</p>
              <div className="w-1 h-6 rounded-full" style={{ background: card.accent }} />
            </div>
            <p className="font-display text-4xl font-bold" style={{ color: "var(--color-text-primary)" }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* KPI Row 2 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card rounded-xl p-5" style={{ border: "2px solid rgba(10,25,47,0.1)", boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>Leads Calificados (MQLs)</p>
            <div className="w-1 h-6 rounded-full" style={{ background: "#059669" }} />
          </div>
          <p className="font-display text-4xl font-bold" style={{ color: "var(--color-text-primary)" }}>{stats.mqls}</p>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>intent_to_proceed = Alto</p>
        </div>
        <div className="bg-card rounded-xl p-5" style={{ border: "2px solid rgba(10,25,47,0.1)", boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>Tasa de Cancelacion</p>
            <div className="w-1 h-6 rounded-full" style={{ background: "#DC2626" }} />
          </div>
          <p className="font-display text-4xl font-bold" style={{ color: "var(--color-text-primary)" }}>{stats.cancellationRate}%</p>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Citas canceladas vs total</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Line chart - Leads */}
        <div className="col-span-2 bg-card rounded-xl p-5" style={{ border: "2px solid rgba(10,25,47,0.1)", boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 rounded-full" style={{ background: "#0A192F" }} />
            <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Captacion de Leads</p>
          </div>

          {chartData.length > 0 ? (
            <div className="flex items-end gap-1 h-32">
              {chartData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                  <div className="relative w-full flex flex-col items-center justify-end h-full">
                    <div
                      className="w-full rounded-sm transition-all"
                      style={{
                        height: `${(d.count / maxCount) * 100}%`,
                        minHeight: "4px",
                        background: "#0A192F",
                        opacity: 0.75,
                      }}
                    />
                  </div>
                  {chartData.length <= 14 && (
                    <p className="text-[9px] font-mono mt-1" style={{ color: "var(--color-text-muted)" }}>{d.date}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center">
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Sin datos en el periodo seleccionado.</p>
            </div>
          )}
        </div>

        {/* Temperature chart */}
        <div className="bg-card rounded-xl p-5" style={{ border: "2px solid rgba(10,25,47,0.1)", boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 rounded-full" style={{ background: "#0A192F" }} />
            <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Temperatura de Leads</p>
          </div>

          <div className="space-y-3">
            {tempConfig.map(({ key, label, color }) => {
              const count = stats.temps[key] ?? 0;
              const pct = Math.round((count / totalTemp) * 100);
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                      <p className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>{label}</p>
                    </div>
                    <p className="text-xs font-mono font-bold" style={{ color: "var(--color-text-primary)" }}>{count}</p>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(10,25,47,0.07)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color, opacity: 0.85 }} />
                  </div>
                </div>
              );
            })}
          </div>

          {totalTemp === 1 && (
            <p className="text-xs mt-4 text-center" style={{ color: "var(--color-text-muted)" }}>Sin datos.</p>
          )}
        </div>
      </div>
    </div>
  );
}
