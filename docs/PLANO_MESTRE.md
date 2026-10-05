# Projeto — Plano Mestre

> **Nome provisório:** CodeQuest C (a definir)
> **Objetivo inicial:** criar uma plataforma pessoal e gamificada para aprender e praticar programação.
> **Objetivo futuro:** caso o projeto se prove útil e divertido, transformá-lo em um produto comercial.

---

# 1. Visão do projeto

O projeto será uma **plataforma web gamificada de aprendizagem de programação**, começando pela linguagem **C**.

O objetivo não é simplesmente ensinar sintaxe.

O objetivo é fazer o usuário **programar de verdade**, resolver problemas, cometer erros, entender esses erros e perceber sua própria evolução.

A experiência deve combinar:

- aprendizado;
- prática;
- desafios;
- resolução de problemas;
- execução real de código;
- progressão;
- XP;
- níveis;
- conquistas;
- revisão;
- desafios;
- projetos;
- feedback inteligente.

A arquitetura deve permitir futuramente adicionar novas linguagens sem precisar reconstruir o sistema.

A primeira prioridade, entretanto, é **uso pessoal**. O projeto deve servir como ferramenta de estudo para o próprio criador, especialmente para melhorar seu desempenho acadêmico e suas habilidades práticas de programação.

A possibilidade de comercialização deve ser tratada como uma **evolução futura**, não como requisito da primeira versão.

---

# 2. Filosofia principal

## O projeto não deve parecer um curso.

Ele deve parecer um **jogo no qual programar é a maneira de avançar**.

Evitar uma experiência baseada apenas em:

> "Leia isso → responda isso → faça esse exercício → próximo."

Em vez disso:

> **Aprenda → tente → erre → descubra → corrija → domine → avance.**

O usuário deve sentir que está **resolvendo problemas**, e não preenchendo uma lista de exercícios.

---

# 3. Princípios fundamentais

## 3.1 Conteúdo é dado, não código

Toda missão deve ser armazenada no banco de dados:

- título;
- contexto;
- enunciado;
- código inicial;
- testes;
- dicas;
- solução de referência;
- dificuldade;
- conceitos envolvidos;
- XP;
- etc.

Adicionar uma missão não deve exigir alteração no frontend.

## 3.2 Linguagem é um plugin

O sistema deve possuir uma abstração:

**CodeRunner**

A primeira implementação será:

**CRunner**

Posteriormente:

- PythonRunner
- JavaScriptRunner
- etc.

O restante da aplicação não deve precisar saber como cada linguagem é executada.

## 3.3 Separação de responsabilidades

A arquitetura deve seguir:

**Frontend**

↓

**Engine de aprendizagem**

↓

**Supabase / dados**

↓

**CodeRunner**

↓

**Executor de código**

Isso evita que a lógica de aprendizagem fique misturada com a interface.

---

# 4. Stack inicial

| Camada | Tecnologia |
|---|---|
| Frontend | React + TypeScript |
| UI | Tailwind CSS |
| Backend/Dados | Supabase |
| Banco | PostgreSQL |
| Autenticação | Supabase Auth |
| Segurança de dados | Row Level Security |
| Execução | API compatível com Judge0 |
| Hospedagem | Vercel |
| Futuro pagamento | Stripe |

---

# 5. A experiência de aprendizagem

Essa é a parte mais importante de todo o projeto.

## Uma missão não deve ser apenas um exercício.

Ela deve possuir **contexto**.

### Exemplo

Em vez de:

> Faça um programa utilizando `if` para verificar uma senha.

Usar:

> 🔐 **SISTEMA DE SEGURANÇA**
>
> O terminal recebeu uma tentativa de acesso.
>
> O sistema possui uma senha numérica.
>
> Você precisa programar a verificação para determinar se o acesso deve ser permitido.

O usuário aprende `if`, mas a experiência é:

**resolver um problema.**

---

# 6. Tipos de atividades

## 🟢 Missão

Ensina ou reforça um conceito.

Possui:

- contexto;
- explicação curta;
- código inicial;
- objetivo;
- testes;
- dicas.

## 🔵 Desafio

O sistema explica **o problema**, mas não diz diretamente como resolvê-lo.

Exemplo:

> Crie um sistema que classifique o nível de acesso de um usuário em visitante, funcionário ou administrador.

O usuário precisa decidir se utilizará:

