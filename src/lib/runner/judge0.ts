// Cliente de baixo nível para API compatível com Judge0.
//
// Executor é tratado como ambiente não confiável (§20): o código do
// usuário NUNCA roda no nosso servidor — vai para o sandbox externo.
// Config via env (padrão = Judge0 CE público, sem key):
//   JUDGE0_URL   — ex. https://ce.judge0.com (ou instância self-hosted)
//   JUDGE0_KEY   — X-Auth-Token se a instância exigir (opcional)
//
// Public CE exige base64 para não quebar em erros non-UTF8 do GCC.

const DEFAULT_URL = "https://ce.judge0.com";
const LANGUAGE_C_ID = 50; // C (GCC) na tabela de linguagens do Judge0

interface Judge0SubmissionResult {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  status: { id: number; description: string };
  time: string | null;
  token?: string;
}

// IDs de status do Judge0 que usamos
const STATUS_ACCEPTED = 3;
const STATUS_TIME_LIMIT = 5;
const STATUS_COMPILATION_ERROR = 6;
const STATUS_RUNTIME_ERROR = 11;

export class Judge0Error extends Error {
  constructor(
    message: string,
    public readonly kind: "network" | "api" | "timeout"
  ) {
    super(message);
    this.name = "Judge0Error";
  }
}

function b64(s: string): string {
  // roda no server (Node), Buffer disponível
  return Buffer.from(s, "utf-8").toString("base64");
}

function unb64(s: string | null): string {
  if (!s) return "";
  try {
    // Judge0 CE público retorna base64 quando base64_encoded=true
    return Buffer.from(s, "base64").toString("utf-8");
  } catch {
    return s;
  }
}

export interface SubmitResult {
  ok: boolean;
  statusId: number;
  statusDescription: string;
  stdout: string;
  stderr: string;
  compileOutput: string;
  timeMs: number | null;
}

export async function submitC(
  code: string,
  stdin: string,
  timeouts: { compileMs: number; runMs: number } = {
    compileMs: 10_000,
    runMs: 5_000,
  }
): Promise<SubmitResult> {
  const url = process.env.JUDGE0_URL ?? DEFAULT_URL;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (process.env.JUDGE0_KEY) {
    headers["X-Auth-Token"] = process.env.JUDGE0_KEY;
  }

  let res: Response;
  try {
    res = await fetch(
      `${url}/submissions/?wait=true&base64_encoded=true&fields=stdout,status,stderr,compile_output,time`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          language_id: LANGUAGE_C_ID,
          source_code: b64(code),
          stdin: b64(stdin),
          compile_timeout: timeouts.compileMs,
          cpu_time_limit: Math.ceil(timeouts.runMs / 1000),
        }),
        signal: AbortSignal.timeout(30_000),
      }
    );
  } catch (err) {
    const isTimeout =
      err instanceof Error && err.name === "TimeoutError";
    throw new Judge0Error(
      isTimeout
        ? "O executor demorou demais para responder."
        : `Falha ao contatar o executor: ${err instanceof Error ? err.message : "erro desconhecido"}`,
      isTimeout ? "timeout" : "network"
    );
  }

  if (!res.ok) {
    throw new Judge0Error(
      `Executor respondeu HTTP ${res.status}`,
      "api"
    );
  }

  const data = (await res.json()) as Judge0SubmissionResult;
  const timeMs = data.time ? Math.round(parseFloat(data.time) * 1000) : null;

  return {
    ok: data.status?.id === STATUS_ACCEPTED,
    statusId: data.status?.id ?? 0,
    statusDescription: data.status?.description ?? "desconhecido",
    stdout: unb64(data.stdout),
    stderr: unb64(data.stderr),
    compileOutput: unb64(data.compile_output),
    timeMs,
  };
}

export const Judge0Status = {
  ACCEPTED: STATUS_ACCEPTED,
  TIME_LIMIT: STATUS_TIME_LIMIT,
  COMPILATION_ERROR: STATUS_COMPILATION_ERROR,
  RUNTIME_ERROR: STATUS_RUNTIME_ERROR,
} as const;
