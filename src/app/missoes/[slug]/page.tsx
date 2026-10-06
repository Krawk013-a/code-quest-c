import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TerminalHeader from "@/components/ui/TerminalHeader";
import LogoutButton from "@/components/auth/LogoutButton";
import DosWindow from "@/components/ui/DosWindow";
import MissionWorkspace from "@/components/mission/MissionWorkspace";

const ACTIVITY_LABEL: Record<string, string> = {
  mission: "MISSAO",
  challenge: "DESAFIO",
  boss: "BOSS",
  project: "PROJETO",
};

/** Renderiza markdown mínimo: **negrito**, `código`, quebras de linha */
function SimpleMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
        return (
          <p key={i} className="text-xs text-white/90 leading-relaxed">
            {parts.map((part, j) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={j} className="text-dos-yellow">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              if (part.startsWith("`") && part.endsWith("`")) {
                return (
                  <code key={j} className="text-dos-green bg-black px-1">
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
    <div className="min-h-screen bg-dos-blue text-white">
      <TerminalHeader
        right={
          <>
            <Link
              href={`/mundos/${world.slug}`}
              className="text-xs text-dos-cyan hover:text-white transition-colors"
            >
              [ {world.title} ]
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
        status={
          <span>
            <span className={mission.activity === "boss" ? "text-dos-red" : "text-dos-cyan"}>
              {ACTIVITY_LABEL[mission.activity] ?? "MISSAO"}
            </span>
            <span className="mx-2 text-white/40">|</span>
            <span className="text-dos-yellow">+{mission.xp_reward} XP</span>
            {alreadyCompleted && (
              <>
                <span className="mx-2 text-white/40">|</span>
                <span className="text-dos-green">CONCLUIDA</span>
              </>
            )}
          </span>
        }
      />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="mb-6 text-lg uppercase tracking-widest">
          {mission.title}
        </h1>

        <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
          {/* contexto + objetivo + explicação */}
          <div className="space-y-6 xl:max-h-[calc(100vh-220px)] xl:overflow-y-auto xl:pr-1">
            {mission.context_text && (
              <DosWindow title="CONTEXTO">
                <SimpleMarkdown text={mission.context_text} />
              </DosWindow>
            )}

            <DosWindow title="OBJETIVO" className="border-dos-cyan">
              <p className="text-sm text-dos-green whitespace-pre-line">
                {mission.objective_text}
              </p>
            </DosWindow>

            {mission.explanation_md && (
              <DosWindow title="O QUE VOCE PRECISA SABER">
                <SimpleMarkdown text={mission.explanation_md} />
              </DosWindow>
            )}

            {mission.concepts.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {mission.concepts.map((c) => (
                  <span
                    key={c}
                    className="text-[11px] text-dos-cyan border border-dos-cyan px-2 py-0.5"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* workspace */}
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
      </main>
    </div>
  );
}
