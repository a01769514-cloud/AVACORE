import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ clienteId: string }>;
}) {
  const { clienteId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role, full_name, cliente_id")
    .eq("id", user.id)
    .single();

  // Client can only access their own dashboard
  if (profile?.role === "client" && profile.cliente_id !== clienteId) {
    redirect(`/dashboard/${profile.cliente_id}`);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isAdmin={profile?.role === "admin"} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          userName={profile?.full_name ?? user.email ?? null}
          isAdmin={profile?.role === "admin"}
        />
        <main className="flex-1 overflow-y-auto px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
