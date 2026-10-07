-- ============================================================
-- CodeQuest C — Migration V7: Briefings (teoria leve)
-- Adiciona briefing_md em worlds e missions:
--   - worlds: "o que vem a seguir" (antes de entrar no mundo)
--   - missions: "o que você vai aprender" (antes da lição)
-- Idempotente: pode rodar 2x.
-- ============================================================

ALTER TABLE public.worlds
  ADD COLUMN IF NOT EXISTS briefing_md TEXT;

ALTER TABLE public.missions
  ADD COLUMN IF NOT EXISTS briefing_md TEXT;

-- ═══════════════ BRIEFINGS DOS MUNDOS ═══════════════

UPDATE public.worlds SET briefing_md = $bri$Voce esta prestes a aprender o basico absoluto de C: como um programa nasce, como ele fala com o terminal e como se organiza.

Em C, tudo comeca numa funcao chamada `main()` — e a porta de entrada do programa. O que voce escrever dentro dela e o que acontece quando o programa roda.

Para mostrar texto na tela, usamos `printf()`. E o caminho do seu codigo ate a tela e sempre o mesmo: escrever -> compilar (traduzir para linguagem de maquina) -> executar.

No fim deste mundo voce vai: escrever programas completos do zero, imprimir qualquer texto, organizar mensagens em varias linhas e documentar seu codigo como um profissional.$bri$
WHERE slug = 'mundo-0-primeiros-passos';

UPDATE public.worlds SET briefing_md = $bri$Aqui comeca o jogo de verdade: variaveis.

Variavel e um pedaco da memoria com um nome. Voce guarda um valor la e usa o nome depois — o computador lembra por voce.

Cada "gaveta" tem um TIPO, que define o que cabe nela:
- `int` — numeros inteiros (7, 42, -13)
- `float` — numeros quebrados (72.5, 0.42)
- `char` — UM caractere ('A')

E tem mais: o valor guardado pode MUDAR no meio do programa — por isso o nome "variavel".

No fim deste mundo voce vai: criar variaveis dos tres tipos, trocar valores ao vivo e imprimir tudo misturado.$bri$
WHERE slug = 'mundo-1-variaveis';

-- ═══════════════ BRIEFINGS DAS MISSOES — MUNDO 0 ═══════════════

UPDATE public.missions SET briefing_md = $bri$**printf** e a voz do seu programa. Tudo que voce quiser que apareca na tela passa por ela.

O texto vai entre aspas duplas, dentro dos parenteses — e toda instrucao em C termina com ponto e virgula `;`$bri$
WHERE slug = 'sinal-de-vida';

UPDATE public.missions SET briefing_md = $bri$O terminal nao entende "linha nova" sozinho — se voce imprimir dois textos, eles saem colados na mesma linha.

O caractere especial `\n` e o "Enter" do printf: ele pula para a proxima linha. Um por linha, ou varios num printf so — voce escolhe.$bri$
WHERE slug = 'painel-de-status';

UPDATE public.missions SET briefing_md = $bri$Comentario e texto que o compilador IGNORA por completo. Nao vira programa — existe so para humanos.

Serve para voce daqui a 6 meses (ou para quem ler seu codigo) entender o que aquilo faz. Em C: `//` para uma linha, `/* */` para blocos.$bri$
WHERE slug = 'manual-do-operador';

UPDATE public.missions SET briefing_md = $bri$C e uma lingua sequencial: as linhas rodam de cima para baixo, uma por vez, sem pular nada.

Se a ordem no papel esta errada, a saida tambem estara. O computador nunca "adivinha" — ele faz exatamente o que esta escrito, na ordem em que esta escrito.$bri$
WHERE slug = 'sequencia-de-inicializacao';

UPDATE public.missions SET briefing_md = $bri$Dentro de uma string, alguns caracteres tem superpoderes — sao os "caracteres de escape":

- `\n` pula linha
- `\t` da um TAB (alinha colunas)
- `\"` imprime aspas sem fechar a string

Eles comecam com barra invertida porque sozinhos teriam outro significado.$bri$
WHERE slug = 'caracteres-de-controle';

UPDATE public.missions SET briefing_md = $bri$Desafio: sem manual desta vez.

Tudo que voce precisa — printf, `\n`, `\t` — voce ja viu nas missoes anteriores. Analise a saida pedida, descubra a estrategia e construa. E assim que se aprende de verdade.$bri$
WHERE slug = 'relatorio-do-sistema';

UPDATE public.missions SET briefing_md = $bri$O BOSS mistura tudo do mundo: printf, quebras de linha, aspas, comentarios e ordem de execucao.

Respire fundo. Leia a saida pedida linha por linha e construa com calma. Voce ja sabe tudo o que precisa.$bri$
WHERE slug = 'despertar-completo';

-- ═══════════════ BRIEFINGS DAS MISSOES — MUNDO 1 ═══════════════

UPDATE public.missions SET briefing_md = $bri$Variavel = gaveta na memoria com um nome.

`int` guarda numeros INTEIROS (sem virgula): 7, 42, -13. Declara assim: `int energia = 7;`

No printf, o marcador `%d` significa "coloque aqui o valor desse inteiro".$bri$
WHERE slug = 'memoria-do-sistema';

UPDATE public.missions SET briefing_md = $bri$`int` nao aceita virgula. Para numeros quebrados existe o `float`.

O marcador dele no printf e `%f` — e com `%.2f` voce controla quantas casas decimais aparecem (duas, neste caso).$bri$
WHERE slug = 'painel-de-telemetria';

UPDATE public.missions SET briefing_md = $bri$`char` guarda UM unico caractere — uma letra, um digito, um simbolo.

Detalhe que pega muita gente: aspas SIMPLES para char ('A'); aspas duplas sao para texto completo. Marcador no printf: `%c`.$bri$
WHERE slug = 'identificador';

UPDATE public.missions SET briefing_md = $bri$O valor de uma variavel nao e eterno: atribuir de novo SUBSTITUI o anterior.

`salto = 25;` apaga o que estava la antes. A ultima atribuicao vence — e o printf so ve o valor atual.$bri$
WHERE slug = 'recalcular-rotas';

UPDATE public.missions SET briefing_md = $bri$Desafio: voce vai combinar `int` e `float` no mesmo programa.

Pista de ouro: divisao de inteiros em C DESCARTA as casas decimais. `24/3` da 8, mas `24/3.0` da 8.0. Cuidado com isso na media.$bri$
WHERE slug = 'relatorio-de-carga';

UPDATE public.missions SET briefing_md = $bri$O BOSS do mundo 1: `char` + `int` + `float` + atribuicao no meio do caminho, tudo num programa so.

Voce ja tem todas as pecas — e so montar. Leia a especificacao com calma, linha por linha.$bri$
WHERE slug = 'firmware-do-reator';

-- ---------- CONFERINDO ----------

SELECT 'worlds' AS tabela, count(*) AS com_briefing FROM public.worlds WHERE briefing_md IS NOT NULL
UNION ALL
SELECT 'missions', count(*) FROM public.missions WHERE briefing_md IS NOT NULL;
