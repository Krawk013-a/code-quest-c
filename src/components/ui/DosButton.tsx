"use client";

/**
 * DosButton — botão estilo DOS: colchetes envolvendo a ação.
 * `[ Rodar ]` — retângulo de borda simples, sem radius/sombra.
 */
export default function DosButton({
  label,
  onClick,
  disabled = false,
  tone = "cyan",
  type = "button",
  className = "",
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  tone?: "cyan" | "green" | "yellow" | "red" | "plain";
  type?: "button" | "submit";
  className?: string;
}) {
  const toneMap: Record<string, string> = {
    cyan: "text-dos-cyan border-dos-cyan hover:bg-dos-cyan hover:text-dos-blue",
    green:
      "text-dos-green border-dos-green hover:bg-dos-green hover:text-dos-blue",
    yellow:
      "text-dos-yellow border-dos-yellow hover:bg-dos-yellow hover:text-dos-blue",
    red: "text-dos-red border-dos-red hover:bg-dos-red hover:text-white",
    plain: "text-white border-white hover:bg-white hover:text-dos-blue",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`border-2 px-3 py-1 text-sm transition-colors ${
        disabled
          ? "cursor-not-allowed border-white/30 text-white/30"
          : toneMap[tone]
      } ${className}`}
    >
      [ {label} ]
    </button>
  );
}
