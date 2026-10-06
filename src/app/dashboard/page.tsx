import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { xpForLevel, levelProgress } from "@/lib/engine/levels";
import TerminalHeader from "@/components/ui/TerminalHeader";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // profile criado automaticamente pelo trigger handle_new_user
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, total_xp, level, streak_days")
    .eq("id", user.id)
    .single();

  const displayName = profile?.display_name ?? profile?.username ?? "jogador";
  const xp = profile?.total_xp ?? 0;
  const level = profile?.level ?? 1;
  const streak = profile?.streak_days ?? 0;

  const currentLevelXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const pct = levelProgress(xp, level);

  const { data: worlds } = await supabase
    .from("worlds")
    .select("id, slug, number, title, description")
    .order("number");

  const { data: progress } = await supabase
    .from("user_progress")
    .select("mission_id, status")
    .eq("user_id", user.id);

  const completed = progress?.filter((p) => p.status === "completed").length ?? 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono">
      <TerminalHeader
        right={
          <>
            <span className="text-xs text-zinc-500">
              lvl {level} · {xp} XP
            </span>
            <LogoutButton />
          </>
        }
      />

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* status do jogador */}
        <section className="mb-10">
          <p className="text-xs text-zinc-500 mb-2">
            <span className="text-emerald-400">{displayName}</span>@codequest:~$
            quem_sou_eu
          </p>
          <h1 className="text-2xl font-bold">
            Olá de novo, {displayName}.
          </h1>
          <p className="text-sm text-zinc-400 mt-2">
            {completed > 0
              ? `Você já completou ${completed} ${completed === 1 ? "missão" : "missões"}. A jornada continua.`
              : "Sua jornada em C começa agora. Mundo 0 está aguardando."}
          </p>

          {/* barra de progresso de nível */}
          <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-zinc-400">
                nível {level} → {level + 1}
              </span>
              <span className="text-zinc-500">
                {xp}/{nextLevelXp} XP
              </span>
            </div>
            <div className="h-2 rounded bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            {streak > 0 && (
              <p className="text-xs text-amber-400 mt-3">
                🔥 streak de {streak} {streak === 1 ? "dia" : "dias"}
              </p>
            )}
          </div>
        </section>

        {/* mapa de mundos */}
        <section>
          <h2 className="text-sm text-zinc-500 mb-4">// mapa de mundos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(worlds ?? []).map((w) => (
              <Link
                key={w.id}
                href={`/mundos/${w.slug}`}
                className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">mundo {w.number}</p>
                    <h3 className="text-sm font-semibold">{w.title}</h3>
                  </div>
                  <span className="text-lg">🌎</span>
                </div>
                <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
                  {w.description}
                </p>
              </Link>
            ))}
            {(worlds ?? []).length === 0 && (
              <p className="text-xs text-zinc-500 col-span-full">
                Nenhum mundo cadastrado ainda — rode a migration v1 (seed).
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
