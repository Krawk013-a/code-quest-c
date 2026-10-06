import { NextRequest, NextResponse } from "next/server";
import { getRunner } from "@/lib/runner";
import { createClient } from "@/lib/supabase/server";
import type { MissionTest } from "@/types/database";

/**
 * POST /api/run
 * Executa código no sandbox externo via CodeRunner.
 *
 * Body: { language?: string, code: string, mission_slug?: string, tests?: MissionTest[] }
 *  - mission_slug informado: testes vêm do banco (integridade garantida),
 *    ignorando qualquer `tests` do client. Linguagem do mundo (MVP: C).
 *  - sem mission_slug: laboratório — usa `tests` do body (ou nenhum).
 *
 * Limites anti-abuso (§20): tamanho do código, nº de testes.
 */

const MAX_CODE_LENGTH = 20_000; // 20 KB de código
const MAX_TESTS = 20;

export async function POST(req: NextRequest) {
  let body: {
    language?: string;
    code?: string;
    mission_slug?: string;
    tests?: MissionTest[];
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { status: "error", message: "JSON inválido." },
      { status: 400 }
    );
  }

  const { language, code, mission_slug, tests } = body;

  if (!code || typeof code !== "string") {
    return NextResponse.json(
      { status: "error", message: "Campo 'code' é obrigatório." },
      { status: 400 }
    );
  }
  if (code.length > MAX_CODE_LENGTH) {
    return NextResponse.json(
      {
        status: "error",
        message: `Código muito longo (máx. ${MAX_CODE_LENGTH} caracteres).`,
      },
      { status: 413 }
    );
  }

  let effectiveLanguage = language;
  let safeTests: MissionTest[];

  if (typeof mission_slug === "string" && mission_slug.length > 0) {
    // missão: testes vêm do banco — client não pode adulterar
    const supabase = await createClient();
    const { data: mission } = await supabase
      .from("missions")
      .select("tests")
      .eq("slug", mission_slug)
      .eq("is_active", true)
      .single();

    if (!mission) {
      return NextResponse.json(
        { status: "error", message: "Missão não encontrada." },
        { status: 404 }
      );
    }
    safeTests = (mission.tests ?? []).slice(0, MAX_TESTS);
    // TODO (etapa 17): linguagem via world → languages.slug; MVP = C
    effectiveLanguage = "c";
  } else {
    if (!language || typeof language !== "string") {
      return NextResponse.json(
        { status: "error", message: "Campo 'language' é obrigatório." },
        { status: 400 }
      );
    }
    safeTests = Array.isArray(tests) ? tests.slice(0, MAX_TESTS) : [];
  }

  for (const t of safeTests) {
    if (typeof t.input !== "string" || typeof t.expected_output !== "string") {
      return NextResponse.json(
        {
          status: "error",
          message: "Testes devem ter 'input' e 'expected_output' como texto.",
        },
        { status: 400 }
      );
    }
  }

  let runner;
  try {
    runner = getRunner(effectiveLanguage!);
  } catch {
    return NextResponse.json(
      {
        status: "error",
        message: `Linguagem "${effectiveLanguage}" não suportada.`,
      },
      { status: 400 }
    );
  }

  try {
    const result = await runner.run(code, safeTests);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      {
        status: "error",
        stdout: "",
        stderr: "",
        friendly_error:
          err instanceof Error
            ? err.message
            : "Erro inesperado na execução.",
        tests: [],
      },
      { status: 500 }
    );
  }
}
