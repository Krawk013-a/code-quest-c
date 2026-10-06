import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AuthForm from "@/components/auth/AuthForm";
import TerminalHeader from "@/components/ui/TerminalHeader";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono">
      <TerminalHeader
        right={<span className="text-xs text-zinc-500">acesso ao sistema</span>}
      />
      <main className="mx-auto max-w-5xl px-6 pt-16">
        <p className="text-xs text-zinc-500 mb-6">
          // autenticação necessária para registrar seu progresso, XP e streak
        </p>
        <AuthForm />
      </main>
    </div>
  );
}
