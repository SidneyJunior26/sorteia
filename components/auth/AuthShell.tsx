"use client";

import Link from "next/link";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import FadeContent from "@/components/reactbits/FadeContent";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:py-20">
      <FadeContent duration={500} blur>
        <SpotlightCard
          className="p-6 sm:p-8 shadow-sm"
          spotlightColor="rgba(139, 92, 246, 0.18)"
        >
          <h1 className="text-2xl font-bold text-brand-900 dark:text-brand-100 mb-1">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">{subtitle}</p>

          {children}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {footer}
          </p>
        </SpotlightCard>
      </FadeContent>

      <p className="mt-6 text-center text-sm">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          ← Voltar pro sorteio
        </Link>
      </p>
    </div>
  );
}
