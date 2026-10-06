/**
 * DosWindow — janela com borda dupla ASCII e título centralizado na
 * borda superior (Turbo C/Borland). Container puro, sem lógica.
 *
 * ╔═════ TÍTULO ═════╗
 * ║  children        ║
 * ╚══════════════════╝
 */
export default function DosWindow({
  title,
  children,
  className = "",
  centerTitle = true,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  centerTitle?: boolean;
}) {
  return (
    <div className={`relative ${className}`}>
      {/* moldura dupla */}
      <div className="pointer-events-none absolute inset-0 border-2 border-white" />
      <div className="pointer-events-none absolute inset-[3px] border border-white" />

      {/* faixa do título centralizada na borda */}
      {title && (
        <div
          className={`absolute -top-2.5 flex w-full px-2 ${
            centerTitle ? "justify-center" : "justify-start pl-3"
          }`}
        >
          <span className="bg-dos-blue px-2 text-[11px] tracking-widest uppercase text-dos-cyan">
            {title}
          </span>
        </div>
      )}

      <div className="relative m-[5px] p-3">{children}</div>
    </div>
  );
}
