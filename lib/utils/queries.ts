import { createClient } from "@/lib/supabase/server";
import type { DashboardStats, InsightBlock } from "@/types";

export async function getDashboardStats(clienteId: string): Promise<DashboardStats> {
  const supabase = await createClient();

  const [leadsRes, scheduledRes, cancelledRes, projectsRes] = await Promise.all([
    supabase.from("leads").select("lead_id", { count: "exact", head: true }).eq("cliente_id", clienteId),
    supabase.from("meetings").select("meeting_id", { count: "exact", head: true }).eq("cliente_id", clienteId).eq("meeting_status", "Agendada"),
    supabase.from("meetings").select("meeting_id", { count: "exact", head: true }).eq("cliente_id", clienteId).in("meeting_status", ["Cancelada", "Reagendada"]),
    supabase.from("projects").select("project_id", { count: "exact", head: true }).eq("cliente_id", clienteId).eq("project_status", "Etapa 1"),
  ]);

  return {
    totalLeads: leadsRes.count ?? 0,
    scheduledMeetings: scheduledRes.count ?? 0,
    cancelledMeetings: cancelledRes.count ?? 0,
    activeProjects: projectsRes.count ?? 0,
  };
}

export function generateInsights(stats: DashboardStats): InsightBlock[] {
  const insights: InsightBlock[] = [];
  const conversionRate = stats.totalLeads > 0 ? (stats.scheduledMeetings / stats.totalLeads) * 100 : 0;
  const cancellationRate = stats.scheduledMeetings > 0 ? (stats.cancelledMeetings / stats.scheduledMeetings) * 100 : 0;

  if (conversionRate >= 35) {
    insights.push({
      type: "strength",
      message: `La tasa de conversion de AVA es ${conversionRate.toFixed(1)}%, indicando una calificacion optima de prospectos.`,
    });
  } else if (conversionRate > 0) {
    insights.push({
      type: "optimization",
      message: `La tasa de conversion es ${conversionRate.toFixed(1)}%. Se recomienda revisar el prompt de calificacion de AVA para mejorar el filtrado inicial.`,
    });
  }

  if (cancellationRate > 15) {
    insights.push({
      type: "optimization",
      message: `Se detecta un ${cancellationRate.toFixed(1)}% de cancelaciones. Ajustar el flujo de confirmacion de citas en AVA para validar disponibilidad antes del agendamiento.`,
    });
  } else if (stats.scheduledMeetings > 0) {
    insights.push({
      type: "strength",
      message: `El indice de cancelaciones se mantiene bajo (${cancellationRate.toFixed(1)}%), indicando calidad alta en el agendamiento.`,
    });
  }

  if (stats.activeProjects >= 5) {
    insights.push({
      type: "strength",
      message: `${stats.activeProjects} proyectos activos en Etapa 1 generan un pipeline solido para el equipo de ventas.`,
    });
  }

  if (insights.length === 0) {
    insights.push({
      type: "optimization",
      message: "Insuficientes datos para generar analisis. El sistema requiere al menos 10 leads para calcular metricas de rendimiento.",
    });
  }

  return insights;
}

export async function getLeadsOverTime(clienteId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("created_at")
    .eq("cliente_id", clienteId)
    .order("created_at", { ascending: true });

  if (!data) return [];

  const grouped: Record<string, number> = {};
  data.forEach(({ created_at }) => {
    const date = new Date(created_at).toLocaleDateString("es-MX", { month: "short", day: "numeric" });
    grouped[date] = (grouped[date] ?? 0) + 1;
  });

  return Object.entries(grouped).map(([date, count]) => ({ date, leads: count }));
}

export async function getLeadSourceDistribution(clienteId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("leads").select("lead_source").eq("cliente_id", clienteId);
  if (!data) return [];
  const grouped: Record<string, number> = {};
  data.forEach(({ lead_source }) => {
    const key = lead_source ?? "Desconocido";
    grouped[key] = (grouped[key] ?? 0) + 1;
  });
  return Object.entries(grouped).map(([name, value]) => ({ name, value }));
}

export async function getIntentUrgencyComparison(clienteId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("intent_to_proceed, urgency_level").eq("cliente_id", clienteId);
  if (!data) return [];
  const grouped: Record<string, { intent: number; urgency: number }> = {};
  data.forEach(({ intent_to_proceed, urgency_level }) => {
    const key = intent_to_proceed ?? "Sin datos";
    if (!grouped[key]) grouped[key] = { intent: 0, urgency: 0 };
    grouped[key].intent += 1;
    if (urgency_level === "Alta" || urgency_level === "alta") grouped[key].urgency += 1;
  });
  return Object.entries(grouped).map(([name, vals]) => ({ name, ...vals }));
}
