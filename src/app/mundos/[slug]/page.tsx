import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TerminalHeader from "@/components/ui/TerminalHeader";
import LogoutButton from "@/components/auth/LogoutButton";
import DosWindow from "@/components/ui/DosWindow";
import DosBar from "@/components/ui/DosBar";
import SimpleMarkdown from "@/components/ui/SimpleMarkdown";

/** Mapa de tipo de atividade para o estilo DOS */
const ACTIVITY_TAG: Record<string, { label: string; color: string }> = {
  mission: { label: "MISSAO", color: "text-dos-green" },
  challenge: { label: "DESAFIO", color: "text-dos-cyan" },
  boss: { label: "BOSS", color: "text-dos-red" },
  project: { label: "PROJETO", color: "text-dos-yellow" },
};

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
    .select("id, number, slug, title, description, briefing_md, required_missions, required_boss")
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
    <div className="min-h-screen bg-dos-blue text-white">
      <TerminalHeader
        right={
          <>
            <Link
              href="/dashboard"
              className="text-xs text-dos-cyan hover:text-white transition-colors"
            >
              [ mapa ]
            </Link>
            {user ? (
              <LogoutButton />
            ) : (
              <Link
                href="/login"
                className="text-xs text-dos-yellow border-2 border-dos-yellow px-3 py-1 hover:bg-dos-yellow hover:text-dos-blue transition-colors"
              >
                [ entrar ]
              </Link>
            )}
          </>
        }
      />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <DosWindow
          title={`MUNDO ${world.number} — ${world.title.toUpperCase()}`}
          className="mb-8"
        >
          {world.briefing_md && (
            <div className="mb-4 border-b border-white/20 pb-4">
              <p className="mb-2 text-[11px] text-dos-cyan">
                // BRIEFING — O QUE VEM A SEGUIR
              </p>
              <SimpleMarkdown text={world.briefing_md} size="sm" />
            </div>
          )}
          <p className="text-sm mb-3">{world.description}</p>
          {user && totalMissions > 0 && (
            <div className="text-xs">
              <p className="mb-1 text-white/70">
                PROGRESSO: {completedCount}/{totalMissions} — desbloqueia o
                proximo mundo com {world.required_missions} missoes
                {world.required_boss ? " + boss" : ""}
              </p>
              <DosBar
                value={completedCount}
                max={totalMissions}
                width={20}
                tone={completedCount === totalMissions ? "green" : "cyan"}
              />
            </div>
          )}
        </DosWindow>

        <div className="space-y-3">
          {(missions ?? []).map((m) => {
            const prog = progressByMission[m.id];
            const done = prog?.status === "completed";
            const tag = ACTIVITY_TAG[m.activity] ?? ACTIVITY_TAG.mission;
            return (
              <Link
                key={m.id}
                href={`/missoes/${m.slug}`}
                className={`flex items-center justify-between border-2 px-4 py-3 transition-colors ${
                  m.activity === "boss"
                    ? "border-dos-red hover:bg-dos-red/20"
                    : done
                      ? "border-dos-green"
                      : "border-white hover:bg-dos-panel"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs ${tag.color}`}>[{tag.label}]</span>
                  <span className="text-sm">{m.title}</span>
                </div>
                <span
                  className={`text-xs ${done ? "text-dos-green" : "text-dos-yellow"}`}
                >
                  {done ? "[CONCLUIDA]" : `+${m.xp_reward} XP`}
                </span>
              </Link>
            );
          })}

          {(missions ?? []).length === 0 && (
            <div className="border-2 border-white/40 px-5 py-10 text-center">
              <p className="text-sm text-white/60">
                Nenhuma missao neste mundo ainda.
              </p>
              <p className="text-xs text-white/40 mt-1">
                AS PRIMEIRAS MISSOES CHEGAM NAS PROXIMAS MIGRATIONS.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
