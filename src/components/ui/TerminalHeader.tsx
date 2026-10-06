import Link from "next/link";

/**
 * Header padrão do app — estilo terminal, consistente em todas as páginas.
 * `right` recebe ações da página (entrar, logout, links...).
 */
export default function TerminalHeader({
  right,
}: {
  right?: React.ReactNode;
}) {
  return (
    <header className="border-b border-zinc-800">
      <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-emerald-400">$</span>
          <span className="text-sm tracking-wide group-hover:text-emerald-400 transition-colors">
            codequest<span className="text-zinc-500">--c</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">{right}</div>
      </div>
    </header>
  );
}
