import { cn } from "@/lib/utils/cn";

interface StatCardProps {
  label: string;
  value: number | string;
  trend?: string;
  trendUp?: boolean;
  accent?: "blue" | "green" | "yellow" | "red";
}

const accentMap = {
  blue: "bg-brand-light text-brand",
  green: "bg-success/10 text-success",
  yellow: "bg-warning/10 text-warning",
  red: "bg-danger/10 text-danger",
};

export default function StatCard({ label, value, trend, trendUp, accent = "blue" }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-card">
      <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">{label}</p>
      <div className="flex items-end justify-between">
        <p className="font-display text-3xl font-bold text-text-primary">{value}</p>
        {trend && (
          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", accentMap[accent])}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
