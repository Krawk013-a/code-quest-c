"use client";

import { useState } from "react";
import type { RunResult } from "@/types/database";

/**
 * Workspace da missão: editor de código + painel de execução.
 * Um único componente para compartilhar o estado do código limpo.
 */
export default function MissionWorkspace({
  missionSlug,
  initialCode,
  hints,
  solutionCode,
}: {
  missionSlug: string;
  initialCode: string;
  hints: { content: string }[];
  solutionCode: string | null;
}) {
  const [code, setCode] = useState(initialCode);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [success, setSuccess] = useState(false);

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
        if (data.status === "ok") setSuccess(true);
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

  const nextHintAvailable = hintLevel < hints.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* EDITOR */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
          <span className="ml-3 text-xs text-zinc-500">main.c</span>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="w-full h-[420px] bg-zinc-950 text-zinc-100 text-sm font-mono p-4 outline-none resize-none leading-relaxed"
        />
        <div className="px-4 py-3 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-600">
            {code.split("\n").length} linhas
          </span>
          <button
            onClick={handleRun}
            disabled={running}
            className="rounded bg-emerald-500 px-5 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {running ? "executando..." : "▶ executar"}
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
            className={`rounded-lg border px-4 py-4 text-xs leading-relaxed ${
              result.status === "ok"
                ? "border-emerald-500/40 bg-emerald-500/10"
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
                {success && (
                  <p className="text-zinc-400 mt-1">
                    +XP registrado no seu progresso.
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
