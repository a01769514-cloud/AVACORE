import { createClient } from "@/lib/supabase/server";
import type { MockCampaign } from "@/types";
import { ExternalLink, Server } from "lucide-react";

export default async function CampaignsPage({ params }: { params: Promise<{ clienteId: string }> }) {
  const { clienteId } = await params;
  const supabase = await createClient();

  const { data: campaigns } = await supabase
    .from("mock_campaigns")
    .select("*")
    .eq("cliente_id", clienteId)
    .order("period_start", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">Campanas y Landing Page</h1>
        <p className="text-sm text-text-secondary mt-0.5">Datos de campaña (simulados hasta integracion de APIs)</p>
      </div>

      {/* Landing Page Card */}
      <div className="bg-card border border-border rounded-lg p-5 shadow-card">
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Landing Page</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <div>
              <p className="text-sm font-medium text-text-primary">Servidor activo</p>
              <p className="text-xs text-text-muted">Velocidad estimada: 1.2s — Landingsite.ai</p>
            </div>
          </div>
          <a
            href="#"
            className="flex items-center gap-1.5 text-xs text-brand border border-brand/30 px-3 py-1.5 rounded-md hover:bg-brand-light transition-colors"
          >
            <ExternalLink size={12} />
            Ver landing
          </a>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Anuncios</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-slate-bg">
              {["Campana", "Plataforma", "Inversion", "Clics", "Impresiones", "Periodo"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(campaigns as MockCampaign[])?.map((c, i) => (
              <tr key={c.id} className={`border-b border-border last:border-0 hover:bg-slate-bg/50 ${i % 2 === 0 ? "" : "bg-slate-bg/30"}`}>
                <td className="px-4 py-3 font-medium text-text-primary">{c.campaign_name ?? "—"}</td>
                <td className="px-4 py-3 text-text-secondary">{c.platform ?? "—"}</td>
                <td className="px-4 py-3 font-mono text-sm text-text-primary">${c.investment?.toLocaleString() ?? "—"}</td>
                <td className="px-4 py-3 text-text-secondary">{c.clicks?.toLocaleString() ?? "—"}</td>
                <td className="px-4 py-3 text-text-secondary">{c.impressions?.toLocaleString() ?? "—"}</td>
                <td className="px-4 py-3 font-mono text-xs text-text-muted">
                  {c.period_start ? `${c.period_start} — ${c.period_end}` : "—"}
                </td>
              </tr>
            ))}
            {(!campaigns || campaigns.length === 0) && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-text-muted text-sm">Sin datos de campaña. Se cargaran cuando el cliente tenga campanas activas.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
