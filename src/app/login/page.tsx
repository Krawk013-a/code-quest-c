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
    <div className="min-h-screen bg-dos-blue text-white">
      <TerminalHeader
        right={<span className="text-xs text-dos-cyan">ACESSO AO SISTEMA</span>}
      />
      <main className="mx-auto max-w-md px-6 pt-16">
        <p className="text-xs text-dos-yellow mb-6">
          // autenticacao necessaria para registrar XP, nivel e streak
        </p>
        <AuthForm />
      </main>
    </div>
  );
}
