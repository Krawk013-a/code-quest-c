# Fase 1 — Fundação ✅

## Objetivo

Criar a base do projeto: repositório, stack, arquitetura de pastas e documentação.

## Entregas

- [x] Repositório GitHub: `Krawk013-a/code-quest-c`
- [x] Next.js 16 + React 19 + TypeScript (App Router, `src/`)
- [x] Tailwind CSS v4
- [x] Estrutura de pastas da arquitetura (engine / runner / supabase / components / types)
- [x] `docs/PLANO_MESTRE.md` no repositório
- [x] README com visão geral e roadmap resumido

## Arquitetura criada

```
Frontend (src/app)
    ↓
Engine de aprendizagem (src/lib/engine)
    ↓
Supabase (src/lib/supabase)
    ↓
CodeRunner (src/lib/runner)
    ↓
Executor de código (sandbox externo — Judge0-compatible)
```

## Pendências (próximas fases)

- Supabase: projeto, schema, RLS (Fase 1 do roadmap do Plano Mestre → docs/fases/fase-02.md)
- Auth básica
- CodeRunner + CRunner
- Loop da primeira missão

## Como rodar

```bash
npm install
npm run dev
# http://localhost:3000
```
