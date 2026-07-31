import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BookDTO } from "@/types/book";

interface BookResultProps {
  book: BookDTO;
}

export default function BookResult({ book }: BookResultProps) {
  return (
    <Card className="border-brand-100">
      <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row gap-6">
        <div className="shrink-0 mx-auto sm:mx-0">
          <div className="relative w-32 h-48 sm:w-36 sm:h-52 rounded-lg overflow-hidden bg-brand-50 border border-brand-100">
            {book.coverUrl ? (
              <Image
                src={book.coverUrl}
                alt={`Capa do livro ${book.title}`}
                fill
                sizes="144px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-brand-300">
                📖
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <Badge
            variant="secondary"
            className="mb-2 uppercase tracking-wide text-brand-600 bg-brand-50 hover:bg-brand-50"
          >
            {book.category}
          </Badge>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{book.title}</h2>
          <p className="text-sm text-gray-600 mb-3">{book.author}</p>

          {book.synopsis && (
            <p className="text-sm text-gray-700 leading-relaxed mb-5 line-clamp-6">
              {book.synopsis}
            </p>
          )}

          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto bg-[#131921] hover:bg-[#232f3e] text-white gap-2 px-6"
          >
            <a href={`/go/${book.id}/AMAZON`} target="_blank" rel="noopener noreferrer sponsored">
              <ShoppingCart className="size-4 shrink-0 text-[#ff9900]" />
              <span>
                Comprar na{" "}
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
        </div>
      </CardContent>
    </Card>
  );
}
