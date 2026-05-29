import { getDashboardStats, generateInsights, getLeadsOverTime, getLeadSourceDistribution, getIntentUrgencyComparison } from "@/lib/utils/queries";
import StatCard from "@/components/dashboard/StatCard";
import InsightsPanel from "@/components/dashboard/InsightsPanel";
import { LeadsOverTimeChart, IntentUrgencyChart, LeadSourceChart } from "@/components/dashboard/Charts";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ clienteId: string }>;
}) {
  const { clienteId } = await params;

  const [stats, leadsOverTime, leadSources, intentUrgency] = await Promise.all([
    getDashboardStats(clienteId),
    getLeadsOverTime(clienteId),
    getLeadSourceDistribution(clienteId),
    getIntentUrgencyComparison(clienteId),
  ]);

  const insights = generateInsights(stats);

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">Dashboard General</h1>
        <p className="text-sm text-text-secondary mt-0.5">Metricas en tiempo real del sistema AVA</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total de Leads" value={stats.totalLeads} accent="blue" />
        <StatCard label="Citas Agendadas" value={stats.scheduledMeetings} accent="green" />
        <StatCard label="Canceladas / Reagendadas" value={stats.cancelledMeetings} accent="yellow" />
        <StatCard label="Proyectos Etapa 1" value={stats.activeProjects} accent="blue" />
      </div>

      {/* AVA Insights */}
      <InsightsPanel insights={insights} />

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <LeadsOverTimeChart data={leadsOverTime} />
        <LeadSourceChart data={leadSources} />
      </div>
      <div className="grid grid-cols-1 gap-4">
        <IntentUrgencyChart data={intentUrgency} />
      </div>
    </div>
  );
}
