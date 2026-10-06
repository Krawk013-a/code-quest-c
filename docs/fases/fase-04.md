# Fase 4 — CodeRunner + CRunner ✅

## Objetivo

Abstração de execução por linguagem (§3.2) + execução real de C em sandbox
externo (§20), com sistema de erros inteligente (§8).

## Arquitetura criada

```
Frontend → POST /api/run → getRunner('c') → CRunner → Judge0 API (sandbox)
                                      ↘ error-translator (GCC → PT-BR)
```

- `src/lib/runner/types.ts` — interface `CodeRunner` + `outputsMatch` (comparação tolerante)
- `src/lib/runner/judge0.ts` — cliente do executor (base64, timeouts, X-Auth-Token opcional)
- `src/lib/runner/c-runner.ts` — `CRunner` (compilação única, testes sequenciais)
- `src/lib/runner/error-translator.ts` — erros do GCC/runtime → explicações amigáveis
- `src/lib/runner/index.ts` — registry (nova linguagem = novo runner + 1 linha)
- `src/app/api/run/route.ts` — API route com limites anti-abuso (20KB código, 20 testes)

## Executor

**Judge0 CE público** (`https://ce.judge0.com`, language_id 50 = C/GCC).
Foi o design pedido pelo Plano Mestre ("API compatível com Judge0").
- Env vars: `JUDGE0_URL`, `JUDGE0_KEY` (opcional, para self-host no futuro)
- Public CE usa base64 end-to-end (GCC emite non-UTF8)

**Alternativas testadas:** Piston público (whitelist-only desde 02/2026 ❌),
Wandbox (funciona ✅, backup).

## Bugs reais encontrados e corrigidos nesta fase

1. **Falso "ok"**: `allPassed` inicializava com o status de execução da 1ª
   run, ignorando a comparação de saída do 1º teste → missão passava mesmo
   com output errado. Corrigido para `allPassed = true` + avaliação real.
2. **Tradutor cego**: GCC emite aspas tipográficas (`‘;’` U+2018/U+2019) e
   as regexes ASCII não casavam. Corrigido com classe de aspas Unicode.

## Validação (contra Judge0 real, via API /api/run)

| Cenário | Resultado |
|---|---|
| Lab: hello world | `ok` + stdout ✅ |
| Missão: 3 testes scanf (21/-5/0) | `ok`, 3/3 ✅ |
| Saída errada (triplo vs dobro) | `wrong_answer` ✅ |
| `;` faltando | `compile_error` + tradução amigável ✅ |
| Segfault | `runtime_error` + "acessou memória que não pode" ✅ |
| `while(1){}` | `timeout` + dica de loop infinito ✅ |
| Linguagem inexistente | 400 "não suportada" ✅ |
| Código > 20KB | 413 ✅ |

## Notas de deploy (Vercel)

A API roda server-side; o frontend nunca fala direto com o Judge0.
Para produção pública futura: self-host Judge0 (Docker) + `JUDGE0_KEY`,
rate limiting no edge (Upstash) — §20.

## Próxima fase (5)

Loop da primeira missão: `/missoes/[slug]` com editor de código,
botão executar, painel de testes, dicas progressivas.
