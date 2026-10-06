import type { ActivityType } from "@/types/database";

/** Ícones por tipo de atividade (§6 do Plano Mestre) */
const ACTIVITY_ICONS: Record<ActivityType, string> = {
  mission: "🟢",
  challenge: "🔵",
  boss: "👾",
  project: "🟣",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "fácil",
  medium: "médio",
  hard: "difícil",
  insane: "insano",
};

export function activityIcon(activity: ActivityType): string {
  return ACTIVITY_ICONS[activity] ?? "🟢";
}

export function difficultyLabel(difficulty: string): string {
  return DIFFICULTY_LABELS[difficulty] ?? difficulty;
}
