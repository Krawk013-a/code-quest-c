# Fase 7 — Gamificação + UI de verdade ✅

## Objetivo

Fechar o MVP das Fases 1–7 do roadmap: UI de qualidade de produto
(CodeMirror, tipografia, animações) + gamificação visível (XP, nível,
streak, progresso por mundo).

## UI

- **Editor de código real** — CodeMirror 6 com `@codemirror/lang-cpp`,
  tema "CodeQuest" custom (dark + verde terminal): números de linha,
  linha ativa, syntax highlight C (keywords rosa, strings âmbar,
  números roxos, funções verdes, `#include` laranja), fechamento de
  brackets, seleção escura
- **Tipografia** — JetBrains Mono via `next/font` em tudo
- **Design tokens** em `globals.css`: scrollbar custom, seleção de texto
  verde, animações `fade-up` e `glow` discretas (§18)
- **Dashboard**: anel de nível em SVG (XpRing) com cor âmbar, streak em
  chip destaque, "próximo nível: N XP", cards de mundo com barra de
  progresso (x/7, %) e estado (🌎 aberto / 🏆 completo)
- **Página de mundo**: cabeçalho com progresso, regra de desbloqueio,
  boss destacado em vermelho com 👾 pulsante, missões concluídas verdes
- **Workspace**: status "compilando no sandbox..." no rodapé do editor,
  resultado com fade-up, sucesso com glow sutil

## Validação

- Dashboard com usuário real (e2e_bot): nível 2, 120/300 XP no anel,
  streak 1 dia, mundo 1/7 = 14% — tudo renderizando com dados do banco ✅
- `next build` limpo, tsc limpo ✅

## Correções de tipos

- `t.preprocessor` não existe no @lezer/highlight atual → `t.meta`
  cobre `#include`

## Próximos passos (pós-MVP, sob demanda)

- F8: dicas com custo de XP visível · F9: domínio por conceito
- F14: Laboratório (editor livre) — infra já pronta (runner modo lab)
- Mundo 1: Variáveis (primeira expansão de conteúdo)
