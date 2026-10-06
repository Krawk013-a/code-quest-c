// CodeRunner — abstração de execução por linguagem (Plano Mestre §3.2)
//
// A aplicação nunca sabe COMO uma linguagem roda; ela pede um runner
// pelo slug da linguagem e recebe uma interface uniforme.
// Nova linguagem = novo arquivo aqui + registro no index.ts.

import type { MissionTest, RunResult } from "@/types/database";

export interface CodeRunner {
  /** slug da linguagem que este runner executa ('c', 'python'...) */
  readonly language: string;

  /**
   * Executa o código contra uma lista de testes.
   * - tests vazio: executa uma vez sem stdin (modo laboratório)
   * - compilação falha: retorna compile_error e não roda os demais
   */
  run(code: string, tests: MissionTest[]): Promise<RunResult>;
}

/** Comparação de saídas: tolerante a espaços/quebras de linha no fim */
export function outputsMatch(expected: string, actual: string): boolean {
  const norm = (s: string) =>
    s
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((line) => line.replace(/[ \t]+$/g, ""))
      .join("\n")
      .replace(/\n+$/g, "")
      .trim();
  return norm(expected) === norm(actual);
}
