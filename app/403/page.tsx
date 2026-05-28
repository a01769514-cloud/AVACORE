import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-slate-bg flex items-center justify-center">
      <div className="text-center">
        <p className="font-mono text-5xl font-medium text-brand mb-4">403</p>
        <h1 className="font-display text-xl font-bold text-text-primary mb-2">Acceso denegado</h1>
        <p className="text-text-secondary text-sm mb-8">No tienes permisos para acceder a esta seccion.</p>
        <Link href="/login" className="text-sm text-brand hover:underline">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
