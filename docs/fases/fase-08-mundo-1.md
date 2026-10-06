# Mundo 1 — Variáveis ✅ (migration v5_mundo_1.sql)

## Conteúdo

| # | Missão | Tipo | Conceitos | XP |
|---|---|---|---|---|
| 1 | Memória do Sistema | missão | int, declaração, atribuição, %d | 100 |
| 2 | Painel de Telemetria | missão | float, %.2f | 100 |
| 3 | Identificador da Unidade | missão | char, %c, aspas simples | 100 |
| 4 | Recalcular Rotas | missão | reatribuição (valor muda) | 100 |
| 5 | Relatório de Carga | 🔵 desafio | int+float combinados, média | 150 |
| 6 | 👾 Firmware do Reator | boss | char+int+float+atribuição | 300 |

Desbloqueio: 4 missões + boss. Requisito do mundo: sequência lógica
declarar → atribuir → reatribuir → combinar tipos.

## Validação

- ✅ Migration idempotente (PostgreSQL 17 local)
- ✅ **Todas as 6 soluções executadas no Judge0 real: 6/6 Accepted**
  (script extrai soluções do banco e roda contra os próprios testes)
- Correção no SQL: aspas simples do C (`'A'`) precisam virar `''A''`
  dentro de string SQL (hint da missão identificador)

## Ação do Enzo

SQL Editor → colar `supabase/migrations/v5_mundo_1.sql` → Run.

## Próximos mundos (mesmo formato, quando quiser)

- Mundo 2 — Operadores (aritméticos, relacionais, lógicos)
- Mundo 3 — Entrada de dados (scanf — primeira com stdin!)
