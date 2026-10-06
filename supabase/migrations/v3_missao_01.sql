-- ============================================================
-- CodeQuest C — Migration V3: Missão 01 do Mundo 0
-- Rodar no Supabase SQL Editor. Idempotente: pode rodar 2x.
-- ============================================================

INSERT INTO public.missions (
  world_id, slug, title, activity, difficulty,
  context_text, objective_text, explanation_md,
  initial_code, solution_code, tests, hints,
  xp_reward, concepts, sort_order, is_active
)
SELECT
  w.id,
  'sinal-de-vida',
  'Sinal de Vida',
  'mission',
  'easy',
  -- contexto imersivo (§5): problema, não exercício
  $ctx$🖥️ **O TERMINAL DESPERTA**

Você acaba de ligar o sistema. A tela está escura, em silêncio total — nenhuma resposta ainda.

Todo sistema vivo começa enviando um sinal de vida ao terminal: uma mensagem provando que está funcionando.

Em C, quem fala com o terminal é a função `printf`.$ctx$,
  'Faça o programa imprimir exatamente a mensagem: olá, terminal',
  $exp$No C, quem imprime no terminal é a função `printf`.

Ela recebe o texto entre aspas, dentro dos parênteses:

`printf("texto");`

- O `\n` pula uma linha no final da mensagem
- Toda instrução em C termina com ponto e vírgula `;`$exp$,
  -- código inicial
  $code$#include <stdio.h>

int main() {
    // faça o terminal responder:

    return 0;
}$code$,
  -- solução de referência
  $sol$#include <stdio.h>

int main() {
    printf("olá, terminal\n");
    return 0;
}$sol$,
  -- testes: roda o programa e compara a saída
  '[{"input":"","expected_output":"olá, terminal","label":"sinal de vida"}]'::jsonb,
  -- dicas progressivas (§7): guiam sem entregar
  '[{"content":"A função que imprime no terminal chama-se `printf`. Tudo que ela deve imprimir fica entre aspas duplas, dentro dos parênteses."},
    {"content":"Em C, toda instrução termina com ponto e vírgula. A estrutura é: printf(\"...\");"},
    {"content":"Para a mensagem sair com quebra de linha, coloque \\n no fim do texto: printf(\"olá, terminal\\n\");"}]'::jsonb,
  100,
  ARRAY['printf', 'main'],
  1,
  true
FROM public.worlds w
WHERE w.slug = 'mundo-0-primeiros-passos'
ON CONFLICT (slug) DO NOTHING;

-- ---------- CONFERINDO ----------

SELECT slug, title, difficulty, xp_reward, jsonb_array_length(tests) AS n_testes
FROM public.missions
WHERE slug = 'sinal-de-vida';
