-- ============================================================
-- CodeQuest C — Migration V4: Mundo 0 completo
-- 6 missões novas (4 missões + 1 desafio + 1 BOSS) + requisitos
-- Rodar no Supabase SQL Editor. Idempotente: pode rodar 2x.
-- ============================================================

-- ---------- requisitos do mundo 0 (§13: X missões + boss) ----------

UPDATE public.worlds
SET required_missions = 4, required_boss = true
WHERE slug = 'mundo-0-primeiros-passos';

-- ---------- MISSÃO 2: painel-de-status ----------

INSERT INTO public.missions (
  world_id, slug, title, activity, difficulty,
  context_text, objective_text, explanation_md,
  initial_code, solution_code, tests, hints,
  xp_reward, concepts, sort_order, is_active
)
SELECT
  w.id, 'painel-de-status', 'Painel de Status', 'mission', 'easy',
  $ctx$🖥️ **O TERMINAL RESPONDEU**

O sinal de vida funcionou — o sistema está ativo. Agora a central precisa ver o painel de status: várias informações, cada uma em sua própria linha.

Em C, uma instrução `printf` imprime uma linha de texto por vez — ou várias, se você usar o caractere especial `\n`.$ctx$,
  'Faça o programa imprimir o painel completo, exatamente assim (3 linhas):
sistema: codequest
status: online
uptime: 0 dias',
  $exp$Para pular de linha dentro de um texto, use `\n` dentro das aspas:

`printf("linha 1\nlinha 2\n");`

Você pode usar um `printf` por linha — ou um único `printf` com vários `\n`.$exp$,
  $code$#include <stdio.h>

int main() {
    // imprima o painel de status (3 linhas):

    return 0;
}$code$,
  $sol$#include <stdio.h>

int main() {
    printf("sistema: codequest\n");
    printf("status: online\n");
    printf("uptime: 0 dias\n");
    return 0;
}$sol$,
  '[{"input":"","expected_output":"sistema: codequest\nstatus: online\nuptime: 0 dias","label":"painel completo"}]'::jsonb,
  '[{"content":"Cada linha do painel pode ser um printf separado. Uma chamada por linha deixa o código claro."},
    {"content":"O \\n no fim do texto pula para a linha seguinte. Sem ele, tudo sai amontado na mesma linha."},
    {"content":"São três printf, cada um terminando com \\n: printf(\"sistema: codequest\\n\"); e assim por diante."}]'::jsonb,
  100, ARRAY['printf', 'escape'],
  2, true
FROM public.worlds w
WHERE w.slug = 'mundo-0-primeiros-passos'
ON CONFLICT (slug) DO NOTHING;

-- ---------- MISSÃO 3: manual-do-operador (comentários) ----------

INSERT INTO public.missions (
  world_id, slug, title, activity, difficulty,
  context_text, objective_text, explanation_md,
  initial_code, solution_code, tests, hints,
  xp_reward, concepts, sort_order, is_active
)
SELECT
  w.id, 'manual-do-operador', 'Manual do Operador', 'mission', 'easy',
  $ctx$📘 **CÓDIGO ESQUECIDO**

Seis meses se passaram. O sistema ainda roda — mas ninguém lembra o que aquele código faz. Códigos sem explicação viram mistério: qualquer manutenção vira arriscada.

Todo profissional documenta o que escreve. Em C, isso se faz com **comentários**.$ctx$,
  'Adicione comentários explicando o que cada printf faz, sem mudar a saída do programa.',
  $exp$Comentários são ignorados pelo compilador — existem para humanos.

`// comenta até o fim da linha`

`/* comenta um bloco inteiro */`

Bom código explica o PORQUÊ, não apenas o quê.$exp$,
  $code$#include <stdio.h>

int main() {
    printf("inicializando...\n");
    printf("pronto.\n");
    return 0;
}$code$,
  $sol$#include <stdio.h>

int main() {
    // mensagem de boot: avisa que o sistema está subindo
    printf("inicializando...\n");
    // sinal de que o boot terminou com sucesso
    printf("pronto.\n");
    return 0;
}$sol$,
  '[{"input":"","expected_output":"inicializando...\npronto.","label":"saída intacta"}]'::jsonb,
  '[{"content":"Comentários em C começam com // e o compilador simplesmente ignora o resto da linha."},
    {"content":"Escreva // antes do printf ou no fim da linha — qualquer posição funciona, contanto que esteja depois do código da linha."},
    {"content":"Exemplo: printf(\"pronto.\\n\"); // sinaliza fim do boot — o comentário não aparece na saída."}]'::jsonb,
  100, ARRAY['comentarios'],
  3, true
