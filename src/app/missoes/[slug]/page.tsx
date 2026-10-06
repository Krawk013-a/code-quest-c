import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TerminalHeader from "@/components/ui/TerminalHeader";
import LogoutButton from "@/components/auth/LogoutButton";
import MissionWorkspace from "@/components/mission/MissionWorkspace";
import { activityIcon } from "@/components/mission/icons";

/** Renderiza markdown mínimo: **negrito**, `código`, quebras de linha */
function SimpleMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
        return (
          <p key={i} className="text-xs text-zinc-300 leading-relaxed">
            {parts.map((part, j) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={j} className="text-zinc-100 font-semibold">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              if (part.startsWith("`") && part.endsWith("`")) {
                return (
                  <code
                    key={j}
                    className="rounded bg-zinc-800 px-1.5 py-0.5 text-emerald-300 text-[11px]"
                  >
                    {part.slice(1, -1)}
                  </code>
                );
              }
              return <span key={j}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}

export default async function MissionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: mission } = await supabase
    .from("missions")
    .select(
      `id, world_id, slug, title, activity, difficulty, context_text, objective_text,
       explanation_md, initial_code, solution_code, tests, hints, xp_reward,
       concepts`
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (!mission) notFound();

  const { data: world } = await supabase
    .from("worlds")
    .select("slug, title, number")
    .eq("id", mission.world_id)
    .single();
  if (!world) notFound();

  // progresso do usuário nesta missão (se logado)
  let alreadyCompleted = false;
  if (user) {
    const { data: progress } = await supabase
      .from("user_progress")
      .select("status")
      .eq("user_id", user.id)
      .eq("mission_id", mission.id)
      .single();
    alreadyCompleted = progress?.status === "completed";
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono">
      <TerminalHeader
        right={
          <>
            <Link
              href={`/mundos/${world.slug}`}
              className="text-xs text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              ← {world.title}
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

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* cabeçalho da missão */}
        <p className="text-xs text-zinc-500 mb-2">
          mundo {world.number} · {activityIcon(mission.activity)}{" "}
          {mission.activity === "mission"
            ? "missão"
            : mission.activity === "challenge"
              ? "desafio"
              : mission.activity === "boss"
                ? "BOSS"
                : "projeto"}{" "}
          · <span className="text-amber-300">{mission.xp_reward} XP</span>
        </p>
        <h1 className="text-2xl font-bold mb-6">{mission.title}</h1>

        <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-6">
          {/* CONTEXTO + OBJETIVO + EXPLICAÇÃO — coluna compacta */}
          <div className="space-y-5 xl:max-h-[calc(100vh-220px)] xl:overflow-y-auto xl:pr-1">
            {mission.context_text && (
              <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
                <SimpleMarkdown text={mission.context_text} />
              </section>
            )}

            <section className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-5">
              <p className="text-xs text-emerald-400 mb-2 font-semibold">
                🎯 objetivo
              </p>
              <p className="text-sm text-zinc-200 whitespace-pre-line">
                {mission.objective_text}
              </p>
            </section>

            {mission.explanation_md && (
              <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
                <p className="text-xs text-zinc-500 mb-3">// o que você precisa saber</p>
                <SimpleMarkdown text={mission.explanation_md} />
              </section>
            )}

            {mission.concepts.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {mission.concepts.map((c) => (
                  <span
                    key={c}
                    className="text-[11px] text-zinc-400 border border-zinc-800 rounded-full px-2.5 py-1"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* WORKSPACE: editor + execução — coluna principal */}
          <div className="min-w-0">
            <MissionWorkspace
              missionSlug={mission.slug}
              initialCode={mission.initial_code}
              hints={mission.hints}
              solutionCode={mission.solution_code}
              alreadyCompleted={alreadyCompleted}
              loggedIn={!!user}
            />
          </div>
        </div>

        {alreadyCompleted && (
          <p className="mt-6 text-xs text-emerald-400/80">
            ✓ você já concluiu esta missão
          </p>
        )}
      </main>
    </div>
  );
}
