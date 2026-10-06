"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CodeEditor from "@/components/editor/CodeEditor";
import DosButton from "@/components/ui/DosButton";
import DosAlert from "@/components/ui/DosAlert";
import DosBar from "@/components/ui/DosBar";
import type { RunResult } from "@/types/database";

interface CompleteResult {
  passed: boolean;
  xp_gained?: number;
  bonus_hint_free?: boolean;
  total_xp?: number;
  level?: number;
  leveled_up?: boolean;
  streak_days?: number;
  already_completed?: boolean;
  message?: string;
}

/**
 * Workspace da missão — estilo Turbo C.
 * Janela de edição preta com moldura, menu de ações no rodapé,
 * resultados em alert boxes DOS.
 */
export default function MissionWorkspace({
  missionSlug,
  initialCode,
  hints,
  solutionCode,
  alreadyCompleted,
  loggedIn,
  nextMissionSlug,
  worldSlug,
}: {
  missionSlug: string;
  initialCode: string;
  hints: { content: string }[];
  solutionCode: string | null;
  alreadyCompleted: boolean;
  loggedIn: boolean;
  nextMissionSlug: string | null;
  worldSlug: string;
}) {
  const router = useRouter();
  const [code, setCode] = useState(initialCode);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [completion, setCompletion] = useState<CompleteResult | null>(null);

  // ── editor modular: altura ajustável e persistida ──────────
  const MIN_H = 200;
  const MAX_H = 900;
  const clampH = (h: number) => Math.min(MAX_H, Math.max(MIN_H, h));
  const [editorHeight, setEditorHeight] = useState(480);

  useEffect(() => {
    const saved = window.localStorage.getItem("cq-editor-height");
    if (saved) setEditorHeight(clampH(parseInt(saved, 10) || 480));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("cq-editor-height", String(editorHeight));
  }, [editorHeight]);

  function startDrag(e: React.MouseEvent) {
    e.preventDefault();
    const startY = e.clientY;
    const startH = editorHeight;
    const onMove = (ev: MouseEvent) => {
      setEditorHeight(clampH(startH + (ev.clientY - startY)));
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  // Ctrl+Enter roda o código
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (!running) handleRun();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  async function handleRun() {
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mission_slug: missionSlug, code }),
      });
      const data = (await res.json()) as RunResult & { message?: string };
      if (data.status === "error" && data.message) {
        setResult({
          status: "error",
          stdout: "",
          stderr: "",
          friendly_error: data.message,
          tests: [],
        });
      } else {
        setResult(data);
        if (data.status === "ok") {
          await completeMission();
        }
      }
    } catch {
      setResult({
        status: "error",
        stdout: "",
        stderr: "",
        friendly_error: "Falha de rede ao contatar o executor.",
        tests: [],
      });
    } finally {
      setRunning(false);
    }
  }

  async function completeMission() {
    if (!loggedIn) return;
    try {
      const res = await fetch(`/api/missions/${missionSlug}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, hints_used: hintLevel }),
      });
      const data = (await res.json()) as CompleteResult;
      if (data.passed) {
        setCompletion(data);
        router.refresh();
      }
    } catch {
      // progresso é best-effort: a missão já passou nos testes
    }
  }

  const nextHintAvailable = hintLevel < hints.length;
  const passedTests =
    result?.tests.filter((t) => t.passed).length ?? 0;
  const totalTests = result?.tests.length ?? 0;

  return (
    <div className="space-y-4">
      {/* ── EDITOR: janela preta com moldura dupla ─────────────── */}
      <div className="relative border-2 border-white bg-black">
        <div className="pointer-events-none absolute inset-[3px] border border-white" />

        <div className="relative flex items-center gap-2 border-b border-white bg-dos-panel px-3 py-1.5">
          <span className="text-xs text-dos-cyan">A:MAIN.C</span>
          <span className="ml-auto text-xs text-white/60">
            {code.split("\n").length} LN
          </span>
          {/* controles de altura */}
          <div className="ml-3 flex items-center gap-1">
            <button
              title="diminuir"
              onClick={() => setEditorHeight(clampH(editorHeight - 100))}
              className="h-5 w-5 border border-white/50 text-[10px] text-white hover:bg-white hover:text-dos-blue transition-colors"
            >
              -
            </button>
            <button
              title="aumentar"
              onClick={() => setEditorHeight(clampH(editorHeight + 100))}
              className="h-5 w-5 border border-white/50 text-[10px] text-white hover:bg-white hover:text-dos-blue transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <div style={{ height: editorHeight }} className="overflow-hidden">
          <CodeEditor value={code} onChange={setCode} height={`${editorHeight}px`} />
        </div>

        {/* alça de redimensionamento */}
        <div
          onMouseDown={startDrag}
          className="flex h-3 cursor-row-resize items-center justify-center border-t border-white/30 select-none"
          title="arraste para redimensionar"
        >
          <div className="h-0.5 w-10 bg-white/50" />
        </div>

        {/* menu de ações estilo barra F-keys do Turbo C */}
        <div className="flex flex-wrap items-center gap-2 border-t-2 border-white bg-dos-panel px-3 py-2">
          <DosButton
            label={running ? "executando..." : "Rodar"}
            onClick={handleRun}
            disabled={running}
            tone="green"
          />
          {nextHintAvailable && (
            <DosButton
              label={`Dica ${hintLevel + 1}/${hints.length}`}
              onClick={() => setHintLevel(hintLevel + 1)}
              tone="yellow"
            />
          )}
          {!nextHintAvailable && solutionCode && !showSolution && (
            <DosButton
              label="Ver Solucao"
              onClick={() => setShowSolution(true)}
              tone="plain"
            />
          )}
          {running && (
            <span className="text-xs text-dos-yellow dos-blink">
              COMPILANDO NO SANDBOX...
            </span>
          )}
        </div>
      </div>

      {/* ── RESULTADO ───────────────────────────────────────────── */}
      {!result && !running && (
        <div className="border-2 border-white/30 px-4 py-6 text-center">
          <p className="text-xs text-white/50">
            ESCREVA A SOLUCAO E APERTE [ RODAR ] — Ctrl+Enter tambem roda
          </p>
        </div>
      )}

      {result && (
        <div className="space-y-3">
          {/* sucesso */}
          {result.status === "ok" && (
            <DosAlert kind="success" title="COMPILADO COM SUCESSO">
              <p>TODOS OS TESTES PASSARAM.</p>

              {/* saída do programa — o resultado de verdade */}
              {result.stdout && (
                <div className="mt-3">
                  <p className="mb-1 text-[11px] text-white/60">
                    SAIDA DO SEU PROGRAMA:
                  </p>
                  <pre className="overflow-x-auto border border-dos-green/50 bg-black p-3 text-xs text-dos-green">
                    {result.stdout}
                  </pre>
                </div>
              )}

              {/* testes extras com output visível (não-hidden) */}
              {result.tests
                .filter((t) => t.passed && t.expected_output !== undefined)
                .slice(1)
                .map((t, i) => (
                  <div key={i} className="mt-2 text-xs">
                    <span className="text-white/60">[{t.label}]</span>{" "}
                    <span className="text-dos-green">OK</span>
                  </div>
                ))}

              {completion && (
                <div className="mt-3 space-y-1">
                  {completion.already_completed ? (
                    <p className="text-white/70">
                      MISSAO JA CONCLUIDA ANTERIORMENTE — SEM XP EXTRA.
                    </p>
                  ) : (
                    <>
                      <p className="text-dos-yellow">
                        +{completion.xp_gained} XP
                        {completion.bonus_hint_free && " (BONUS: SEM DICAS)"}
                      </p>
                      {completion.leveled_up && (
                        <p className="text-dos-green">
                          LEVEL UP — NIVEL {completion.level} ATINGIDO.
                        </p>
                      )}
                      {completion.streak_days ? (
                        <p className="text-dos-red">
                          STREAK: {completion.streak_days}{" "}
                          {completion.streak_days === 1 ? "DIA" : "DIAS"}
                        </p>
                      ) : null}
                    </>
                  )}
                </div>
              )}
              {!loggedIn && (
                <p className="mt-2 text-xs text-white/50">
                  ENTRE COM SUA CONTA PARA REGISTRAR XP NESTA MISSAO
                </p>
              )}

              {/* próxima missão — manter o fluxo */}
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-dos-green/30 pt-3">
                {nextMissionSlug ? (
                  <Link
                    href={`/missoes/${nextMissionSlug}`}
                    className="border-2 border-dos-green px-4 py-1.5 text-sm text-dos-green hover:bg-dos-green hover:text-black transition-colors"
                  >
                    [ Proxima Missao → ]
                  </Link>
                ) : (
                  <Link
                    href={`/mundos/${worldSlug}`}
                    className="border-2 border-dos-yellow px-4 py-1.5 text-sm text-dos-yellow hover:bg-dos-yellow hover:text-black transition-colors"
                  >
                    [ Fim do mundo — ver mapa do mundo ]
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="text-xs text-white/60 hover:text-white transition-colors"
                >
                  [ voltar ao mapa ]
                </Link>
              </div>
            </DosAlert>
          )}

          {/* erro (infra) */}
          {result.status === "error" && (
            <DosAlert kind="error" title="ERRO DO SISTEMA">
              <p>{result.friendly_error ?? "Erro inesperado."}</p>
            </DosAlert>
          )}

          {/* erro de compilação */}
          {result.status === "compile_error" && (
            <DosAlert kind="error" title="ERRO DE COMPILACAO">
              {result.friendly_error && (
                <p className="mb-2 text-white">{result.friendly_error}</p>
              )}
              <details>
                <summary className="cursor-pointer text-xs text-white/60 hover:text-white">
                  VER SAIDA TECNICA DO GCC
                </summary>
                <pre className="mt-2 overflow-x-auto border border-dos-red/50 bg-black p-2 text-[11px] text-dos-red">
                  {result.stderr}
                </pre>
              </details>
            </DosAlert>
          )}

          {/* runtime / timeout / wrong answer */}
          {(result.status === "runtime_error" ||
            result.status === "timeout" ||
            result.status === "wrong_answer") && (
            <DosAlert
              kind={result.status === "wrong_answer" ? "warning" : "error"}
              title={
                result.status === "timeout"
                  ? "TEMPO ESGOTADO"
                  : result.status === "wrong_answer"
                    ? "SAIDA INCORRETA"
                    : "ERRO EM TEMPO DE EXECUCAO"
              }
            >
              {result.friendly_error && (
                <p className="mb-2 text-white">{result.friendly_error}</p>
              )}
              {result.stdout && (
                <pre className="mb-2 overflow-x-auto border border-white/30 bg-black p-2 text-[11px] text-dos-green">
                  {result.stdout}
                </pre>
              )}
              {result.stderr && (
                <details>
                  <summary className="cursor-pointer text-xs text-white/60 hover:text-white">
                    VER SAIDA TECNICA
                  </summary>
                  <pre className="mt-2 overflow-x-auto border border-white/20 bg-black p-2 text-[11px] text-dos-red">
                    {result.stderr}
                  </pre>
                </details>
              )}
            </DosAlert>
          )}

          {/* testes individuais */}
          {totalTests > 0 && (
            <DosBar
              value={passedTests}
              max={totalTests}
              width={24}
              tone={passedTests === totalTests ? "green" : "yellow"}
            />
          )}

          {/* dicas reveladas */}
          {hintLevel > 0 && (
            <div className="border-2 border-dos-yellow/60 bg-black/40 p-3">
              {hints.slice(0, hintLevel).map((h, i) => (
                <p key={i} className="text-xs text-dos-yellow mb-2">
                  [DICA {i + 1}] {h.content}
                </p>
              ))}
            </div>
          )}

          {/* solução */}
          {showSolution && solutionCode && (
            <div className="border-2 border-white/40 bg-black p-3">
              <p className="mb-2 text-xs text-white/60">SOLUCAO DE REFERENCIA:</p>
              <pre className="overflow-x-auto text-[11px] text-dos-green">
                {solutionCode}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
