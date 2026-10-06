-- ============================================================
-- CodeQuest C — Migration V5: Mundo 1 — Variáveis
-- Rodar no Supabase SQL Editor. Idempotente: pode rodar 2x.
-- ============================================================

-- ---------- MUNDO 1 ----------

INSERT INTO public.worlds (language_id, number, slug, title, description, required_missions, required_boss, sort_order)
SELECT l.id, 1, 'mundo-1-variaveis', 'Variáveis',
  'int, float, double, char — declarar, atribuir e combinar valores na memória.',
  4, true, 1
FROM public.languages l
WHERE l.slug = 'c'
ON CONFLICT (slug) DO NOTHING;

-- ---------- MISSÃO 1: memoria-do-sistema ----------

INSERT INTO public.missions (
  world_id, slug, title, activity, difficulty,
  context_text, objective_text, explanation_md,
  initial_code, solution_code, tests, hints,
  xp_reward, concepts, sort_order, is_active
)
SELECT
  w.id, 'memoria-do-sistema', 'Memória do Sistema', 'mission', 'easy',
  $ctx$🧠 **A PRIMEIRA CÉLULA**

O terminal agora tem um problema novo: ele esquece tudo entre uma instrução e outra.

Computadores guardam valores na **memória** — e para usar um pedaço dela, você reserva um espaço e dá um nome a ele. Isso é uma **variável**.

Cada variável tem um **tipo**: o que ela pode guardar.$ctx$,
  'Declare uma variável chamada energia com valor 7 e imprima:
energia: 7',
  $exp$Declarar é criar; atribuir é guardar:

`int energia;` — declara um espaço para número inteiro
`energia = 7;` — guarda 7 lá dentro

Ou tudo de uma vez: `int energia = 7;`

Para imprimir o valor, o `%d` marca o lugar do inteiro:

`printf("energia: %d\n", energia);`$exp$,
  $code$#include <stdio.h>

int main() {
    // reserve a memória e imprima:

    return 0;
}$code$,
  $sol$#include <stdio.h>

int main() {
    int energia = 7;
    printf("energia: %d\n", energia);
    return 0;
}$sol$,
  '[{"input":"","expected_output":"energia: 7","label":"célula preenchida"}]'::jsonb,
  '[{"content":"Para declarar: tipo + nome. Para inteiro, o tipo é int: int energia;"},
    {"content":"Guardando direto: int energia = 7; — o = guarda o valor, não é comparação."},
    {"content":"No printf, %d é o marcador do valor: printf(\"energia: %d\\n\", energia);"}]'::jsonb,
  100, ARRAY['int', 'declaracao', 'atribuicao', 'printf %d'],
  1, true
FROM public.worlds w
WHERE w.slug = 'mundo-1-variaveis'
ON CONFLICT (slug) DO NOTHING;

-- ---------- MISSÃO 2: painel-de-telemetria ----------

INSERT INTO public.missions (
  world_id, slug, title, activity, difficulty,
  context_text, objective_text, explanation_md,
  initial_code, solution_code, tests, hints,
  xp_reward, concepts, sort_order, is_active
)
SELECT
  w.id, 'painel-de-telemetria', 'Painel de Telemetria', 'mission', 'easy',
  $ctx$📡 **VALORES QUEBRA-HEADÇOS**

Os sensores voltaram com números quebrados: 72.5 graus, 0.42 volts. Números inteiros não servem — `int` não guarda casas decimais.

Para isso existe o `float` (e o `double`, com o dobro de precisão). O marcador dele no printf é `%f`.$ctx$,
  'Guarde 72.5 na variavel temperatura e 0.42 em tensao (float). Imprima:
temperatura: 72.50
tensao: 0.42',
  $exp$`float temperatura = 72.5;`

No printf, `%f` imprime com 6 casas decimais por padrão. Para controlar as casas:

`%.2f` — duas casas: 72.50
`%.1f` — uma casa: 72.5$exp$,
  $code$#include <stdio.h>

int main() {
    // guardando decimais:

    return 0;
}$code$,
  $sol$#include <stdio.h>

int main() {
    float temperatura = 72.5f;
    float tensao = 0.42f;
    printf("temperatura: %.2f\n", temperatura);
    printf("tensao: %.2f\n", tensao);
    return 0;
}$sol$,
  '[{"input":"","expected_output":"temperatura: 72.50\ntensao: 0.42","label":"telemetria precisa"}]'::jsonb,
  '[{"content":"O tipo float guarda decimais: float temperatura = 72.5; — o f no fim (72.5f) é opcional."},
    {"content":"%f imprime o valor; %.2f limita a duas casas decimais."},
    {"content":"printf(\"temperatura: %.2f\\n\", temperatura); e depois o mesmo p/ tensao."}]'::jsonb,
  100, ARRAY['float', 'printf %f'],
  2, true
