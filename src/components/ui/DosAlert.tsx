/**
 * DosAlert — caixa de alerta estilo DOS: borda dupla, título curto
 * centralizado (ERRO / AVISO / SUCESSO), mensagem direta.
 *
 * ┌─[ ERRO ]────────────┐
 * │ mensagem direta      │
 * └─────────────────────┘
 */
export default function DosAlert({
  kind,
  title,
  children,
}: {
  kind: "error" | "warning" | "success" | "info";
  title?: string;
  children: React.ReactNode;
}) {
  const kindMap = {
    error: { label: "ERRO", color: "text-dos-red", border: "border-dos-red" },
    warning: {
      label: "AVISO",
      color: "text-dos-yellow",
      border: "border-dos-yellow",
    },
    success: {
      label: "SUCESSO",
      color: "text-dos-green",
      border: "border-dos-green",
    },
    info: { label: "INFO", color: "text-dos-cyan", border: "border-dos-cyan" },
  } as const;
  const k = kindMap[kind];
  const finalTitle = title ?? k.label;

  return (
    <div className={`relative border-2 ${k.border} bg-black/40 p-3`}>
      <div className="absolute -top-2.5 left-3 bg-dos-blue px-2 text-[11px] tracking-widest uppercase">
        <span className={k.color}>{finalTitle}</span>
      </div>
      <div className="text-sm">
        <div className="pt-1">{children}</div>
      </div>
    </div>
  );
}
