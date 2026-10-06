// CRunner — implementação de CodeRunner para C (GCC) via Judge0
// (Plano Mestre §3.2: linguagem é plugin; §20: sandbox externo)

import type { MissionTest, RunResult, TestResult } from "@/types/database";
import type { CodeRunner } from "./types";
import { outputsMatch } from "./types";
import {
  submitC,
  Judge0Error,
  Judge0Status,
} from "./judge0";
import { translateError } from "./error-translator";

export class CRunner implements CodeRunner {
  readonly language = "c";

  async run(code: string, tests: MissionTest[]): Promise<RunResult> {
    // 1) compilação+execução única (com stdin do 1º teste ou vazio)
    let first;
    try {
      first = await submitC(code, tests[0]?.input ?? "");
    } catch (err) {
      if (err instanceof Judge0Error) {
        return {
          status: "error",
          stdout: "",
          stderr: "",
          friendly_error: err.message,
          tests: [],
        };
      }
      throw err;
    }

    // 2) erro de compilação → não roda mais nada
    if (first.statusId === Judge0Status.COMPILATION_ERROR) {
      return {
        status: "compile_error",
        stdout: "",
        stderr: first.compileOutput,
        friendly_error: translateError(first.compileOutput),
        tests: [],
        time_ms: first.timeMs ?? undefined,
      };
    }

    // 3) timeout na primeira execução
    if (first.statusId === Judge0Status.TIME_LIMIT) {
      return {
        status: "timeout",
        stdout: first.stdout,
        stderr: first.stderr,
        friendly_error: translateError("Timed Out"),
        tests: [],
      };
    }

    // 4) modo laboratório (sem testes): devolve a saída direto
    if (tests.length === 0) {
      if (first.statusId !== Judge0Status.ACCEPTED) {
        // runtime error no modo lab
        return {
          status: "runtime_error",
          stdout: first.stdout,
          stderr: first.stderr,
          friendly_error: translateError(first.stderr),
          tests: [],
          time_ms: first.timeMs ?? undefined,
        };
      }
      return {
        status: "ok",
        stdout: first.stdout,
        stderr: first.stderr,
        tests: [],
        time_ms: first.timeMs ?? undefined,
      };
    }

    // 5) missão: avalia todos os testes
    const results: TestResult[] = [];
    let allPassed = true;
    let runtimeError = first.statusId !== Judge0Status.ACCEPTED;

    const firstPassed =
      first.ok && outputsMatch(tests[0].expected_output, first.stdout);
    allPassed = allPassed && firstPassed;
    results.push({
      label: tests[0].label ?? "Teste 1",
      passed: firstPassed,
      input: tests[0].hidden ? undefined : tests[0].input,
      expected_output: tests[0].hidden ? undefined : tests[0].expected_output,
      actual_output: first.stdout,
    });

    for (let i = 1; i < tests.length; i++) {
      const t = tests[i];
      let r;
      try {
        r = await submitC(code, t.input ?? "");
      } catch (err) {
        if (err instanceof Judge0Error) {
          return {
            status: "error",
            stdout: "",
            stderr: "",
            friendly_error: err.message,
            tests: results,
          };
        }
        throw err;
      }

      if (r.statusId === Judge0Status.COMPILATION_ERROR) {
        // improvável (mesmo código), mas defensivo
        return {
          status: "compile_error",
          stdout: "",
          stderr: r.compileOutput,
          friendly_error: translateError(r.compileOutput),
          tests: results,
        };
      }
      if (r.statusId === Judge0Status.TIME_LIMIT) {
        results.push({
          label: t.label ?? `Teste ${i + 1}`,
          passed: false,
        });
        allPassed = false;
        continue;
      }

      const passed =
        r.statusId === Judge0Status.ACCEPTED &&
        outputsMatch(t.expected_output, r.stdout);
      if (!passed) allPassed = false;
      if (r.statusId !== Judge0Status.ACCEPTED) runtimeError = true;

      results.push({
        label: t.label ?? `Teste ${i + 1}`,
        passed,
        input: t.hidden ? undefined : t.input,
        expected_output: t.hidden ? undefined : t.expected_output,
        actual_output: r.stdout,
      });
    }

    if (allPassed) {
      return {
        status: "ok",
        stdout: first.stdout,
        stderr: "",
        tests: results,
      };
    }

    // algum teste falhou: wrong_answer (saída errada) ou runtime_error
    const anyRuntime = runtimeError && !results.some((r) => r.passed === true);
    return {
      status: anyRuntime ? "runtime_error" : "wrong_answer",
      stdout: first.stdout,
      stderr: anyRuntime ? first.stderr : "",
      friendly_error: anyRuntime
        ? translateError(first.stderr)
        : undefined,
      tests: results,
    };
  }
}
