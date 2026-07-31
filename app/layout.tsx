import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";
import FloatingLetters from "@/components/FloatingLetters";

export const metadata: Metadata = {
  title: "Sorteia — Ache seu próximo livro em um clique",
  description:
    "Sorteia um livro aleatório do catálogo ou por categoria — de Romance a Ciências — e compra na Amazon em um clique.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <FloatingLetters />
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-brand-100 bg-white/70 backdrop-blur">
            <div className="mx-auto max-w-3xl px-4 py-4 flex items-center gap-2">
              <Image src="/logo.png" alt="Sorteia" width={28} height={28} priority />
              <span className="font-semibold text-lg text-brand-800">
                Sorteia
              </span>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-brand-100 py-6 text-center text-sm text-gray-500">
            <p>
              Feito com Next.js. Os links de compra podem ter código de
              afiliado — isso não muda o preço que você paga.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
