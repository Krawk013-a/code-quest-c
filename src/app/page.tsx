const features = [
  {
    icon: "🟢",
    title: "Missões com contexto",
    text: "Não é lista de exercício: é um problema de verdade para você resolver.",
  },
  {
    icon: "⚡",
    title: "Execução real de código",
    text: "Seu C é compilado e executado de verdade, com testes automáticos.",
  },
  {
    icon: "💡",
    title: "Dicas progressivas",
    text: "Errou? O sistema te guia aos poucos — sem entregar a resposta de graça.",
  },
  {
    icon: "🧠",
    title: "Domínio por conceito",
    text: "Acompanhe sua evolução real em cada conceito de C.",
  },
  {
    icon: "👾",
    title: "Bosses e desafios",
    text: "No fim de cada mundo, misture tudo o que aprendeu num desafio maior.",
  },
  {
    icon: "🧪",
    title: "Laboratório aberto",
    text: "Quer testar uma ideia? Abra o main.c e programe sem pressão.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono">
      {/* terminal-style top bar */}
      <header className="border-b border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">$</span>
            <span className="text-sm tracking-wide">
              codequest<span className="text-zinc-500">--c</span>
            </span>
          </div>
          <div className="text-xs text-zinc-500 hidden sm:block">
            mundo 0 {'>'} aguardando inicialização...
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6">
        {/* hero */}
        <section className="py-20 sm:py-28">
          <p className="text-xs text-zinc-500 mb-4">
            <span className="text-emerald-400">enzo@codequest</span>:~/primeiros-passos$
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
            Aprenda C
            <br />
            <span className="text-emerald-400">programando de verdade.</span>
          </h1>
          <p className="mt-6 max-w-xl text-sm sm:text-base text-zinc-400 leading-relaxed">
            Não é um curso. É um jogo no qual programar é a maneira de avançar:
            aprenda, tente, erre, descubra, corrija, domine.
          </p>

          {/* fake terminal window */}
          <div className="mt-10 rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <span className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="ml-3 text-xs text-zinc-500">main.c — mundo 0</span>
            </div>
            <pre className="p-4 text-xs sm:text-sm overflow-x-auto text-zinc-300">
              <code>{`#include <stdio.h>

int main() {
    printf("olá, mundo 0!\\n");

    // missão 1 aguardando deploy...
    return 0;
}`}</code>
            </pre>
          </div>
        </section>

        {/* features grid */}
        <section className="pb-20">
          <h2 className="text-sm text-zinc-500 mb-6">
            // o que te espera nas próximas fases
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 hover:border-emerald-500/40 transition-colors"
              >
                <div className="text-xl mb-2">{f.icon}</div>
                <h3 className="text-sm font-semibold mb-1">{f.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-zinc-500">
          <span>
            <span className="text-emerald-400">$</span> echo "primeiro: aprender.
            depois: construir." && exit 0
          </span>
          <span>CodeQuest C — MIT</span>
        </div>
      </footer>
    </div>
  );
}