- `if`;
- `else`;
- `switch`;
- operadores lógicos;
- etc.

Isso desenvolve **raciocínio de programação**, e não somente memorização.

## 🔴 Boss

Ao final de cada mundo haverá um desafio maior.

O boss mistura os conceitos aprendidos naquele mundo.

Exemplo:

### 👾 BOSS — Terminal de Segurança

Criar um sistema que:

- recebe usuário;
- recebe senha;
- permite tentativas;
- verifica acesso;
- bloqueia após determinado número de erros.

O usuário precisa descobrir quais conceitos utilizar.

## 🟣 Projeto

Depois de determinados mundos, o usuário recebe projetos maiores.

Exemplos:

- calculadora;
- sistema de caixa eletrônico;
- sistema de cadastro;
- sistema de notas;
- agenda;
- jogo simples;
- sistema de estoque.

Aqui a proposta muda de:

> "Use esse comando."

para:

> **"Construa isso."**

---

# 7. Sistema de dicas

Uma das mecânicas mais importantes.

Quando o usuário errar, **não entregar imediatamente a resposta**.

### Exemplo

**💡 Dica 1**

> Observe a linha onde o compilador encontrou o problema.

Se ainda precisar:

**💡 Dica 2**

> Existe alguma instrução incompleta?

Se ainda precisar:

**💡 Dica 3**

> Verifique se a instrução termina corretamente.

Somente depois:

**👁️ Ver solução**

---

# 8. Sistema de erros inteligente

O executor não deve simplesmente mostrar o erro cru do compilador.

O sistema deve tentar transformar:

> erro técnico

em:

> explicação compreensível.

Exemplo:

**Compilador:**

> expected ';' before 'return'

**Sistema:**

> 🔎 Parece que uma instrução antes do `return` não foi finalizada.
>
> Verifique a linha anterior e procure algo que esteja faltando.

---

# 9. Loop principal

Cada missão seguirá aproximadamente:

**Contexto**

↓

**Objetivo**

↓

**Código inicial**

↓

**Editor**

↓

**Executar**

↓

**Resultado**

↓

**Testes automáticos**

↓

### Se acertou:

🎉 Sucesso
XP
progresso
domínio
possível conquista

### Se errou:

❌ erro
explicação
possível dica
nova tentativa

↓

**Próxima missão**

Esse é o coração do projeto.

---

# 10. XP e progressão

XP não deve servir apenas para mostrar um número.

Ele deve representar **progresso real**.

Exemplo:

### Missão

**+100 XP**

### Bônus

**+20 XP** — sem utilizar dicas
**+10 XP** — solução eficiente
**+5 XP** — resolveu após dica

Não punir excessivamente o usuário por errar.

**Errar faz parte do aprendizado.**

---

# 11. Sistema de domínio

Além do XP geral, o sistema deve acompanhar a familiaridade do usuário com cada conceito.

Exemplo:

### 🧠 Seu domínio

**Variáveis**

██████████ 100%

**Condicionais**

████████░░ 80%

**Loops**

█████░░░░░ 50%

**Funções**

██░░░░░░░░ 20%

**Ponteiros**

🔒 Bloqueado

Isso permite que o usuário saiba **onde realmente precisa melhorar**.

---

# 12. Revisão inteligente

O sistema deve registrar:

- erros;
- tentativas;
- conceitos envolvidos;
- uso de dicas;
- tempo aproximado;
- desempenho.

Se o usuário estiver errando frequentemente determinado conceito:

> ⚠️ Você está apresentando dificuldade em operadores lógicos.

Posteriormente:

> 🔄 **Revisão rápida**
>
> Você consegue resolver esse problema?

A revisão espaçada faz parte do **motor de aprendizagem**.

---

# 13. Mapa de progressão

A estrutura será dividida em mundos.

Porém, evitar bloquear o usuário de forma excessivamente rígida.

Exemplo:

### Mundo 1 — Variáveis

🟢 8 missões principais
🔵 3 desafios opcionais
🟣 1 desafio avançado
👾 Boss

O usuário pode precisar concluir, por exemplo:

**6/8 + Boss**

para avançar.

Isso evita obrigar alguém que já domina determinado conceito a repetir exercícios extremamente fáceis.

---

# 14. Mundos de C

A estrutura será mantida como base:

### 🌎 Mundo 0 — Primeiros Passos

- `main()`
- `printf`
- compilação
- execução
- comentários

