import { createClient } from "@/lib/supabase/server";
import type { Meeting } from "@/types";

export default async function MeetingsPage({ params }: { params: Promise<{ clienteId: string }> }) {
  const { clienteId } = await params;
  const supabase = await createClient();

  const { data: meetings } = await supabase
    .from("meetings")
    .select("*")
    .eq("cliente_id", clienteId)
    .order("created_at", { ascending: false })
    .limit(100);

  const statusColor: Record<string, string> = {
    Agendada: "bg-success/10 text-success",
    Cancelada: "bg-danger/10 text-danger",
    Reagendada: "bg-warning/10 text-warning",
    Completada: "bg-brand-light text-brand",
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-text-primary">Citas</h1>
        <p className="text-sm text-text-secondary mt-0.5">{meetings?.length ?? 0} citas encontradas</p>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-slate-bg">
              {["Tipo", "Fecha", "Hora", "Estado", "Enlace / Direccion", "Recordatorio"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(meetings as Meeting[])?.map((m, i) => (
              <tr key={m.meeting_id} className={`border-b border-border last:border-0 hover:bg-slate-bg/50 transition-colors ${i % 2 === 0 ? "" : "bg-slate-bg/30"}`}>
                <td className="px-4 py-3 font-medium text-text-primary">{m.meeting_type ?? "—"}</td>
                <td className="px-4 py-3 text-text-secondary">{m.meeting_date ?? "—"}</td>
                <td className="px-4 py-3 font-mono text-xs text-text-secondary">{m.meeting_time ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[m.meeting_status ?? ""] ?? "bg-border text-text-muted"}`}>
                    {m.meeting_status ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-secondary truncate max-w-[180px]">{m.meeting_link_or_address ?? "—"}</td>
                <td className="px-4 py-3 text-text-secondary">{m.reminder_sent === "true" || m.reminder_sent === "1" ? "Enviado" : "Pendiente"}</td>
              </tr>
            ))}
            {(!meetings || meetings.length === 0) && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-text-muted text-sm">Sin citas registradas.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
