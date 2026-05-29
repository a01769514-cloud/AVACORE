"use client";

import {
  LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const BRAND_COLORS = ["#0052FF", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

interface LeadsOverTimeChartProps {
  data: { date: string; leads: number }[];
}
export function LeadsOverTimeChart({ data }: LeadsOverTimeChartProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-card">
      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">Captacion de leads</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9CA3AF" }} />
          <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} />
          <Tooltip
            contentStyle={{ border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12 }}
          />
          <Line type="monotone" dataKey="leads" stroke="#0052FF" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface IntentUrgencyChartProps {
  data: { name: string; intent: number; urgency: number }[];
}
export function IntentUrgencyChart({ data }: IntentUrgencyChartProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-card">
      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">Intencion vs Urgencia</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9CA3AF" }} />
          <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} />
          <Tooltip contentStyle={{ border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="intent" fill="#0052FF" name="Intencion" radius={[3, 3, 0, 0]} />
          <Bar dataKey="urgency" fill="#10B981" name="Urgencia alta" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface LeadSourceChartProps {
  data: { name: string; value: number }[];
}
export function LeadSourceChart({ data }: LeadSourceChartProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-card">
      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">Origen de leads</p>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
            {data.map((_, i) => (
              <Cell key={i} fill={BRAND_COLORS[i % BRAND_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
