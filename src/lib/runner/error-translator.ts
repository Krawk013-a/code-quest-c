// Sistema de erros inteligente (Plano Mestre §8)
// Transforma erros técnicos do GCC em explicações compreensíveis.
// Regra: o erro cru continua visível (usuário precisa aprender a ler),
// mas ganha um "tradutor" em cima.

interface Rule {
  /** regex aplicado ao texto completo do compilador/stderr */
  pattern: RegExp;
  /** explicação amigável; {line} é substituído pela linha do erro */
  friendly: string;
}

// Aspas que o GCC usa ao redor de tokens:
// ASCII ' (27), tipográfica aberta ‘ (U+2018), fechada ’ (U+2019), “ (U+201C)
const Q = "['\\u2018'\\u2019\"\\u201C]?";

const RULES: Rule[] = [
  // ---- erros de compilação (GCC) ----
  {
    // GCC: expected ‘;’ before ‘return’ (aspas tipográficas!)
    pattern: new RegExp(`expected ${Q};${Q} before`, "i"),
    friendly:
      "Parece que uma instrução anterior não foi finalizada. Procure um `;` faltando perto da linha {line}.",
  },
  {
    pattern: new RegExp(`expected ${Q}\\)?${Q} before`, "i"),
    friendly:
      "Há um parêntese aberto que não foi fechado. Conte os `(` e `)` da linha {line}.",
  },
  {
    pattern: new RegExp(`expected ${Q}\\}?${Q} before`, "i"),
    friendly:
      "Faltou fechar uma chave `}`. Verifique se todo bloco aberto na função foi fechado.",
  },
  {
    // GCC: ‘idade’ undeclared (first use in this function) — aspas tipográficas
    pattern: new RegExp(
      `[${"'‘’\"“"}](\\w+)[${"'‘’\"“"}] undeclared`,
      "i"
    ),
    friendly:
      "O nome `{token}` não foi declarado antes de ser usado. Confira a grafia (maiúsculas importam!) ou declare a variável antes da linha {line}.",
  },
  {
    pattern: /implicit declaration of function ['"]?(\w+)['"]?/i,
    friendly:
      "A função `{token}` foi chamada mas o compilador não a conhece. Verifique se o `#include` necessário está no topo do arquivo.",
  },
  {
    pattern: /conflicting types for/i,
    friendly:
      "A função ou variável foi declarada com tipos diferentes em dois lugares. Um deles precisa mudar.",
  },
  {
    pattern: /redefinition of/i,
    friendly:
      "O mesmo nome foi declarado duas vezes no mesmo escopo. Remova ou renomeie uma das declarações.",
  },
  {
    pattern: /incompatible implicit declaration of built-in function/i,
    friendly:
      "Você usou uma função da biblioteca padrão sem incluir o cabeçalho dela (ex.: `printf` precisa de `#include <stdio.h>`).",
  },
  {
    pattern: /expected declaration or statement at end of input/i,
    friendly:
      "O código terminou no meio de um bloco. Provavelmente falta fechar uma chave `}` no final.",
  },
  {
    pattern: /expected expression before/i,
    friendly:
      "O compilador esperava um valor ou expressão e encontrou outra coisa. Revise a sintaxe perto da linha {line}.",
  },
  // ---- tempo de execução ----
  {
    pattern: /Segmentation fault/i,
    friendly:
      "O programa tentou acessar memória que não pode (ponteiro nulo, índice inválido, scanf sem `&`...). Revise acessos a ponteiros e vetores.",
  },
  {
    pattern: /Floating point exception/i,
    friendly:
      "Operação matemática inválida — quase sempre uma divisão por zero (inteiro). Proteja o divisor com um `if`.",
  },
  {
    pattern: /Timed? ?[Oo]ut|Time limit exceeded/i,
    friendly:
      "O programa passou do tempo limite. Cuidado com loops infinitos — a condição de parada realmente muda dentro do loop?",
  },
  {
    pattern: /stack overflow/i,
    friendly:
      "A pilha estourou. Recursão sem caso base, ou vetor local gigante demais?",
  },
];

/** Extrai a primeira linha de código mencionada no erro do GCC */
function extractLine(stderrText: string): string {
  // formato: main.c:2:23: error: ...
  const m = stderrText.match(/main\.c:(\d+):\d+/);
  return m ? m[1] : "?";
}

/** Extrai o identificador citado (para undeclared/implicit declaration) */
function extractToken(stderrText: string, pattern: RegExp): string {
  const m = stderrText.match(pattern);
  if (m && m.length > 1) return m[1];
  return "…";
}

/**
 * Traduz um erro técnico em explicação amigável.
 * Retorna undefined quando não há tradução conhecida.
 */
export function translateError(rawError: string): string | undefined {
  for (const rule of RULES) {
    if (rule.pattern.test(rawError)) {
      const line = extractLine(rawError);
      const token = extractToken(rawError, rule.pattern);
      return rule.friendly.replace("{line}", line).replace("{token}", token);
    }
  }
  return undefined;
}
