import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Edge-safe half of the auth setup.
 *
 * This file must NOT import `@/lib/prisma`, `@auth/prisma-adapter` or
 * `bcryptjs` — none of them run on the Edge runtime, and a `middleware.ts`
 * would import this module (and only this module). The Node-only pieces
 * live in `auth.ts`.
 */

const providers: NextAuthConfig["providers"] = [];

// Google stays optional, matching how the affiliate vars degrade in
// lib/affiliate.ts: with no credentials configured the provider is never
// registered and the login page hides its button, rather than rendering
// a button that 500s. clientId/clientSecret are passed explicitly
// because Auth.js would otherwise look for AUTH_GOOGLE_ID/SECRET.
export const hasGoogleProvider = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

if (hasGoogleProvider) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Without this, someone who signed up with e-mail + senha and then
      // clicks "Entrar com Google" on the same address hits
      // OAuthAccountNotLinked and is stuck there permanently. Google
      // verifies the e-mail it hands us, so trusting it to link is the
      // standard trade-off.
      allowDangerousEmailAccountLinking: true,
    })
  );
}

export default {
  providers,
  pages: {
    signIn: "/entrar",
    error: "/entrar",
  },
  // Forced by the Credentials provider added in auth.ts — it cannot use
  // database sessions.
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      // With JWT sessions there is no Session row to look the id up
      // from, so it has to be stamped into the token at sign-in.
      if (user?.id) token.sub = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.sub && session.user) session.user.id = token.sub;
      return session;
    },
  },
} satisfies NextAuthConfig;