FROM public.worlds w
WHERE w.slug = 'mundo-1-variaveis'
ON CONFLICT (slug) DO NOTHING;

-- ---------- MISSÃO 3: identificador (char) ----------

INSERT INTO public.missions (
  world_id, slug, title, activity, difficulty,
  context_text, objective_text, explanation_md,
  initial_code, solution_code, tests, hints,
  xp_reward, concepts, sort_order, is_active
)
SELECT
  w.id, 'identificador', 'Identificador da Unidade', 'mission', 'easy',
  $ctx$🔤 **UM CARACTERE SOZINHO**

Cada unidade do sistema tem um código: uma única letra. `A` do módulo A, `B` do backup, `X` quando algo é desconhecido.

Textos inteiros são outro assunto — mas UM caractere tem tipo próprio: `char`. Guarda exatamente uma letra, entre aspas simples.$ctx$,
  'Guarde a letra A na variavel unidade (char) e o numero 3 em versao (int). Imprima:
unidade: A
versao: 3',
  $exp$`char unidade = 'A';` — note: **aspas simples** para char,
aspas duplas são para strings.

No printf, o marcador de char é `%c`:

`printf("unidade: %c\n", unidade);`$exp$,
  $code$#include <stdio.h>

int main() {
    // um caractere e um inteiro:

    return 0;
}$code$,
  $sol$#include <stdio.h>

int main() {
    char unidade = 'A';
    int versao = 3;
    printf("unidade: %c\n", unidade);
    printf("versao: %d\n", versao);
    return 0;
}$sol$,
  '[{"input":"","expected_output":"unidade: A\nversao: 3","label":"identificação completa"}]'::jsonb,
  '[{"content":"char guarda UM caractere, entre aspas simples: char unidade = ''A'';"},
    {"content":"O marcador de char no printf é %c (d é para int, c é para char)."},
    {"content":"printf(\"unidade: %c\\n\", unidade); depois printf(\"versao: %d\\n\", versao);"}]'::jsonb,
  100, ARRAY['char', 'printf %c'],
  3, true
FROM public.worlds w
WHERE w.slug = 'mundo-1-variaveis'
ON CONFLICT (slug) DO NOTHING;

-- ---------- MISSÃO 4: recalcular-rotas ----------

INSERT INTO public.missions (
  world_id, slug, title, activity, difficulty,
  context_text, objective_text, explanation_md,
  initial_code, solution_code, tests, hints,
  xp_reward, concepts, sort_order, is_active
)
SELECT
  w.id, 'recalcular-rotas', 'Recalcular Rotas', 'mission', 'easy',
  $ctx$🔄 **VARIÁVEIS MUDAM**

O nome "variável" já entrega: o valor pode **variar**. Uma rota calculada agora pode ser recalculada depois — a mesma gaveta da memória recebe um valor novo.

O valor antigo é perdido. A última atribuição vence.$ctx$,
  'A variavel salto comeca com 4, depois recebe 12, depois recebe 25. Imprima o valor FINAL:
salto final: 25',
  $exp$Atribuir de novo substitui o valor anterior:

`int salto = 4;`
`salto = 12;` — o 4 se foi
`salto = 25;` — o 12 se foi

E cuidado: para SOMAR ao valor atual, é `salto = salto + 10;` —
a gaveta recebe o próprio conteúdo mais 10.$exp$,
  $code$#include <stdio.h>

int main() {
    int salto = 4;
    // mude o valor duas vezes:

    printf("salto final: %d\n", salto);
    return 0;
}$code$,
  $sol$#include <stdio.h>

int main() {
    int salto = 4;
    salto = 12;
    salto = 25;
    printf("salto final: %d\n", salto);
    return 0;
}$sol$,
  '[{"input":"","expected_output":"salto final: 25","label":"última atribuição vence"}]'::jsonb,
  '[{"content":"Basta atribuir de novo, sem repetir o tipo: salto = 12; — a linha do int só aparece na primeira vez."},
    {"content":"Cada nova atribuição apaga o valor anterior. No fim, só o último importa."},
    {"content":"Duas linhas: salto = 12; e depois salto = 25; antes do printf."}]'::jsonb,
  100, ARRAY['atribuicao'],
  4, true
FROM public.worlds w
WHERE w.slug = 'mundo-1-variaveis'
ON CONFLICT (slug) DO NOTHING;

-- ---------- DESAFIO: relatorio-de-carga ----------

