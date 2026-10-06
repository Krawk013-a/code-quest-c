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
        <p className="text-xs text-zinc-500 mb-2">
          mundo {world.number} · {missions?.length ?? 0} atividades
        </p>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          🌎 {world.title}
        </h1>
        <p className="text-sm text-zinc-400 mt-2 max-w-xl leading-relaxed">
          {world.description}
        </p>

        <div className="mt-10 space-y-3">
          {(missions ?? []).map((m) => {
            const prog = progressByMission[m.id];
            const done = prog?.status === "completed";
            return (
              <Link
                key={m.id}
                href={`/missoes/${m.slug}`}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-5 py-4 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-lg">{activityIcon(m.activity)}</span>
                  <div>
                    <h2 className="text-sm font-semibold">{m.title}</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {done ? "✓ concluída" : `${m.xp_reward} XP`}
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
