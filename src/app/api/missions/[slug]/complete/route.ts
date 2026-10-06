import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRunner } from "@/lib/runner";
import { levelForXp } from "@/lib/engine/levels";
import type { RunResult } from "@/types/database";

/**
 * POST /api/missions/[slug]/complete
 * Chamado quando o usuário acha que resolveu a missão.
 *
 * Fluxo anti-trapaça:
 * 1. busca missão + testes no banco (nunca confia no client)
 * 2. re-executa o código enviado no sandbox e valida TODOS os testes
 * 3. só então grava user_progress (upsert) + XP + nível + streak
 *
 * Regras de XP (§10): bônus +20 sem dicas, +5 se usou dica;
 * re-completar não dá XP de novo.
 */

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let body: { code?: string; hints_used?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "JSON inválido." }, { status: 400 });
  }

  const { code, hints_used } = body;
  if (!code || typeof code !== "string") {
    return NextResponse.json(
      { message: "Campo 'code' é obrigatório." },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { message: "Entre com sua conta para registrar progresso." },
      { status: 401 }
    );
  }

  // 1) missão + estado atual do usuário
  const { data: mission } = await supabase
    .from("missions")
    .select("id, xp_reward, tests, solution_code")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (!mission) {
    return NextResponse.json({ message: "Missão não encontrada." }, { status: 404 });
  }

  const { data: existing } = await supabase
    .from("user_progress")
    .select("id, status, xp_earned, attempts")
    .eq("user_id", user.id)
    .eq("mission_id", mission.id)
    .single();

  // 2) re-executa server-side — o veredito final é do sandbox
  let result: RunResult;
  try {
    const runner = getRunner("c");
    result = await runner.run(code, mission.tests ?? []);
  } catch {
    return NextResponse.json(
      { message: "Executor indisponível agora. Tente novamente." },
      { status: 502 }
    );
  }

  if (result.status !== "ok") {
    // falhou: conta tentativa (se ainda não passou)
    if (!existing || existing.status !== "completed") {
      await supabase.from("user_progress").upsert(
        {
          user_id: user.id,
          mission_id: mission.id,
          status: "in_progress",
          attempts: (existing?.attempts ?? 0) + 1,
          hints_used: Math.max(0, hints_used ?? 0),
        },
        { onConflict: "user_id,mission_id" }
      );
    }
    return NextResponse.json(
      {
        passed: false,
        message: "A solução ainda não passa nos testes.",
        run: result,
      },
      { status: 200 }
    );
  }

  // 3) XP: bônus sem dicas (§10); re-completar não paga de novo
  const alreadyCompleted = existing?.status === "completed";
  const hints = Math.max(0, hints_used ?? 0);
  const bonus = hints === 0 ? 20 : hints <= 2 ? 5 : 0;
  const xpGain = alreadyCompleted ? 0 : mission.xp_reward + bonus;

  await supabase.from("user_progress").upsert(
    {
      user_id: user.id,
      mission_id: mission.id,
      status: "completed",
      attempts: (existing?.attempts ?? 0) + 1,
      hints_used: hints,
      xp_earned: existing?.xp_earned ?? xpGain,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,mission_id" }
  );

  // 4) XP + nível + streak no profile
  if (xpGain > 0) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("total_xp, level, streak_days, last_activity_date")
      .eq("id", user.id)
      .single();

    if (profile) {
      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86_400_000)
        .toISOString()
        .slice(0, 10);

      let streak = profile.streak_days ?? 0;
      if (profile.last_activity_date === today) {
        // já treinou hoje: streak inalterado
      } else if (profile.last_activity_date === yesterday) {
        streak += 1;
      } else {
        streak = 1;
      }

      const totalXp = (profile.total_xp ?? 0) + xpGain;
      const newLevel = levelForXp(totalXp);
      const leveledUp = newLevel > (profile.level ?? 1);

      await supabase
        .from("profiles")
        .update({
          total_xp: totalXp,
          level: newLevel,
          streak_days: streak,
          last_activity_date: today,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      return NextResponse.json({
        passed: true,
        xp_gained: xpGain,
        bonus_hint_free: hints === 0,
        total_xp: totalXp,
        level: newLevel,
        leveled_up: leveledUp,
        streak_days: streak,
        already_completed: false,
      });
    }
  }

  return NextResponse.json({
    passed: true,
    xp_gained: 0,
    already_completed: alreadyCompleted,
  });
}
