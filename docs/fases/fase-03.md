# Fase 3 — Auth básica ✅

## Objetivo

Login/cadastro com Supabase Auth, dashboard protegido e páginas de mundo com progresso visível.

## Entregas

- [x] `/login` — abas entrar/criar conta, estilo terminal, erros traduzidos pra PT-BR
- [x] Cadastro coleta `username` + `display_name` (via `raw_user_meta_data`)
- [x] Middleware protege `/dashboard` (redirect → `/login`)
- [x] `/dashboard` — nome, nível, XP com barra de progresso, streak, mapa de mundos, missões completadas
- [x] `/mundos/[slug]` — lista de missões do mundo com ícone por tipo (🟢🔵👾🟣), XP e status concluída
- [x] `v2_auth_trigger.sql` — trigger de signup com resolução de colisão de username (`enzo` → `enzo1` → `enzo2`), normalização minúscula/[a-z0-9_]/20 chars
- [x] Curva de XP: nível n custa 100×n XP (`xpForLevel`), nível 1 → 2 = 100 XP

## Decisões técnicas desta fase

- **supabase-js 2.117** mudou o sistema de tipos: `GenericSchema` exige que Row/Insert/Update sejam assignable a `Record<string, unknown>` — **interfaces nomeadas falham**, por isso todos os tipos viraram `type` aliases (TS dá index signature implícita só a aliases)
- Conflict de versão `@supabase/ssr` ↔ `supabase-js` resolvido com update conjunto p/ 2.117.2
- Confirmação de email está **desativada** no projeto (uso pessoal) — signup já devolve sessão

## Validação (contra o Supabase real)

- signup → cria user + profile via trigger ✅
- login → sessão ✅
- RLS: profile só visível pro dono ✅
- user_progress vazio p/ user novo ✅
- trigger v2 testado localmente (PostgreSQL 17): colisão de username gera sufixo ✅

## Como rodar

```bash
npm run dev
# / → landing
# /login → criar conta (username + email + senha)
# /dashboard → protegido
# /mundos/mundo-0-primeiros-passos → vazio até a Fase 4 (missões)
```

## Rodar a migration v2 (ação do Enzo)

SQL Editor → colar `supabase/migrations/v2_auth_trigger.sql` → Run.
(Importante **antes** de criar sua conta real, pro username ja sair normalizado.)

## Pendências (próximas fases)

- CodeRunner + CRunner (Fase 4)
- Primeira missão no banco + loop editor→executar→testes (Fase 5)
