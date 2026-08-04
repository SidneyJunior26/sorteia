import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import FloatingLetters from "@/components/FloatingLetters";
import Providers from "@/components/providers";
import ThemeToggle from "@/components/ThemeToggle";
import AuthNav from "@/components/AuthNav";
import GradientText from "@/components/reactbits/GradientText";

export const metadata: Metadata = {
  title: "Achei Meu Livro — descubra sua próxima leitura em um clique",
  description:
    "Sorteia um livro aleatório do catálogo ou por categoria — de Romance a Ciências — e compra na Amazon em um clique.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning is required by next-themes: it stamps the
    // theme class onto <html> before React hydrates.
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Providers>
          <FloatingLetters />
          <div className="min-h-screen flex flex-col">
            <header className="border-b border-border bg-[var(--surface-translucent)] backdrop-blur">
              <div className="mx-auto max-w-3xl px-4 py-4 flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src="/logo.png"
                    alt="Achei Meu Livro"
                    width={28}
                    height={28}
                    priority
                  />
                  <GradientText
                    className="font-semibold text-lg"
                    colors={["#5b21b6", "#8b5cf6", "#c4b5fd", "#8b5cf6"]}
                    animationSpeed={10}
                  >
                    Achei Meu Livro
                  </GradientText>
                </Link>

                <div className="ml-auto flex items-center gap-1">
                  <AuthNav />
                  <ThemeToggle />
                </div>
              </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
              <p>
                Feito com Next.js. Os links de compra podem ter código de
                afiliado — isso não muda o preço que você paga.
              </p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
