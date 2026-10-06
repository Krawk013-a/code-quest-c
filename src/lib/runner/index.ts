// Registry de CodeRunners — o ponto de extensão do sistema.
// Nova linguagem: implementar CodeRunner e registrar aqui. Nada mais muda.

import type { CodeRunner } from "./types";
import { CRunner } from "./c-runner";

const runners: Record<string, CodeRunner> = {
  c: new CRunner(),
  // python: new PythonRunner(),  // FASE 17
  // javascript: new JavaScriptRunner(),
};

export function getRunner(languageSlug: string): CodeRunner {
  const runner = runners[languageSlug];
  if (!runner) {
    throw new Error(
      `Nenhum CodeRunner registrado para a linguagem "${languageSlug}".`
    );
  }
  return runner;
}

export function listRunners(): string[] {
  return Object.keys(runners);
}

export type { CodeRunner } from "./types";
