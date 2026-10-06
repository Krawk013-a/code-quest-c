/** Anel de progresso de nível — SVG puro, cor de XP */
export default function XpRing({
  pct,
  level,
  xp,
  nextXp,
  size = 120,
}: {
  pct: number;
  level: number;
  xp: number;
  nextXp: number;
  size?: number;
}) {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, pct)) / 100) * c;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* trilha */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#1c1c1f"
          strokeWidth={stroke}
        />
        {/* progresso */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#fbbf24"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
          nível
        </span>
        <span className="text-3xl font-bold text-amber-300 leading-none">
          {level}
        </span>
        <span className="text-[10px] text-zinc-500 mt-1">
          {xp}/{nextXp} XP
        </span>
      </div>
    </div>
  );
}