### 🌎 Mundo 1 — Variáveis

- `int`
- `float`
- `double`
- `char`
- declaração
- atribuição

### 🌎 Mundo 2 — Operadores

- aritméticos
- relacionais
- lógicos

### 🌎 Mundo 3 — Entrada de dados

- `scanf`
- tipos de entrada
- conversões necessárias

### 🌎 Mundo 4 — Condicionais

- `if`
- `else`
- `else if`
- `switch`

### 🌎 Mundo 5 — Laços

- `for`
- `while`
- `do while`

### 🌎 Mundo 6 — Funções

- declaração
- parâmetros
- retorno
- escopo

### 🌎 Mundo 7 — Vetores

- arrays
- percorrer
- manipular

### 🌎 Mundo 8 — Strings

- `char[]`
- funções de string

### 🌎 Mundo 9 — Matrizes

- arrays bidimensionais

### 🌎 Mundo 10 — Ponteiros

- conceito
- `*`
- `&`
- ponteiros e funções

### 🌎 Mundo 11 — Structs

- declaração
- utilização
- vetor de structs

### 🌎 Mundo 12 — Memória dinâmica

- `malloc`
- `free`
- cuidados com memória

### 🌎 Mundo 13 — Arquivos

- leitura
- escrita
- arquivos simples

### 🏆 Mundo 14 — Projeto Final

Projeto guiado de maior escala.

---

# 15. Laboratório 🧪

Uma área extremamente importante.

O usuário poderá abrir um editor vazio:

> `main.c`

e simplesmente programar.

Sem:

- XP;
- missão;
- testes obrigatórios;
- punição;
- objetivo.

É o lugar para:

> "Quero testar uma coisa."

O laboratório transforma a plataforma também em um **ambiente de experimentação**.

---

# 16. Modo sobrevivência ☠️

Modo opcional.

O sistema gera desafios aleatórios.

O usuário começa com:

❤️ ❤️ ❤️

Cada erro remove uma vida.

Os desafios ficam progressivamente mais difíceis.

Objetivo:

> sobreviver ao maior número possível de desafios.

Não precisa existir no MVP, mas pode se tornar uma das partes mais divertidas posteriormente.

---

# 17. Gamificação

Manter:

- XP;
- níveis;
- streak;
- badges;
- bosses;
- mapa;
- progresso.

Mas evitar transformar tudo em "número por número".

A gamificação deve **reforçar o aprendizado**, não substituir o aprendizado.

---

# 18. Visual

Direção:

**editor de código + terminal + game interface moderna.**

Evitar:

- mascote infantil;
- excesso de animações;
- interface "fofinha";
- excesso de cores;
- gamificação infantilizada.

Priorizar:

- código;
- progresso;
- desafios;
- sensação de evolução;
- feedback visual;
- interface limpa.

---

# 19. Banco de dados

Manter as entidades principais:

- `profiles`
- `languages`
- `worlds`
- `missions`
- `user_progress`
- `badges`
- `user_badges`
- `subscriptions`

Futuramente acrescentar estruturas para:

- domínio por conceito;
- histórico de tentativas;
- erros;
- dicas utilizadas;
- revisão espaçada;
- estatísticas.

Isso permitirá construir o **treinador adaptativo**.

---

# 20. Segurança

Como o sistema executará código fornecido pelo usuário, o executor deve ser tratado como **ambiente não confiável**.

Nunca executar código arbitrário diretamente no servidor principal.

Deve existir:

- sandbox;
- limite de CPU;
- limite de memória;
- limite de tempo;
- limite de saída;
- isolamento;
- controle de processos;
- proteção contra abuso.

Essa parte é obrigatória antes de colocar o projeto publicamente na internet.

---

# 21. Monetização — FUTURO

**Não implementar agora.**

Durante a fase inicial:

> **zero preocupação com Stripe, anúncios ou assinatura.**

Primeiro o projeto precisa provar:

### 1.
**Eu gosto de usar isso?**

### 2.
**Isso realmente melhora minha programação?**

### 3.
**Consigo estudar por bastante tempo sem achar chato?**

### 4.
**Outra pessoa conseguiria aprender com isso?**

Só depois pensar em:

**Free**

vs.

**Premium**

---

# 22. Futuro comercial

Se o projeto se provar realmente bom:

