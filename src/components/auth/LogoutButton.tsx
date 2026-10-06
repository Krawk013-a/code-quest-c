"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-xs text-zinc-400 border border-zinc-700 rounded px-3 py-1.5 hover:border-red-500/40 hover:text-red-400 transition-colors"
    >
      sair
    </button>
  );
}
