/** Renderiza markdown mínimo: **negrito**, `código`, listas e quebras */
export default function SimpleMarkdown({
  text,
  size = "xs",
}: {
  text: string;
  size?: "xs" | "sm";
}) {
  const cls = size === "sm" ? "text-sm" : "text-xs";
  const lines = text.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        // linha de lista (- item)
        if (line.trimStart().startsWith("- ")) {
          const parts = line
            .trimStart()
            .slice(2)
            .split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
          return (
            <p key={i} className={`${cls} text-white/90 leading-relaxed pl-3`}>
              <span className="text-dos-cyan">·</span>{" "}
              {parts.map((part, j) => renderInline(part, j))}
            </p>
          );
        }
        const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
        return (
          <p key={i} className={`${cls} text-white/90 leading-relaxed`}>
            {parts.map((part, j) => renderInline(part, j))}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(part: string, key: number): React.ReactNode {
  if (part.startsWith("**") && part.endsWith("**")) {
    return (
      <strong key={key} className="text-dos-yellow">
        {part.slice(2, -2)}
      </strong>
    );
  }
  if (part.startsWith("`") && part.endsWith("`")) {
    return (
      <code key={key} className="text-dos-green bg-black px-1">
        {part.slice(1, -1)}
      </code>
    );
  }
  return <span key={key}>{part}</span>;
}
