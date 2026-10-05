# CodeQuest C

> "Não quero criar um aplicativo que ensina programação. Quero criar um aplicativo que faça alguém querer programar."

Plataforma web gamificada de aprendizagem de programação — começando pela linguagem **C**.

O objetivo não é ensinar sintaxe: é fazer o usuário **programar de verdade** — resolver problemas, cometer erros, entendê-los e perceber a própria evolução.

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js (React + TypeScript) |
| UI | Tailwind CSS |
| Backend/Dados | Supabase |
| Banco | PostgreSQL |
| Autenticação | Supabase Auth |
| Segurança | Row Level Security |
| Execução de código | API compatível com Judge0 |
| Hospedagem | Vercel |

## Arquitetura

```
Frontend (Next.js)
    ↓
Engine de aprendizagem (src/lib/engine)
    ↓
Supabase / dados (src/lib/supabase)
    ↓
CodeRunner (src/lib/runner — abstração por linguagem)
    ↓
Executor de código (sandbox externo)
```

- **Conteúdo é dado, não código**: missões vivem no banco de dados; adicionar missão não exige mudar o frontend.
- **Linguagem é plugin**: `CodeRunner` é a abstração; `CRunner` é a primeira implementação (depois Python, JS...).
- **Separação de responsabilidades**: a lógica de aprendizagem nunca fica misturada com a interface.

## Estrutura de pastas

```
src/
├── app/               # Páginas e rotas (Next.js App Router)
├── components/        # Componentes de UI reutilizáveis
│   ├── editor/        # Editor de código
│   ├── mission/       # Loop de missão (contexto, testes, dicas)
│   └── ui/            # Primitivos (botão, card, badge...)
├── lib/
│   ├── engine/        # Engine de aprendizagem (XP, progresso, domínio)
│   ├── runner/        # CodeRunner + CRunner (abstração de execução)
│   └── supabase/      # Clientes e tipos do Supabase
├── types/             # Tipos TypeScript compartilhados
docs/
├── PLANO_MESTRE.md    # Especificação completa do projeto
└── fazes/             # Documentos por fase (fase-01.md, fase-02.md...)
supabase/
└── migrations/        # Migrations SQL idempotentes (v1, v2, ...)
```

## Fases

O projeto evolui **uma fase por vez** — ver [docs/PLANO_MESTRE.md](docs/PLANO_MESTRE.md) para o roadmap completo (Fases 1–19).

- 🟩 F1 — Fundação ✅
- 🟩 F2 — CodeRunner
- 🟩 F3 — Primeira missão
- 🟩 F4 — Mundo 0
- 🟩 F5 — Gamificação (XP, nível, streak)
- ... resto em `docs/PLANO_MESTRE.md`

## Licença

MIT
