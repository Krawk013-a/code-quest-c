import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CodeQuest C — Aprenda C programando de verdade",
  description:
    "Plataforma gamificada de aprendizagem de programação. Resolva missões, execute código real, erre, descubra e avance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
