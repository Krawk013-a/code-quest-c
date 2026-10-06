"use client";

import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

/**
 * Tema CodeQuest — dark + verde terminal.
 * Combina com o design system (zinc-950/emerald-500) do app.
 */

const codequestTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "#09090b",
      color: "#e4e4e7",
      fontSize: "13.5px",
    },
    ".cm-content": {
      caretColor: "#10b981",
      padding: "12px 0",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "#10b981",
    },
    ".cm-selectionBackground, ::selection": {
      backgroundColor: "rgba(16, 185, 129, 0.18) !important",
    },
  },
  { dark: true }
);

const codequestHighlight = HighlightStyle.define([
  { tag: t.comment, color: "#52525b", fontStyle: "italic" },
  { tag: [t.keyword, t.modifier], color: "#f472b6" },
  { tag: [t.string, t.special(t.string)], color: "#fbbf24" },
  { tag: t.number, color: "#a78bfa" },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: "#10b981" },
  { tag: t.typeName, color: "#38bdf8" },
  { tag: [t.operator, t.punctuation], color: "#a1a1aa" },
  { tag: t.variableName, color: "#e4e4e7" },
  { tag: t.propertyName, color: "#38bdf8" },
  { tag: [t.bool, t.null], color: "#a78bfa" },
  { tag: t.meta, color: "#fb923c" },
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
