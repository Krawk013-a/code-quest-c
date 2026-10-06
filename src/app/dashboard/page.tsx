import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { xpForLevel, levelProgress } from "@/lib/engine/levels";
import TerminalHeader from "@/components/ui/TerminalHeader";
import LogoutButton from "@/components/auth/LogoutButton";
import XpRing from "@/components/ui/XpRing";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, avatar_url, total_xp, level, streak_days")
    .eq("id", user.id)
    .single();

  const displayName = profile?.display_name ?? profile?.username ?? "jogador";
  const xp = profile?.total_xp ?? 0;
  const level = profile?.level ?? 1;
  const streak = profile?.streak_days ?? 0;

  const nextLevelXp = xpForLevel(level + 1);
  const pct = levelProgress(xp, level);

  // mundos + missões para calcular progresso real por mundo
  const { data: worlds } = await supabase
    .from("worlds")
    .select("id, slug, number, title, description")
    .order("number");

  const { data: missions } = await supabase
    .from("missions")
    .select("id, world_id, is_active")
    .eq("is_active", true);

  const { data: progress } = await supabase
    .from("user_progress")
    .select("mission_id, status")
    .eq("user_id", user.id);

  const completedIds = new Set(
    (progress ?? []).filter((p) => p.status === "completed").map((p) => p.mission_id)
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <TerminalHeader
        right={
          <>
            <span className="text-xs text-amber-300">
              {xp} XP · lvl {level}
            </span>
            <LogoutButton />
          </>
        }
      />

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* ── status do jogador ─────────────────────────────── */}
        <section className="mb-10 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 animate-fade-up">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <XpRing pct={pct} level={level} xp={xp} nextXp={nextLevelXp} />

            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs text-zinc-500 mb-2">
                <span className="text-emerald-400">{displayName}</span>
                @codequest:~$ status
              </p>
              <h1 className="text-2xl font-bold">Bem-vindo de volta.</h1>
              <p className="text-sm text-zinc-400 mt-2">
                {completedIds.size === 0
                  ? "Sua jornada em C começa agora. Mundo 0 aguardando."
                  : `${completedIds.size} ${completedIds.size === 1 ? "missão concluída" : "missões concluídas"}. A jornada continua.`}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                {streak > 0 && (
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
                    🔥 streak {streak} {streak === 1 ? "dia" : "dias"}
                  </span>
                )}
                <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
                  próximo nível: {nextLevelXp - xp} XP
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── mapa de mundos ────────────────────────────────── */}
        <section>
          <h2 className="text-sm text-zinc-500 mb-4">
            // mapa de mundos — linguagem C
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(worlds ?? []).map((w) => {
              const worldMissions = (missions ?? []).filter(
                (m) => m.world_id === w.id
              );
              const done = worldMissions.filter((m) =>
                completedIds.has(m.id)
              ).length;
              const total = worldMissions.length;
              const wPct = total > 0 ? (done / total) * 100 : 0;
              const complete = total > 0 && done === total;

              return (
                <Link
                  key={w.id}
                  href={`/mundos/${w.slug}`}
                  className={`group rounded-xl border p-5 transition-all ${
                    complete
                      ? "border-emerald-500/40 bg-emerald-500/5"
                      : "border-zinc-800 bg-zinc-900/60 hover:border-emerald-500/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
                        mundo {w.number}
                      </p>
                      <h3 className="text-sm font-semibold group-hover:text-emerald-400 transition-colors">
                        {w.title} {complete && "✓"}
                      </h3>
                    </div>
                    <span className="text-lg">
                      {complete ? "🏆" : w.number === 0 ? "🌎" : "🔒"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-3 leading-relaxed line-clamp-2">
                    {w.description}
                  </p>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1">
                      <span>
                        {done}/{total} missões
                      </span>
                      <span>{Math.round(wPct)}%</span>
                    </div>
                    <div className="h-1.5 rounded bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full rounded transition-all duration-500 ${
                          complete ? "bg-emerald-400" : "bg-emerald-500"
                        }`}
                        style={{ width: `${wPct}%` }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
