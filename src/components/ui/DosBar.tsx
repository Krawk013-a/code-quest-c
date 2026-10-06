/**
 * DosBar — barra de progresso em blocos Unicode, como o Turbo C
 * desenhava: ████████░░░░░░░░ 53%
 * Sem gradiente, sem radius — blocos sólidos.
 */
export default function DosBar({
  value,
  max,
  width = 20,
  showNumbers = true,
  tone = "cyan",
}: {
  value: number;
  max: number;
  width?: number;
  showNumbers?: boolean;
  tone?: "cyan" | "green" | "yellow";
}) {
  const ratio = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  const filled = Math.round(ratio * width);
  const bar = "█".repeat(filled) + "░".repeat(width - filled);
  const color =
    tone === "green"
      ? "text-dos-green"
      : tone === "yellow"
        ? "text-dos-yellow"
        : "text-dos-cyan";

  return (
    <span className={`whitespace-pre ${color}`}>
      {bar}
      {showNumbers && (
        <span className="ml-2 text-white">
          {value}/{max}
        </span>
      )}
    </span>
  );
}
