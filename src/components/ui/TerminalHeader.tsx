import Link from "next/link";

/**
 * Header DOS — barra superior estilo Turbo C.
 * Menu de ações à direita; status do jogador entra via `status`.
 */
export default function TerminalHeader({
  right,
  status,
}: {
  right?: React.ReactNode;
  status?: React.ReactNode;
}) {
  return (
    <header className="border-b-2 border-white bg-dos-panel">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm tracking-widest text-dos-cyan">
            CODEQUEST
          </Link>
          {status && (
            <span className="text-xs text-white">{status}</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs">{right}</div>
      </div>
    </header>
  );
}
