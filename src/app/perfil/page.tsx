import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TerminalHeader from "@/components/ui/TerminalHeader";
import LogoutButton from "@/components/auth/LogoutButton";
import DosWindow from "@/components/ui/DosWindow";
import DosBar from "@/components/ui/DosBar";
import ProfileForm from "@/components/auth/ProfileForm";
import { xpForLevel, levelProgress } from "@/lib/engine/levels";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, total_xp, level, streak_days, created_at")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/dashboard");

  const nextLevelXp = xpForLevel(profile.level + 1);
  const pct = levelProgress(profile.total_xp, profile.level);

  const { data: email } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-dos-blue text-white">
      <TerminalHeader
        right={<LogoutButton />}
        status={
          <span>
            <span className="text-dos-yellow">NIVEL {profile.level}</span>
            <span className="mx-2 text-white/40">|</span>
            <span className="text-dos-green">{profile.total_xp} XP</span>
          </span>
        }
      />

      <main className="mx-auto max-w-2xl px-6 py-10 space-y-6">
        <DosWindow title="PERFIL DO OPERADOR">
          <div className="space-y-4">
            <div className="text-sm space-y-1">
              <p>
                <span className="text-white/60">EMAIL:</span>{" "}
                {user.email ?? "-"}
              </p>
              <p>
                <span className="text-white/60">DESDE:</span>{" "}
                {new Date(profile.created_at).toLocaleDateString("pt-BR")}
              </p>
              {profile.streak_days > 0 && (
                <p>
                  <span className="text-white/60">STREAK:</span>{" "}
                  <span className="text-dos-red">
                    {profile.streak_days}{" "}
                    {profile.streak_days === 1 ? "DIA" : "DIAS"}
                  </span>
                </p>
              )}
            </div>

            <div className="border-t border-white/20 pt-3">
              <p className="mb-1 text-[11px] text-white/60">
                PROGRESSO DO NIVEL {profile.level} → {profile.level + 1}
              </p>
              <DosBar
                value={pct}
                max={100}
                width={24}
                tone="yellow"
                showNumbers={false}
              />
              <p className="mt-1 text-xs text-white/70">
                {profile.total_xp}/{nextLevelXp} XP
              </p>
            </div>
          </div>
        </DosWindow>

        <DosWindow title="PERSONALIZAR">
          <ProfileForm
            initialUsername={profile.username}
            initialDisplayName={profile.display_name ?? profile.username}
          />
        </DosWindow>
      </main>
    </div>
  );
}
