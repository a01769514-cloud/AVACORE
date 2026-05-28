import { TrendingUp, AlertTriangle } from "lucide-react";
import type { InsightBlock } from "@/types";

interface InsightsPanelProps {
  insights: InsightBlock[];
}

export default function InsightsPanel({ insights }: InsightsPanelProps) {
  const strengths = insights.filter((i) => i.type === "strength");
  const optimizations = insights.filter((i) => i.type === "optimization");

  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1.5 h-5 bg-brand rounded-full" />
        <h2 className="font-display text-base font-bold text-text-primary">Analisis de Rendimiento de AVA</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Strengths */}
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <TrendingUp size={13} className="text-success" />
            <p className="text-xs font-semibold text-success uppercase tracking-wider">Puntos fuertes</p>
          </div>
          <div className="space-y-2">
            {strengths.length > 0 ? (
              strengths.map((s, i) => (
                <div key={i} className="bg-success/5 border border-success/15 rounded-md px-3 py-2.5">
                  <p className="text-xs text-text-primary leading-relaxed">{s.message}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-text-muted italic">Sin datos suficientes.</p>
            )}
          </div>
        </div>

        {/* Optimizations */}
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <AlertTriangle size={13} className="text-warning" />
            <p className="text-xs font-semibold text-warning uppercase tracking-wider">Areas de optimizacion</p>
          </div>
          <div className="space-y-2">
            {optimizations.length > 0 ? (
              optimizations.map((o, i) => (
                <div key={i} className="bg-warning/5 border border-warning/15 rounded-md px-3 py-2.5">
                  <p className="text-xs text-text-primary leading-relaxed">{o.message}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-text-muted italic">Sin alertas activas.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