FROM public.worlds w
WHERE w.slug = 'mundo-0-primeiros-passos'
ON CONFLICT (slug) DO NOTHING;

-- ---------- MISSÃO 4: sequencia-de-inicializacao ----------

INSERT INTO public.missions (
  world_id, slug, title, activity, difficulty,
  context_text, objective_text, explanation_md,
  initial_code, solution_code, tests, hints,
  xp_reward, concepts, sort_order, is_active
)
SELECT
  w.id, 'sequencia-de-inicializacao', 'Sequência de Inicialização', 'mission', 'easy',
  $ctx$⚙️ **LOG EMBARALHADO**

Uma falha corrompeu o log de boot: as mensagens foram gravadas fora de ordem. O hardware é incapaz de mentir — ele executa as instruções **na ordem em que aparecem**, de cima para baixo, uma por uma.

Restaure a sequência correta de inicialização.$ctx$,
  'Reorganize os printfs para que o programa imprima a sequência correta:
passo 1: memoria
passo 2: processador
passo 3: terminal',
  $exp$Dentro do `main`, C executa linha por linha, de cima para baixo.

A ordem em que as instruções aparecem no código é a ordem em que rodam.$exp$,
  $code$#include <stdio.h>

int main() {
    // as linhas abaixo estão fora de ordem — conserte:

    printf("passo 3: terminal\n");
    printf("passo 1: memoria\n");
    printf("passo 2: processador\n");

    return 0;
}$code$,
  $sol$#include <stdio.h>

int main() {
    printf("passo 1: memoria\n");
    printf("passo 2: processador\n");
    printf("passo 3: terminal\n");
    return 0;
}$sol$,
  '[{"input":"","expected_output":"passo 1: memoria\npasso 2: processador\npasso 3: terminal","label":"boot em ordem"}]'::jsonb,
  '[{"content":"O C executa as instruções de cima para baixo. A primeira linha do código é a primeira a rodar."},
    {"content":"Não é preciso mudar o texto dos printfs — mova as linhas inteiras de lugar."},
    {"content":"Corte cada printf e cole na posição certa: passo 1 primeiro, depois passo 2, depois passo 3."}]'::jsonb,
  100, ARRAY['main', 'ordem de execução'],
  4, true
FROM public.worlds w
WHERE w.slug = 'mundo-0-primeiros-passos'
ON CONFLICT (slug) DO NOTHING;

-- ---------- MISSÃO 5: caracteres-de-controle ----------

INSERT INTO public.missions (
  world_id, slug, title, activity, difficulty,
  context_text, objective_text, explanation_md,
  initial_code, solution_code, tests, hints,
  xp_reward, concepts, sort_order, is_active
)
SELECT
  w.id, 'caracteres-de-controle', 'Caracteres de Controle', 'mission', 'easy',
  $ctx$🎛️ **PAINEL AVANÇADO**

O painel de status básico agradou, mas a central quer algo mais legível: colunas alinhadas. E há um problema — o texto precisa conter aspas, e aspas fecham strings.

O terminal tem comandos especiais para isso: `\t` alinha em colunas, `\"` imprime aspas de verdade.$ctx$,
  'Imprima o painel avançado exatamente assim (com tabulações e aspas):
sistema	→ Em C:
sistema<TAB>codequest
versao<TAB>1.0
alerta: "sistema ok"',
  $exp$Dentro de uma string, alguns caracteres têm superpoderes:

- `\n` — pula linha
- `\t` — tabulação (alinha colunas)
- `\"` — imprime aspas sem fechar a string$exp$,
  $code$#include <stdio.h>

int main() {
    // monte o painel avançado com \t e \"

    return 0;
}$code$,
  $sol$#include <stdio.h>

int main() {
    printf("sistema\tcodequest\n");
    printf("versao\t1.0\n");
    printf("alerta: \"sistema ok\"\n");
    return 0;
}$sol$,
  '[{"input":"","expected_output":"sistema\tcodequest\nversao\t1.0\nalerta: \"sistema ok\"","label":"painel alinhado"}]'::jsonb,
  '[{"content":"A tabulação é escrita \\t dentro das aspas: printf(\"coluna1\\tcoluna2\\n\");"},
    {"content":"Para imprimir aspas sem encerrar a string, use \\\": printf(\"alerta: \\\"ok\\\"\\n\");"},
    {"content":"Três printfs: sistema\\tcodequest / versao\\t1.0 / alerta: \\\"sistema ok\\\" — cada um com \\n no fim."}]'::jsonb,
  100, ARRAY['printf', 'escape'],
  5, true
FROM public.worlds w
WHERE w.slug = 'mundo-0-primeiros-passos'
ON CONFLICT (slug) DO NOTHING;