- autenticação completa;
- planos;
- Stripe;
- estatísticas;
- painel administrativo;
- analytics;
- novos mundos;
- novas linguagens;
- conteúdo premium;
- conteúdo antecipado;
- eventualmente aplicativo mobile.

Isso será uma **segunda vida do projeto**.

---

# 23. Painel administrativo

Quando houver muitas missões:

> **Admin → Criar missão**

Campos:

- título;
- mundo;
- dificuldade;
- contexto;
- enunciado;
- código inicial;
- testes;
- dicas;
- solução;
- XP;
- conceitos.

Assim novas missões poderão ser adicionadas sem alterar o código da aplicação.

---

# 24. Roadmap

## 🟩 FASE 1 — Fundação

- React + TypeScript
- Tailwind
- Supabase
- banco
- autenticação básica
- arquitetura inicial

## 🟩 FASE 2 — CodeRunner

Criar:

`CodeRunner`

↓

`CRunner`

↓

executor externo

Testar execução real de C.

## 🟩 FASE 3 — Primeira missão

Construir o loop:

**enunciado → código → executar → testes → feedback**

Sem XP complexo ainda.

## 🟩 FASE 4 — Primeiro mundo

Criar:

**Mundo 0**

com missões reais.

## 🟩 FASE 5 — Gamificação

Adicionar:

- XP;
- nível;
- progresso;
- streak;
- corações.

## 🟩 FASE 6 — Mundo 1

Variáveis.

Aqui já teremos:

> **um pequeno produto jogável.**

## 🟩 FASE 7 — Mapa

Criar o mapa de mundos e progressão.

## 🟩 FASE 8 — Dicas + erros inteligentes

Sistema progressivo de ajuda.

## 🟩 FASE 9 — Domínio

Implementar:

- domínio por conceito;
- histórico de erros;
- estatísticas.

## 🟩 FASE 10 — Revisão

Implementar revisão espaçada e desafios baseados nos erros do usuário.

## 🟩 FASE 11 — Bosses e projetos

Expandir a experiência para realmente parecer um jogo.

## 🟩 FASE 12 — Mundos 2–6

Expandir fundamentos de C.

## 🟩 FASE 13 — Mundos avançados

7–14.

## 🟩 FASE 14 — Laboratório

Sandbox aberta.

## 🟩 FASE 15 — Modo sobrevivência

Feature opcional.

## 🟨 FASE 16 — Admin

Sistema para criar e editar missões.

## 🟨 FASE 17 — Segunda linguagem

Prova de conceito:

**Python**

sem alterar a arquitetura principal.

## 🟦 FASE 18 — Polimento

UX, acessibilidade, desempenho, segurança e testes.

## 🟪 FASE 19 — Produto

**Somente se fizer sentido.**

- Stripe;
- planos;
- anúncios;
- analytics;
- premium;
- conteúdo antecipado;
- etc.

---

# 25. Regra de ouro para a IA de desenvolvimento

> **NÃO desenvolver o projeto inteiro de uma vez.**
>
> Implementar uma fase por vez.
>
> Ao terminar uma fase:
>
> 1. executar o projeto;
> 2. testar as funcionalidades;
> 3. corrigir erros;
> 4. validar a arquitetura;
> 5. somente então iniciar a próxima fase.
>
> Não implementar funcionalidades futuras antecipadamente apenas porque elas estão descritas no documento.
>
> A prioridade absoluta é fazer o **loop de aprendizagem funcionar de ponta a ponta**.
>
> O sistema deve ser útil para uma única pessoa antes de tentar ser útil para milhares.

---

# 26. Filosofia definitiva

> ### **"Não quero criar um aplicativo que ensina programação. Quero criar um aplicativo que faça alguém querer programar."**

O objetivo é criar uma ferramenta que o próprio criador realmente queira usar para estudar.

Se uma missão estiver chata, ela deve ser melhorada.

Se estiver fácil demais, deve ser ajustada.

Se uma explicação não ajudar, deve ser reescrita.

Se um desafio for bom, deve servir de referência para os próximos.

O projeto deve evoluir junto com o usuário.

---

# 27. Princípio final

**Primeiro: aprender.**

**Depois: construir.**

**Depois: validar.**

**Somente então: comercializar.**

O sucesso inicial do projeto não será medido por número de usuários ou faturamento.

Será medido por uma pergunta simples:

> **"Eu estou ficando melhor programando porque uso isso?"**
