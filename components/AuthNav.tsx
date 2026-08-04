"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LibraryBig, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AuthNav() {
  const { data: session, status } = useSession();

  // The session is fetched client-side (see components/providers.tsx),
  // so reserve the slot instead of flashing "Entrar" at a logged-in user.
  if (status === "loading") {
    return <div className="h-9 w-24 rounded-md bg-muted animate-pulse" />;
  }

  if (!session?.user) {
    return (
      <Button asChild size="sm" variant="ghost">
        <Link href="/entrar">Entrar</Link>
      </Button>
    );
  }

  const label = session.user.name?.trim().split(/\s+/)[0] ?? "Conta";

  return (
    <div className="flex items-center gap-1">
      <Button asChild size="sm" variant="ghost" className="gap-1.5">
        <Link href="/estante" id="estante-nav-link">
          <LibraryBig className="size-4" />
          <span className="hidden sm:inline">Minha estante</span>
        </Link>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 shrink-0"
            aria-label="Sua conta"
          >
            <UserIcon className="size-[18px]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="font-normal">
            <span className="block text-sm font-medium">{label}</span>
            <span className="block text-xs text-muted-foreground">
              {session.user.email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/" })}
            className="gap-2"
          >
            <LogOut className="size-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