-- ---------- DESAFIO: relatorio-do-sistema ----------

INSERT INTO public.missions (
  world_id, slug, title, activity, difficulty,
  context_text, objective_text, explanation_md,
  initial_code, solution_code, tests, hints,
  xp_reward, concepts, sort_order, is_active
)
SELECT
  w.id, 'relatorio-do-sistema', 'Relatório do Sistema', 'challenge', 'medium',
  $ctx$🔵 **DESAIO — RELATÓRIO SEM MANUAL**

A central exige um relatório de diagnóstico, formato rígido — mas desta vez ninguém vai dizer COMO montá-lo. Nem quantos `printf`, nem onde usar `\n` ou `\t`.

Analise a saída exigida e descubra você mesmo o caminho. Essa é a diferença entre seguir receita e saber cozinhar.$ctx$,
  'Imprima o relatório EXATAMENTE assim:
RELATORIO
sistema:	codequest
status:		online
memoria:	64
fim.',
  NULL,
  $code$#include <stdio.h>

int main() {
    // você decide a estratégia

    return 0;
}$code$,
  $sol$#include <stdio.h>

int main() {
    printf("RELATORIO\n");
    printf("sistema:\tcodequest\n");
    printf("status:\tonline\n");
    printf("memoria:\t64\n");
    printf("fim.\n");
    return 0;
}$sol$,
  '[{"input":"","expected_output":"RELATORIO\nsistema:\tcodequest\nstatus:\tonline\nmemoria:\t64\nfim.","label":"relatório exato"}]'::jsonb,
  '[{"content":"Leia a saída esperada como um detetive: onde exatamente há quebra de linha e onde há tabulação?"},
    {"content":"Cada linha do relatório pode virar um printf separado — cinco no total."},
    {"content":"\"status:\" tem dois pontos e depois tab: printf(\"status:\\tonline\\n\"); — cuidado para não inverter a ordem."}]'::jsonb,
  150, ARRAY['printf', 'escape', 'main'],
  6, true
FROM public.worlds w
WHERE w.slug = 'mundo-0-primeiros-passos'
ON CONFLICT (slug) DO NOTHING;

-- ---------- 👾 BOSS: despertar-completo ----------

INSERT INTO public.missions (
  world_id, slug, title, activity, difficulty,
  context_text, objective_text, explanation_md,
  initial_code, solution_code, tests, hints,
  xp_reward, concepts, sort_order, is_active
)
SELECT
  w.id, 'despertar-completo', '👾 BOSS — Despertar Completo', 'boss', 'medium',
  $ctx$👾 **BOSS DO MUNDO 0**

O terminal testou você com sinais, painéis e relatórios. Agora exige a sequência completa de boot — impecável, sem uma vírgola fora do lugar.

Qualquer desvio na saída e o sistema reinicia do zero. Você tem tudo o que precisa: `printf`, quebras de linha, tabulações, aspas... e calma.

**Quando o terminal anunciar que o sistema despertou, o Mundo 0 é seu.**$ctx$,
  'Escreva o programa de boot completo que imprime:
codequest bios v1.0
verificando memoria... ok
verificando terminal... ok
sistema desperto.',
  NULL,
  $code$#include <stdio.h>

int main() {
    // o boot completo começa aqui

    return 0;
}$code$,
  $sol$#include <stdio.h>

int main() {
    // identificação do firmware
    printf("codequest bios v1.0\n");
    // checagens de hardware
    printf("verificando memoria... ok\n");
    printf("verificando terminal... ok\n");
    // sinal final
    printf("sistema desperto.\n");
    return 0;
}$sol$,
  '[{"input":"","expected_output":"codequest bios v1.0\nverificando memoria... ok\nverificando terminal... ok\nsistema desperto.","label":"boot impecável"}]'::jsonb,
  '[{"content":"Quatro linhas, quatro printfs. Comece pela primeira: a versão do firmware."},
    {"content":"As linhas de verificação têm reticências: \"verificando memoria... ok\" — três pontos, espaço, ok."},
    {"content":"A última linha é o momento da vitória: printf(\"sistema desperto.\\n\"); — ponto final depois de desperto."}]'::jsonb,
  300, ARRAY['printf', 'escape', 'comentarios', 'main'],
  7, true
FROM public.worlds w
WHERE w.slug = 'mundo-0-primeiros-passos'
ON CONFLICT (slug) DO NOTHING;

-- ---------- CONFERINDO ----------

SELECT slug, title, activity, difficulty, xp_reward,
       jsonb_array_length(tests) AS n_testes, sort_order
FROM public.missions
WHERE world_id = (SELECT id FROM public.worlds WHERE slug = 'mundo-0-primeiros-passos')
ORDER BY sort_order;
