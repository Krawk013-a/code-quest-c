# Fase 2 — Supabase (dados + RLS)

## Objetivo

Schema completo no PostgreSQL (Supabase) com Row Level Security, pronto para receber missões como dado.

## Entregas

- [x] `supabase/migrations/v1_fundacao.sql` — migration idempotente com:
  - enums `activity_type` (mission/challenge/boss/project) e `difficulty`
  - `profiles` (XP, nível, streak) + trigger `handle_new_user` (cria profile no signup)
  - `languages` (plugin de linguagem: slug, monaco_id)
  - `worlds` (mundos + regra de desbloqueio: required_missions + required_boss)
  - `missions` (contexto, enunciado, código inicial, testes JSONB, dicas JSONB, XP, conceitos)
  - `badges` / `user_badges`
  - `user_progress` (status, tentativas, dicas usadas, XP ganho)
  - `subscriptions` (estrutura futura, §21 — sem uso agora)
  - RLS em todas as tabelas (usuário só acessa as próprias linhas; conteúdo público é read-only)
  - **GRANTs explícitos** — projetos Supabase 2025+ não expõem APIs sem GRANT
- [x] Seed: linguagem C + Mundo 0 (Primeiros Passos)
- [x] Tipos TypeScript espelhando o schema (`src/types/database.ts`)
- [x] Client Supabase browser/server + middleware de sessão (publishable key)
- [x] Migration validada localmente em PostgreSQL 17 real (idempotência 2x, trigger, RLS, grants)

## Como rodar a migration

1. Supabase Dashboard → **SQL Editor** → **New query**
2. Colar todo o conteúdo de `supabase/migrations/v1_fundacao.sql`
3. **Run** — pode rodar mais de uma vez sem quebrar (idempotente)
4. Ao final, a query de conferência retorna as contagens de linhas por tabela

## Pendências (próximas fases)

- Auth básica (login/signup) — Fase 1 do roadmap do Plano Mestre
- CodeRunner + CRunner — Fase 2
- Primeira missão de verdade no banco — Fase 3
