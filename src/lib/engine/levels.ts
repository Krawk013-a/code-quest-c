// Engine de progressão — níveis e XP (Plano Mestre §10)
//
// Curva: subir do nível n para n+1 custa 100×n XP.
// XP acumulado para ESTAR no nível n: 50×n×(n-1).
//   nível 1 → 0 XP | nível 2 → 100 XP | nível 3 → 300 XP | nível 4 → 600 XP

/** XP total acumulado necessário para estar no nível `level` */
export function xpForLevel(level: number): number {
  return 50 * level * (level - 1);
}

/** Nível que corresponde a um total de XP acumulado */
export function levelForXp(xp: number): number {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) {
    level++;
  }
  return level;
}

/** Progresso (0–100) do nível atual para o próximo */
export function levelProgress(xp: number, level: number): number {
  const current = xpForLevel(level);
  const next = xpForLevel(level + 1);
  if (next === current) return 0;
  return Math.min(100, Math.max(0, ((xp - current) / (next - current)) * 100));
}
