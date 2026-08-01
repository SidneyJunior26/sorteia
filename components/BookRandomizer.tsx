"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import BookResult from "./BookResult";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { BookDTO, CategoryDTO, LanguageDTO } from "@/types/book";

interface BookRandomizerProps {
  categories: CategoryDTO[];
  languages: LanguageDTO[];
}

const ALL_CATEGORIES = "__all__";
const QUANTITY_OPTIONS = [1, 2, 3] as const;

const LANGUAGE_LABELS: Record<string, string> = {
  pt: "Português",
  "pt-BR": "Português (BR)",
  "pt-PT": "Português (PT)",
  en: "Inglês",
  es: "Espanhol",
  fr: "Francês",
  de: "Alemão",
  it: "Italiano",
  ja: "Japonês",
  zh: "Chinês",
  ru: "Russo",
  nl: "Holandês",
  ko: "Coreano",
  la: "Latim",
};

function languageLabel(code: string): string {
  return LANGUAGE_LABELS[code] ?? code.toUpperCase();
}

function ResultSkeleton() {
  return (
    <Card>
      <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row gap-6">
        <Skeleton className="mx-auto sm:mx-0 w-32 h-48 sm:w-36 sm:h-52 rounded-lg shrink-0" />
        <div className="flex-1 min-w-0 space-y-3">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function BookRandomizer({ categories, languages }: BookRandomizerProps) {
  const [selectedSlug, setSelectedSlug] = useState<string>(ALL_CATEGORIES);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [books, setBooks] = useState<BookDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const toggleLanguage = useCallback((code: string, checked: boolean) => {
    setSelectedLanguages((prev) => (checked ? [...prev, code] : prev.filter((c) => c !== code)));
  }, []);

  const sortear = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (selectedSlug !== ALL_CATEGORIES) params.set("category", selectedSlug);
    params.set("count", String(quantity));
    for (const lang of selectedLanguages) params.append("language", lang);
    if (quantity === 1 && books[0]?.id) params.set("exclude", books[0].id);

    try {
      const response = await fetch(`/api/random-book?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        setBooks([]);
        setError(data.error ?? "Não foi possível sortear um livro.");
        return;
      }

      setBooks(data.books as BookDTO[]);
    } catch {
      setBooks([]);
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [selectedSlug, quantity, selectedLanguages, books]);

  const resultKey = loading ? "loading" : books.length > 0 ? `books-${books.map((b) => b.id).join("-")}` : "idle";

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full max-w-md flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedSlug} onValueChange={setSelectedSlug}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_CATEGORIES}>Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={String(quantity)} onValueChange={(value) => setQuantity(Number(value))}>
            <SelectTrigger className="sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QUANTITY_OPTIONS.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} {n === 1 ? "livro" : "livros"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {languages.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" type="button" className="w-full justify-between font-normal">
                <span>
                  {selectedLanguages.length === 0
                    ? "Todos os idiomas"
                    : selectedLanguages.length === 1
                      ? languageLabel(selectedLanguages[0])
                      : `${selectedLanguages.length} idiomas selecionados`}
                </span>
                <ChevronDown className="size-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]" align="start">
              <DropdownMenuLabel>Idioma do livro</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {languages.map((lang) => (
                <DropdownMenuCheckboxItem
                  key={lang.code}
                  checked={selectedLanguages.includes(lang.code)}
                  onCheckedChange={(checked) => toggleLanguage(lang.code, checked === true)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {languageLabel(lang.code)}{" "}
                  <span className="text-gray-400">({lang.count})</span>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <motion.div whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
          <Button
            type="button"
            onClick={sortear}
            disabled={loading}
            size="lg"
            className="w-full bg-brand-600 text-white hover:bg-brand-700"
          >
            {loading ? "Sorteando..." : books.length > 0 ? "Sortear de novo" : "🎲 Sortear livro"}
          </Button>
        </motion.div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2 max-w-md text-center">
          {error}
        </p>
      )}

      <AnimatePresence mode="wait">
        {resultKey !== "idle" && (
          <motion.div
            key={resultKey}
            initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="w-full flex flex-col gap-4"
          >
            {loading
              ? Array.from({ length: quantity }).map((_, i) => <ResultSkeleton key={i} />)
              : books.map((book, i) => (
                  <motion.div
                    key={book.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: reduceMotion ? 0 : i * 0.08 }}
                  >
                    <BookResult book={book} />
                  </motion.div>
                ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
