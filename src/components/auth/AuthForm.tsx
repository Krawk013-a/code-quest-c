"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

/** Traduz mensagens do Supabase Auth para PT-BR humano (§8 do Plano Mestre, aplicado ao auth). */
function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "Email ou senha incorretos.";
  if (m.includes("already registered"))
    return "Já existe uma conta com esse email.";
  if (m.includes("at least 6 characters"))
    return "A senha precisa ter no mínimo 6 caracteres.";
  if (m.includes("email not confirmed"))
    return "Email não confirmado — confira sua caixa de entrada (ou desative a confirmação no painel do Supabase: Authentication → Providers → Email).";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Muitas tentativas em pouco tempo. Espera um pouco e tenta de novo.";
  if (m.includes("unable to validate email")) return "Email inválido.";
  return `Erro: ${message}`;
}

export default function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setNotice(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    const trimmedUsername = username.trim().toLowerCase();
    if (mode === "signup" && !USERNAME_REGEX.test(trimmedUsername)) {
      setError("Usuário: 3–20 caracteres — letras minúsculas, números e _");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: trimmedUsername,
              display_name: displayName.trim() || trimmedUsername,
            },
          },
        });
        if (signUpError) throw signUpError;

        if (data.session) {
          router.push("/dashboard");
          router.refresh();
        } else {
          setNotice(
            "Conta criada! Confirme seu email antes de entrar (ou desative a confirmação no painel do Supabase)."
          );
          setMode("login");
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? translateAuthError(err.message)
          : "Erro inesperado. Tenta de novo."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-emerald-500/50 transition-colors";
  const labelClass = "text-xs text-zinc-500 mb-1 block";
  const tabClass = (active: boolean) =>
    `flex-1 pb-3 pt-1 text-sm transition-colors ${
      active
        ? "text-emerald-400 border-b-2 border-emerald-400"
        : "text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent"
    }`;

  return (
    <div className="w-full max-w-md">
      {/* abas entrar / criar conta */}
      <div className="flex border-b border-zinc-800 mb-6">
        <button
          type="button"
          onClick={() => switchMode("login")}
          className={tabClass(mode === "login")}
        >
          entrar
        </button>
        <button
          type="button"
          onClick={() => switchMode("signup")}
          className={tabClass(mode === "signup")}
        >
          criar conta
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <>
            <div>
              <label className={labelClass} htmlFor="username">
                usuário
              </label>
              <input
                id="username"
                className={inputClass}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ex.: enzo_silva"
                required
                autoComplete="username"
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="displayName">
                nome de exibição (opcional)
              </label>
              <input
                id="displayName"
                className={inputClass}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="como aparecer no jogo"
              />
            </div>
          </>
        )}

        <div>
          <label className={labelClass} htmlFor="email">
            email
          </label>
          <input
            id="email"
            type="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@exemplo.com"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="password">
            senha
          </label>
          <input
            id="password"
            type="password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="mínimo 6 caracteres"
            required
            minLength={6}
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
          />
        </div>

        {error && (
          <div className="rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400 leading-relaxed">
            ✗ {error}
          </div>
        )}
        {notice && (
          <div className="rounded border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400 leading-relaxed">
            ✓ {notice}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-emerald-500 px-3 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading
            ? "processando..."
            : mode === "login"
              ? "entrar"
              : "criar conta"}
        </button>
      </form>
    </div>
  );
}
