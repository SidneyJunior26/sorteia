"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

// Kept in its own client module so `app/layout.tsx` can stay a server
// component.
//
// SessionProvider gets no `session` prop on purpose: seeding it would
// mean `await auth()` in the root layout, which opts every route in the
// app into dynamic rendering. It fetches /api/auth/session once on the
// client instead, and AuthNav renders a placeholder while that lands.
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
