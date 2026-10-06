"use client";

import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

/**
 * Tema CodeQuest — dark + verde terminal.
 * Combina com o design system DOS (bg preto, texto verde/ciano) do app.
 */

const codequestTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "#000000",
      color: "#00ff00",
      fontSize: "13.5px",
    },
    ".cm-content": {
      caretColor: "#00ff00",
      padding: "12px 0",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#00ff00",
    },
    ".cm-selectionBackground, ::selection": {
      backgroundColor: "rgba(0, 255, 255, 0.25) !important",
    },
  },
  { dark: true }
);

const codequestHighlight = HighlightStyle.define([
  { tag: t.comment, color: "#808080" },
  { tag: [t.keyword, t.modifier], color: "#ffff55" },
  { tag: [t.string, t.special(t.string)], color: "#00ffff" },
  { tag: t.number, color: "#ff5555" },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: "#ffffff" },
  { tag: t.typeName, color: "#00ffff" },
  { tag: [t.operator, t.punctuation], color: "#ffffff" },
  { tag: t.variableName, color: "#00ff00" },
  { tag: t.propertyName, color: "#00ffff" },
  { tag: [t.bool, t.null], color: "#ff5555" },
  { tag: t.meta, color: "#ff55ff" },
]);

export default function CodeEditor({
  value,
  onChange,
  height = "420px",
}: {
  value: string;
  onChange: (code: string) => void;
  height?: string;
}) {
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      height={height}
      theme={[codequestTheme, syntaxHighlighting(codequestHighlight)]}
      extensions={[cpp()]}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLine: true,
        highlightActiveLineGutter: true,
        foldGutter: false,
        autocompletion: false,
        bracketMatching: true,
        closeBrackets: true,
        indentOnInput: false,
        highlightSelectionMatches: false,
      }}
    />
  );
}