INSERT INTO public.missions (
  world_id, slug, title, activity, difficulty,
  context_text, objective_text, explanation_md,
  initial_code, solution_code, tests, hints,
  xp_reward, concepts, sort_order, is_active
)
SELECT
  w.id, 'relatorio-de-carga', 'Relatório de Carga', 'challenge', 'medium',
  $ctx$🔵 **DESAFIO — A CARGA DA NAVE**

A nave tem 3 módulos com cargas diferentes: 12, 7 e 5 unidades. A central precisa do relatório de carga total e da carga média — mas desta vez, ninguém diz qual tipo usar, nem como combinar.

Pense: total é soma de inteiros... mas média pode quebrar em decimals.$ctx$,
  'Com cargas 12, 7 e 5, imprima exatamente:
carga total: 24
carga media: 8.00',
  NULL,
  $code$#include <stdio.h>

int main() {
    // três módulos: 12, 7 e 5

    return 0;
}$code$,
  $sol$#include <stdio.h>

int main() {
    int m1 = 12, m2 = 7, m3 = 5;
    int total = m1 + m2 + m3;
    float media = total / 3.0;
    printf("carga total: %d\n", total);
    printf("carga media: %.2f\n", media);
    return 0;
}$sol$,
  '[{"input":"","expected_output":"carga total: 24\ncarga media: 8.00","label":"relatório de carga"}]'::jsonb,
  '[{"content":"Guarde as três cargas em três variáveis int — e calcule o total antes de imprimir."},
    {"content":"Média = total dividido pela quantidade. Atenção: 24/3 em C com inteiros dá 8 (serve!), mas dividir por 3.0 garante decimal."},
    {"content":"printf(\"carga total: %d\\n\", total); e printf(\"carga media: %.2f\\n\", media); — media precisa vir de float ou de total/3.0."}]'::jsonb,
  150, ARRAY['int', 'float', 'printf'],
  5, true
FROM public.worlds w
WHERE w.slug = 'mundo-1-variaveis'
ON CONFLICT (slug) DO NOTHING;

-- ---------- 👾 BOSS: firmware-do-reator ----------

INSERT INTO public.missions (
  world_id, slug, title, activity, difficulty,
  context_text, objective_text, explanation_md,
  initial_code, solution_code, tests, hints,
  xp_reward, concepts, sort_order, is_active
)
SELECT
  w.id, 'firmware-do-reator', '👾 BOSS — Firmware do Reator', 'boss', 'hard',
  $ctx$👾 **BOSS DO MUNDO 1**

O reator central precisa do firmware completo de monitoramento — e você vai escrevê-lo do zero. Nada de código inicial útil, nada de manual: só a especificação da saída.

Inteiros, decimais, caracteres, atribuições... tudo o que você aprendeu neste mundo, misturado. Uma unidade errada e o reator desliga.$ctx$,
  'Escreva o firmware completo:
- reactor com nome R (char)
- temperatura 1024 (int) que depois vira 999
- pressao 88.5 (float)
Imprima:
REACTOR R ONLINE
temperatura: 999
pressao: 88.50',
  NULL,
  $code$#include <stdio.h>

int main() {
    // firmware do reator — do zero

    return 0;
}$code$,
  $sol$#include <stdio.h>

int main() {
    char nome = 'R';
    int temperatura = 1024;
    temperatura = 999;
    float pressao = 88.5f;
    printf("REACTOR %c ONLINE\n", nome);
    printf("temperatura: %d\n", temperatura);
    printf("pressao: %.2f\n", pressao);
    return 0;
}$sol$,
  '[{"input":"","expected_output":"REACTOR R ONLINE\ntemperatura: 999\npressao: 88.50","label":"reator estável"}]'::jsonb,
  '[{"content":"Três variáveis: char para a letra, int para temperatura, float para pressão. Declare as três primeiro."},
    {"content":"A temperatura MUDA no meio do caminho: atribua 1024 e depois 999 — o printf só vê o último."},
    {"content":"Linha 1: printf(\"REACTOR %c ONLINE\\n\", nome); — %c para char. Depois %d p/ temperatura e %.2f p/ pressão (duas casas)."}]'::jsonb,
  300, ARRAY['char', 'int', 'float', 'atribuicao', 'printf'],
  6, true
FROM public.worlds w
WHERE w.slug = 'mundo-1-variaveis'
ON CONFLICT (slug) DO NOTHING;

-- ---------- CONFERINDO ----------

SELECT w.number AS mundo, m.slug, m.title, m.activity, m.xp_reward, m.sort_order
FROM public.missions m
JOIN public.worlds w ON w.id = m.world_id
WHERE w.slug = 'mundo-1-variaveis'
ORDER BY m.sort_order;
