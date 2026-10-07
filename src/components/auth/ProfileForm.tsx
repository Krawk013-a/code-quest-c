"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DosButton from "@/components/ui/DosButton";

const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

export default function ProfileForm({
  initialUsername,
  initialDisplayName,
}: {
  initialUsername: string;
  initialDisplayName: string;
}) {
  const router = useRouter();
  const [username, setUsername] = useState(initialUsername);
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOk(null);

    const trimmed = username.trim().toLowerCase();
    if (!USERNAME_REGEX.test(trimmed)) {
      setError("Usuario: 3-20 caracteres — letras minuscululas, numeros e _");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Sessao expirada — entre novamente.");
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        username: trimmed,
        display_name: displayName.trim() || trimmed,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      setError(
        updateError.message.includes("duplicate")
          ? "Este nome de usuario ja esta em uso."
          : `ERRO: ${updateError.message}`
      );
    } else {
      setOk("Perfil atualizado com sucesso.");
      router.refresh();
    }
    setSaving(false);
  }

  const inputClass =
    "w-full border-2 border-white bg-black px-3 py-2 text-sm text-dos-green placeholder:text-white/30 outline-none focus:border-dos-cyan";
  const labelClass = "text-xs text-dos-cyan mb-1 block";

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div>
        <label className={labelClass} htmlFor="displayName">
          nome de exibicao (como aparece no jogo)
        </label>
        <input
          id="displayName"
          className={inputClass}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="ex.: Enzo"
          maxLength={40}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="username">
          usuario (minuscululas, numeros e _)
        </label>
        <input
          id="username"
          className={inputClass}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="ex.: enzo_silva"
          maxLength={20}
        />
      </div>

      {error && (
        <div className="border-2 border-dos-red bg-black px-3 py-2 text-xs text-dos-red">
          ERRO: {error}
        </div>
      )}
      {ok && (
        <div className="border-2 border-dos-green bg-black px-3 py-2 text-xs text-dos-green">
          OK: {ok}
        </div>
      )}

      <DosButton
        type="submit"
        label={saving ? "salvando..." : "Salvar Perfil"}
        tone="green"
        disabled={saving}
      />
    </form>
  );
}
