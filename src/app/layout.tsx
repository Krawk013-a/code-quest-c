import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

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
    <html lang="pt-BR" className={jetbrains.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
