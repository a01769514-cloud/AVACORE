import { getLeadsOverTime, getLeadSourceDistribution, getIntentUrgencyComparison, getDashboardStats } from "@/lib/utils/queries";
import { LeadsOverTimeChart, IntentUrgencyChart, LeadSourceChart } from "@/components/dashboard/Charts";
import StatCard from "@/components/dashboard/StatCard";

export default async function AnalyticsPage({ params }: { params: Promise<{ clienteId: string }> }) {
  const { clienteId } = await params;

  const [stats, leadsOverTime, leadSources, intentUrgency] = await Promise.all([
    getDashboardStats(clienteId),
    getLeadsOverTime(clienteId),
    getLeadSourceDistribution(clienteId),
    getIntentUrgencyComparison(clienteId),
  ]);

  const conversionRate = stats.totalLeads > 0
    ? ((stats.scheduledMeetings / stats.totalLeads) * 100).toFixed(1)
    : "0";

  const cancellationRate = stats.scheduledMeetings > 0
    ? ((stats.cancelledMeetings / stats.scheduledMeetings) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">Analisis de Metricas</h1>
        <p className="text-sm text-text-secondary mt-0.5">Graficos interactivos de rendimiento del sistema</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Tasa de Conversion" value={`${conversionRate}%`} accent="green" trend="Leads → Citas" />
        <StatCard label="Tasa de Cancelacion" value={`${cancellationRate}%`} accent="yellow" trend="Citas canceladas" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <LeadsOverTimeChart data={leadsOverTime} />
        <LeadSourceChart data={leadSources} />
      </div>
      <IntentUrgencyChart data={intentUrgency} />
    </div>
  );
}
