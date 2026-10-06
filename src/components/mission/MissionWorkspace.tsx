"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CodeEditor from "@/components/editor/CodeEditor";
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
 * Workspace da missão: editor de código + painel de execução.
 * Quando todos os testes passam, grava o progresso no banco.
 */
export default function MissionWorkspace({
  missionSlug,
  initialCode,
  hints,
  solutionCode,
  alreadyCompleted,
  loggedIn,
}: {
  missionSlug: string;
  initialCode: string;
  hints: { content: string }[];
  solutionCode: string | null;
  alreadyCompleted: boolean;
  loggedIn: boolean;
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

  // restaura preferência salva (client-only)
  useEffect(() => {
    const saved = window.localStorage.getItem("cq-editor-height");
    if (saved) setEditorHeight(clampH(parseInt(saved, 10) || 480));
  }, []);

  // persiste a cada mudança
  useEffect(() => {
    window.localStorage.setItem("cq-editor-height", String(editorHeight));
  }, [editorHeight]);

  // arrastar a borda inferior redimensiona
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
          // passou nos testes → registra progresso no banco
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* EDITOR */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
          <span className="ml-3 text-xs text-zinc-500">main.c</span>
          <span className="ml-auto text-xs text-zinc-600">
            {code.split("\n").length} linhas
          </span>
          {/* controles de altura */}
          <div className="ml-3 flex items-center gap-1">
            <button
              title="diminuir editor"
              onClick={() => setEditorHeight(clampH(editorHeight - 100))}
              className="h-6 w-6 rounded border border-zinc-700 text-zinc-400 text-xs hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
            >
              −
            </button>
            <button
              title="aumentar editor"
              onClick={() => setEditorHeight(clampH(editorHeight + 100))}
              className="h-6 w-6 rounded border border-zinc-700 text-zinc-400 text-xs hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
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
          className="group flex items-center justify-center h-4 cursor-row-resize border-t border-zinc-800 select-none"
          title="arraste para redimensionar"
        >
          <div className="h-0.5 w-10 rounded bg-zinc-700 group-hover:bg-emerald-500 transition-colors" />
        </div>
        <div className="px-4 py-3 border-t border-zinc-800 flex items-center justify-between gap-3">
          {running ? (
            <span className="text-xs text-emerald-400 animate-pulse">
              compilando e executando no sandbox...
            </span>
          ) : (
            <span className="text-xs text-zinc-600">pronto para executar</span>
          )}
          <button
            onClick={handleRun}
            disabled={running}
            className={`shrink-0 rounded px-5 py-2 text-sm font-semibold text-zinc-950 transition-all ${
              running
                ? "bg-zinc-700 cursor-not-allowed opacity-70"
                : "bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98]"
            }`}
          >
            {running ? "⏳ executando..." : "▶ executar"}
          </button>
        </div>
      </div>

      {/* PAINEL DE RESULTADO */}
      <div className="space-y-4">
        {!result && !running && (
          <div className="rounded-lg border border-dashed border-zinc-800 px-4 py-8 text-center">
            <p className="text-xs text-zinc-500">
              escreva sua solução no editor e clique em <span className="text-emerald-400">▶ executar</span>
            </p>
          </div>
        )}

        {running && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-8 text-center animate-pulse">
            <p className="text-xs text-zinc-400">compilando e executando no sandbox...</p>
          </div>
        )}

        {result && (
          <div
            className={`animate-fade-up rounded-lg border px-4 py-4 text-xs leading-relaxed ${
              result.status === "ok"
                ? "border-emerald-500/40 bg-emerald-500/10 animate-glow"
                : result.status === "error"
                  ? "border-zinc-700 bg-zinc-900"
                  : "border-red-500/30 bg-red-500/5"
            }`}
          >
            {result.status === "ok" && (
              <div>
                <p className="text-emerald-400 font-semibold text-sm">
                  🎉 Sucesso! Todos os testes passaram.
                </p>
                {completion && (
                  <div className="mt-2 space-y-1">
                    {completion.already_completed ? (
                      <p className="text-zinc-400">
                        Você já havia concluído esta missão — sem XP extra.
                      </p>
                    ) : (
                      <>
                        <p className="text-amber-300">
                          +{completion.xp_gained} XP
                          {completion.bonus_hint_free && (
                            <span className="text-zinc-400">
                              {" "}
                              (inclui +20 por não usar dicas)
                            </span>
                          )}
                        </p>
                        {completion.leveled_up && (
                          <p className="text-emerald-300 font-semibold">
                            ⬆️ LEVEL UP! Agora você é nível {completion.level}.
                          </p>
                        )}
                        {completion.streak_days ? (
                          <p className="text-amber-400/80">
                            🔥 streak: {completion.streak_days}{" "}
                            {completion.streak_days === 1 ? "dia" : "dias"}
                          </p>
                        ) : null}
                      </>
                    )}
                  </div>
                )}
                {!loggedIn && (
                  <p className="text-zinc-500 mt-2 text-[11px]">
                    entre com sua conta para registrar XP nesta missão
                  </p>
                )}
              </div>
            )}

            {result.status !== "ok" && (
              <div className="space-y-3">
                {result.friendly_error && (
                  <p className="text-zinc-200">🔎 {result.friendly_error}</p>
                )}

                {result.stdout && (
                  <div>
                    <p className="text-zinc-500 mb-1">saída do programa:</p>
                    <pre className="rounded bg-zinc-950 border border-zinc-800 p-3 overflow-x-auto text-zinc-300">
                      {result.stdout}
                    </pre>
                  </div>
                )}

                {result.stderr && result.status !== "error" && (
                  <details>
                    <summary className="text-zinc-500 cursor-pointer hover:text-zinc-300">
                      ver saída técnica do compilador
                    </summary>
                    <pre className="mt-2 rounded bg-zinc-950 border border-zinc-800 p-3 overflow-x-auto text-red-400/80">
                      {result.stderr}
                    </pre>
                  </details>
                )}

                {/* testes individuais */}
                {result.tests.length > 0 && (
                  <div className="space-y-2">
                    {result.tests.map((t, i) => (
                      <div
                        key={i}
                        className={`rounded border px-3 py-2 ${
                          t.passed
                            ? "border-emerald-500/30 bg-emerald-500/5"
                            : "border-red-500/30 bg-red-500/5"
                        }`}
                      >
                        <span className={t.passed ? "text-emerald-400" : "text-red-400"}>
                          {t.passed ? "✓" : "✗"} {t.label}
                        </span>
                        {!t.passed && t.expected_output !== undefined && (
                          <div className="mt-2 grid grid-cols-2 gap-2 text-zinc-400">
                            <div>
                              <p className="text-zinc-500 mb-1">esperado:</p>
                              <pre className="bg-zinc-950 border border-zinc-800 rounded p-2 whitespace-pre-wrap">
                                {t.expected_output}
                              </pre>
                            </div>
                            <div>
                              <p className="text-zinc-500 mb-1">seu programa:</p>
                              <pre className="bg-zinc-950 border border-zinc-800 rounded p-2 whitespace-pre-wrap">
                                {t.actual_output || "(sem saída)"}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* dicas progressivas (§7) */}
                {hints.length > 0 && (
                  <div className="pt-3 border-t border-zinc-800/60">
                    {hints.slice(0, hintLevel).map((h, i) => (
                      <p key={i} className="text-zinc-300 mb-2">
                        💡 <span className="text-amber-400">Dica {i + 1}:</span> {h.content}
                      </p>
                    ))}
                    {nextHintAvailable ? (
                      <button
                        onClick={() => setHintLevel(hintLevel + 1)}
                        className="text-amber-400 border border-amber-500/30 rounded px-3 py-1.5 hover:bg-amber-500/10 transition-colors"
                      >
                        💡 pedir dica ({hintLevel}/{hints.length})
                      </button>
                    ) : (
                      <div>
                        {solutionCode && !showSolution && (
                          <button
                            onClick={() => setShowSolution(true)}
                            className="text-zinc-400 border border-zinc-700 rounded px-3 py-1.5 hover:text-zinc-200 transition-colors"
                          >
                            👁️ ver solução
                          </button>
                        )}
                        {showSolution && solutionCode && (
                          <pre className="mt-3 rounded bg-zinc-950 border border-zinc-800 p-3 overflow-x-auto text-zinc-400">
                            {solutionCode}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
