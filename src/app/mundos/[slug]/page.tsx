import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TerminalHeader from "@/components/ui/TerminalHeader";
import LogoutButton from "@/components/auth/LogoutButton";
import { activityIcon } from "@/components/mission/icons";

export default async function WorldPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: world } = await supabase
    .from("worlds")
    .select("id, number, slug, title, description, required_missions, required_boss")
    .eq("slug", slug)
    .single();
  if (!world) notFound();

  const { data: missions } = await supabase
    .from("missions")
    .select(
      "id, slug, title, activity, difficulty, xp_reward, sort_order, is_active"
    )
    .eq("world_id", world.id)
    .eq("is_active", true)
    .order("sort_order");

  // progresso do usuário nas missões deste mundo (se logado)
  let progressByMission: Record<string, { status: string; xp_earned: number }> = {};
  if (user) {
    const { data: progress } = await supabase
      .from("user_progress")
      .select("mission_id, status, xp_earned")
      .eq("user_id", user.id);
    for (const p of progress ?? []) {
      progressByMission[p.mission_id] = {
        status: p.status,
        xp_earned: p.xp_earned,
      };
    }
  }

  const totalMissions = missions?.length ?? 0;
  const completedCount =
    missions?.filter(
      (m) => progressByMission[m.id]?.status === "completed"
    ).length ?? 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono">
      <TerminalHeader
        right={
          <>
            <Link
              href="/dashboard"
              className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              ← mapa
            </Link>
            {user ? <LogoutButton /> : (
              <Link
                href="/login"
                className="text-xs border border-emerald-500/40 text-emerald-400 rounded px-3 py-1.5 hover:bg-emerald-500/10 transition-colors"
              >
                entrar
              </Link>
            )}
          </>
        }
      />

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* cabeçalho do mundo com progresso */}
        <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 animate-fade-up">
          <p className="text-xs text-zinc-500 mb-2">
            mundo {world.number} · {missions?.length ?? 0} atividades
          </p>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            🌎 {world.title}
            {user && completedCount === totalMissions && totalMissions > 0 && (
              <span className="text-sm text-emerald-400">🏆 mundo completo</span>
            )}
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-xl leading-relaxed">
            {world.description}
          </p>
          {user && totalMissions > 0 && (
            <div className="mt-4 max-w-md">
              <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1">
                <span>
                  {completedCount}/{totalMissions} concluídas
                </span>
                <span>
                  desbloqueia o próximo mundo: {world.required_missions} +
                  boss
                </span>
              </div>
              <div className="h-1.5 rounded bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded transition-all duration-500"
                  style={{
                    width: `${(completedCount / totalMissions) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {(missions ?? []).map((m) => {
            const prog = progressByMission[m.id];
            const done = prog?.status === "completed";
            const isBoss = m.activity === "boss";
            return (
              <Link
                key={m.id}
                href={`/missoes/${m.slug}`}
                className={`flex items-center justify-between rounded-xl border px-5 py-4 transition-all ${
                  isBoss
                    ? "border-red-500/30 bg-red-500/5 hover:border-red-500/50"
                    : done
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-zinc-800 bg-zinc-900/60 hover:border-emerald-500/40"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`text-lg ${isBoss ? "animate-pulse" : ""}`}>
                    {isBoss ? "👾" : activityIcon(m.activity)}
                  </span>
                  <div>
                    <h2
                      className={`text-sm font-semibold ${
                        isBoss ? "text-red-300" : ""
                      }`}
                    >
                      {m.title}
                    </h2>
                    <p
                      className={`text-xs mt-0.5 ${
                        done ? "text-emerald-400" : "text-zinc-500"
                      }`}
                    >
                      {done
                        ? "✓ concluída"
                        : `${m.xp_reward} XP${isBoss ? " · derrota o boss" : ""}`}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-zinc-500">
                  {done ? "🎉" : "→"}
                </span>
              </Link>
            );
          })}

          {(missions ?? []).length === 0 && (
            <div className="rounded-lg border border-dashed border-zinc-800 px-5 py-10 text-center">
              <p className="text-sm text-zinc-400">
                Nenhuma missão neste mundo ainda.
              </p>
              <p className="text-xs text-zinc-600 mt-1">
                As primeiras missões chegam na Fase 3 do roadmap (primeira
                missão de verdade no banco).
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
