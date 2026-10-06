# Fase 5 — Loop da primeira missão ✅

## Objetivo

O coração do produto (§9): enunciado → código → executar → testes → feedback,
com dicas progressivas (§7) e erros inteligentes (§8).

## Entregas

- [x] `/missoes/[slug]` — página da missão:
  - contexto imersivo (§5), objetivo, explicação curta, conceitos (chips)
  - editor de código (textarea monoespaçada estilo terminal) com código inicial
  - botão ▶ executar → `POST /api/run { mission_slug, code }`
  - painel de resultado: sucesso 🎉 / erro amigável 🔎 / saída técnica (details)
  - testes individuais: ✓/✗ com esperado vs. seu programa
  - **dicas progressivas**: botão revela 1 dica por vez; solução só no fim
- [x] `POST /api/run` com `mission_slug`: **testes vêm do banco** (client
  não pode adulterar expected_output); linguagem definida pelo runner da missão
- [x] Migration v3: primeira missão real — **"Sinal de Vida"** (Mundo 0)
  - contexto: o terminal desperta, sistema precisa provar que está vivo
  - objetivo: imprimir `olá, terminal`
  - 1 teste de saída + 3 dicas progressivas + solução de referência
  - 100 XP · conceitos: printf, main

## Validação

- migration v3 idempotente no PostgreSQL 17 local ✅ (INSERT 0 1, conferência OK)
- `/api/run` modo lab contra Judge0 real ✅
- missão inexistente → 404 / "Missão não encontrada" ✅
- todos os cenários do runner (Fase 4) seguem válidos ✅
- `next build` limpo ✅

## Ação do Enzo (1 vez)

SQL Editor → colar `supabase/migrations/v3_missao_01.sql` → Run.

## Próxima fase (6)

Mundo 0 completo: 8 missões principais + boss + progresso gravado no banco
(user_progress + XP de verdade).
