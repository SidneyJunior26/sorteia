"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import GlareHover from "@/components/reactbits/GlareHover";
import AddToShelfButton from "@/components/AddToShelfButton";
import type { BookDTO } from "@/types/book";

interface BookResultProps {
  book: BookDTO;
}

export default function BookResult({ book }: BookResultProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `"${book.title}" (${book.author}) — sorteei esse aqui. Sorteia o seu também:`;

  async function handleShare() {
    const url = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({ title: book.title, text: shareText, url });
      } catch {
        // User cancelled the native share sheet — not an error.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(`${shareText} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied — silently ignore, button just does nothing.
    }
  }

  return (
    // Violet spotlight rather than the upstream white one: white washes
    // out on the light theme and reads as a grey smudge.
    <SpotlightCard
      className="rounded-xl border-brand-100 dark:border-brand-900/60 shadow"
      spotlightColor="rgba(139, 92, 246, 0.18)"
    >
      <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-6">
        <div className="shrink-0 mx-auto sm:mx-0">
          {/* GlareHover writes width/height/background as inline styles,
              which would beat any Tailwind class on it — so the sizing and
              surface colors stay on this wrapper and the glare layer just
              fills it. */}
          <div className="relative w-32 h-48 sm:w-36 sm:h-52 rounded-lg overflow-hidden bg-brand-50 dark:bg-brand-950 border border-brand-100 dark:border-brand-900/60">
            <GlareHover
              width="100%"
              height="100%"
              borderRadius="0.5rem"
              background="transparent"
              borderColor="transparent"
              glareOpacity={0.35}
              glareSize={200}
              transitionDuration={700}
            >
              {book.coverUrl ? (
                <Image
                  src={book.coverUrl}
                  alt={`Capa do livro ${book.title}`}
                  fill
                  sizes="144px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-brand-300 dark:text-brand-700">
                  📖
                </div>
              )}
            </GlareHover>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {book.category && (
            <Badge
              variant="secondary"
              className="mb-2 uppercase tracking-wide text-brand-600 bg-brand-50 hover:bg-brand-50 dark:text-brand-300 dark:bg-brand-950 dark:hover:bg-brand-950"
            >
              {book.category}
            </Badge>
          )}
          <h2 className="text-xl font-bold text-foreground mb-1">{book.title}</h2>
          <p className="text-sm text-muted-foreground mb-3">{book.author}</p>

          {book.synopsis && (
            <p className="text-sm text-foreground/80 leading-relaxed mb-5 line-clamp-6">
              {book.synopsis}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Amazon's own near-black almost vanishes against the dark
                page background, so it gets a hairline outline there. */}
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-[#131921] hover:bg-[#232f3e] text-white gap-2 px-6 dark:ring-1 dark:ring-white/20"
            >
              <a href={`/go/${book.id}/AMAZON`} target="_blank" rel="noopener noreferrer sponsored">
                <ShoppingCart className="size-4 shrink-0 text-[#ff9900]" />
                <span>
                  Buscar na{" "}
                  <span className="relative inline-block font-bold">
                    amazon
                    <svg
                      className="absolute left-0 -bottom-1.5 w-full"
                      viewBox="0 0 100 18"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M2 3 Q50 18 96 4"
                        stroke="#ff9900"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <path
                        d="M88 1.5 L97 4 L91 11"
                        stroke="#ff9900"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </span>
              </a>
            </Button>

            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-[#FFE600] hover:bg-[#f7dc00] text-[#3483FA] gap-2 px-6"
            >
              <a
                href={`/go/${book.id}/MERCADO_LIVRE`}
                target="_blank"
                rel="noopener noreferrer sponsored"
              >
                <ShoppingCart className="size-4 shrink-0" />
                <span>
                  Buscar no <span className="font-bold">Mercado Livre</span>
                </span>
              </a>
            </Button>
          </div>

          <div className="mt-4 pt-4 border-t border-brand-100 dark:border-brand-900/60">
            <AddToShelfButton book={book} />
          </div>

          <div className="mt-4 pt-4 border-t border-brand-100 dark:border-brand-900/60">
            <p className="text-xs text-muted-foreground mb-2">
              Sorteou um livro bom? Manda pra quem também nunca sabe o que ler.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-2"
            >
              <Share2 className="size-3.5 shrink-0" />
              {copied ? "Copiado!" : "Compartilhar esse sorteio"}
            </Button>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
