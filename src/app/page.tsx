import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/auth/LogoutButton";

const features = [
  {
    key: "missoes",
    title: "MISSOES COM CONTEXTO",
    text: "Nao e lista de exercicio: e um problema de verdade para voce resolver.",
  },
  {
    key: "execucao",
    title: "EXECUCAO REAL DE CODIGO",
    text: "Seu C e compilado e executado de verdade, com testes automaticos.",
  },
  {
    key: "dicas",
    title: "DICAS PROGRESSIVAS",
    text: "Errou? O sistema te guia aos poucos — sem entregar a resposta de graca.",
  },
  {
    key: "dominio",
    title: "DOMINIO POR CONCEITO",
    text: "Acompanhe sua evolucao real em cada conceito de C.",
  },
  {
    key: "bosses",
    title: "BOSSES E DESAFIOS",
    text: "No fim de cada mundo, misture tudo o que aprendeu num desafio maior.",
  },
  {
    key: "lab",
    title: "LABORATORIO ABERTO",
    text: "Quer testar uma ideia? Abra o main.c e programe sem pressao.",
  },
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-dos-blue text-white">
      <header className="border-b-2 border-white bg-dos-panel">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <span className="text-sm tracking-widest text-dos-cyan">CODEQUEST</span>
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-xs text-white/70 hover:text-dos-cyan transition-colors"
              >
                [ mapa ]
              </Link>
              <Link
                href="/perfil"
                className="text-xs text-white/70 hover:text-dos-cyan transition-colors"
              >
                [ perfil ]
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-xs text-white/70 hover:text-dos-cyan transition-colors"
              >
                [ mapa ]
              </Link>
              <Link
                href="/login"
                className="text-xs text-dos-yellow border-2 border-dos-yellow px-3 py-1 hover:bg-dos-yellow hover:text-dos-blue transition-colors"
              >
                [ entrar ]
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <pre className="text-dos-cyan text-xs leading-tight mb-8 select-none">
{`  ____           _       _          _   _____
 / ___|__ _ _ __| | ____| |___  ___| |_/ /   \\_ _ _ __
| |   / _\` | '__| |/ / _\` / __|/ _ \\ / / / /\\ / _\` | '__|
| |__| (_| | |  |   < (_| \\__ \\  __/ /\\ \\/ / /_  (_| | |
 \\____\\__,_|_|  |_|\\_\\__,_|___/\\___|\\_\\/\\_\\ /_/\\__,_|_|
                 C  .  TURBO  EDITION`}
        </pre>

        <p className="text-lg leading-relaxed mb-3">
          Aprenda C <span className="text-dos-yellow">programando de verdade</span>.
        </p>
        <p className="text-sm text-white/80 mb-10">
          Nao e um curso. E um jogo no qual programar e a maneira de avancar:
          aprenda, tente, erre, descubra, corrija, domine.
        </p>

        <div className="space-y-2 mb-10">
          <div className="border-2 border-white p-1">
            <div className="border border-white bg-black p-4 text-dos-green text-xs">
              <pre className="whitespace-pre-wrap">{`#include <stdio.h>

int main() {
    printf("ola, mundo 0!\\n");

    /* missao 1 aguardando... */
    return 0;
}`}</pre>
            </div>
          </div>
          <p className="text-xs text-white/60 text-center">
            MAIN.C — pressione qualquer tecla para continuar
          </p>
        </div>

        <section>
          <p className="text-dos-cyan text-xs mb-4">
            // O QUE TE ESPERA NAS PROXIMAS FASES
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {features.map((f) => (
              <div key={f.key} className="border-2 border-white p-4">
                <h3 className="text-dos-yellow text-xs tracking-widest mb-2">
                  {f.title}
                </h3>
                <p className="text-xs text-white/85 leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        <p className={`mt-12 text-center text-xs ${user ? "text-dos-green" : "text-dos-cyan dos-blink"}`}>
          {user
            ? "SESSAO ATIVA — BOM ESTUDO, OPERADOR."
            : "PRONTO? APERTE [ INICIAR ] NO LOGIN"}
        </p>
      </main>

      <footer className="border-t-2 border-white bg-dos-panel">
        <div className="mx-auto max-w-7xl px-4 py-2 text-center text-xs text-white/70">
          CODEQUEST C — MIT — PRIMEIRO: APRENDER. DEPOIS: CONSTRUIR.
        </div>
      </footer>
    </div>
  );
}
