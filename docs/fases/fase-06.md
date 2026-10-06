# Fase 6 — Mundo 0 completo ✅

## Objetivo

Mundo 0 inteiro no banco (4 missões + 1 desafio + 1 boss, além da Sinal de
Vida) e progresso gravado de verdade: XP, nível, streak, tentativas.

## Conteúdo (migration v4_mundo_0.sql)

| # | Missão | Tipo | Conceitos | XP |
|---|---|---|---|---|
| 1 | Sinal de Vida (v3) | missão | printf, main | 100 |
| 2 | Painel de Status | missão | printf, \n | 100 |
| 3 | Manual do Operador | missão | comentários | 100 |
| 4 | Sequência de Inicialização | missão | ordem de execução | 100 |
| 5 | Caracteres de Controle | missão | \t, \" | 100 |
| 6 | Relatório do Sistema | 🔵 desafio | printf+escape sem manual | 150 |
| 7 | 👾 Despertar Completo | boss | tudo do mundo | 300 |

Regra de desbloqueio do mundo atualizada: 4 missões + boss (§13).

## Engine + gravação de progresso

- `src/lib/engine/levels.ts` — curva de XP: nível n→n+1 custa 100×n XP
  (nível 2 = 100 XP, nível 3 = 300 XP acumulados...), `levelForXp`,
  `levelProgress`. Dashboard agora usa a engine (sem duplicação).
- `POST /api/missions/[slug]/complete` — **anti-trapaça**:
  1. busca missão+testes no banco (client não manda testes)
  2. **re-executa o código no sandbox server-side**
  3. só então grava: `user_progress` (upsert), XP, nível, streak
- XP (§10): +20 sem dicas, +5 com ≤2 dicas, re-completar não paga
- `MissionWorkspace` agora: chama `/complete` ao passar, mostra +XP,
  LEVEL UP e streak; badge "✓ você já concluiu esta missão" na página

## Validação E2E (contra Supabase real + Judge0 real)

Usuário `e2e_bot` criado, logado via cookie ssr, missão resolvida via API:

- ✅ completo c/ solução correta → +120 XP, level up 1→2, streak 1
- ✅ re-completar → `xp_gained: 0, already_completed: true`
- ✅ código errado → "A solução ainda não passa nos testes."
- ✅ sem login → 401
- ✅ banco via RLS confirma: 120 XP / nível 2 / progress completed
- ✅ migration v4 idempotente no PostgreSQL 17 local (7 missões listadas)

## Ação do Enzo (1 vez)

SQL Editor → colar `supabase/migrations/v4_mundo_0.sql` → Run.

## Próxima fase (7)

Gamificação na tela: mapa de mundos com estados (bloqueado/andamento/
concluído), destaque de XP, badges de primeira conquista.
