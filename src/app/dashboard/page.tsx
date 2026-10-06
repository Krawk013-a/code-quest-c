import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { xpForLevel, levelProgress } from "@/lib/engine/levels";
import TerminalHeader from "@/components/ui/TerminalHeader";
import LogoutButton from "@/components/auth/LogoutButton";
import DosWindow from "@/components/ui/DosWindow";
import DosBar from "@/components/ui/DosBar";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, total_xp, level, streak_days")
    .eq("id", user.id)
    .single();

  const displayName = profile?.display_name ?? profile?.username ?? "jogador";
  const xp = profile?.total_xp ?? 0;
  const level = profile?.level ?? 1;
  const streak = profile?.streak_days ?? 0;

  const nextLevelXp = xpForLevel(level + 1);
  const pct = levelProgress(xp, level);

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
    <div className="min-h-screen bg-dos-blue text-white">
      <TerminalHeader
        right={<LogoutButton />}
        status={
          <span>
            <span className="text-dos-yellow">NIVEL {level}</span>
            <span className="mx-2 text-white/40">|</span>
            <span className="text-dos-green">{xp} XP</span>
            {streak > 0 && (
              <>
                <span className="mx-2 text-white/40">|</span>
                <span className="text-dos-red">STREAK {streak}d</span>
              </>
            )}
          </span>
        }
      />

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* status do jogador — janela DOS */}
        <DosWindow title="STATUS DO OPERADOR" className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-dos-cyan text-xs mb-1">
                {displayName.toUpperCase()}@CODEQUEST:~$
              </p>
              <p className="text-sm">
                {completedIds.size === 0
                  ? "Sua jornada em C comeca agora. Mundo 0 aguardando."
                  : `${completedIds.size} missao(oes) concluida(s). A jornada continua.`}
              </p>
              <p className="mt-2 text-xs text-white/70">
                Proximo nivel em {nextLevelXp - xp} XP
                {streak > 0 && (
                  <span className="text-dos-red">
                    {" "}
                    * STREAK {streak} {streak === 1 ? "DIA" : "DIAS"}
                  </span>
                )}
              </p>
            </div>
            <div className="text-sm">
              <p className="mb-1 text-xs text-white/70">PROGRESSO DO NIVEL</p>
              <DosBar value={pct} max={100} width={16} tone="yellow" />
            </div>
          </div>
        </DosWindow>

        {/* mapa de mundos — árvore ASCII */}
        <section>
          <p className="text-dos-cyan text-xs mb-4">
            // MAPA DE MUNDOS — LINGUAGEM C
          </p>
          <div className="space-y-0">
            {(worlds ?? []).map((w, i) => {
              const worldMissions = (missions ?? []).filter(
                (m) => m.world_id === w.id
              );
              const done = worldMissions.filter((m) =>
                completedIds.has(m.id)
              ).length;
              const total = worldMissions.length;
              const complete = total > 0 && done === total;
              const isLast = i === (worlds?.length ?? 0) - 1;

              return (
                <div key={w.id}>
                  <Link
                    href={`/mundos/${w.slug}`}
                    className={`group flex items-center justify-between border-2 px-4 py-3 transition-colors ${
                      complete
                        ? "border-dos-green text-dos-green"
                        : "border-white text-white hover:bg-dos-panel"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-dos-cyan select-none">
                        {isLast ? "└─" : "├─"}
                      </span>
                      <span className="text-sm">
                        MUNDO {w.number} — {w.title.toUpperCase()}
                        {complete && " [COMPLETO]"}
                      </span>
                    </div>
                    <span className="text-xs">
                      {total > 0 ? (
                        <DosBar value={done} max={total} width={10} tone={complete ? "green" : "cyan"} />
                      ) : (
                        <span className="text-white/50">EM BREVE</span>
                      )}
                    </span>
                  </Link>
                  {!isLast && (
                    <div className="ml-4 border-l-2 border-white/30 h-3 select-none" />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
