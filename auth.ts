import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ensureDefaultShelves } from "@/lib/shelves";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import authConfig from "./auth.config";

/**
 * Node-runtime half of the auth setup (Prisma + bcrypt live here).
 *
 * Note on JWT + the Prisma adapter coexisting: under
 * `session.strategy = "jwt"` Auth.js still calls the adapter's
 * createUser/linkAccount on an OAuth sign-in, so Google users ARE
 * persisted to User and Account — only the Session table stays empty.
 * That gives us a stable User.id to hang shelves off while keeping the
 * JWT sessions the Credentials provider requires.
 */

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

// Compared against on the "no such user" branch so a wrong e-mail and a
// wrong password take the same time — otherwise /entrar doubles as an
// account-enumeration oracle.
const DUMMY_HASH = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

// Two limits, not one: per-IP catches a script spraying many emails
// from one place; per-email catches a script targeting one account
// through a botnet/proxy pool that rotates IPs.
const LOGIN_IP_LIMIT = 20;
const LOGIN_EMAIL_LIMIT = 8;
const LOGIN_WINDOW_SECONDS = 10 * 60;

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  // Re-asserted after the spread: the adapter's presence would otherwise
  // flip the default back to database sessions.
  session: { strategy: "jwt" },
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(raw, request) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const ip = getClientIp(request);
        const [ipLimit, emailLimit] = await Promise.all([
          rateLimit(`login-ip:${ip}`, LOGIN_IP_LIMIT, LOGIN_WINDOW_SECONDS),
          rateLimit(`login-email:${email}`, LOGIN_EMAIL_LIMIT, LOGIN_WINDOW_SECONDS),
        ]);
        // Same fail-closed shape as a wrong password: this route already
        // treats "no such user" and "wrong password" identically to avoid
        // an enumeration oracle, so a rate-limit hit doesn't get to look
        // any different either.
        if (!ipLimit.allowed || !emailLimit.allowed) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            passwordHash: true,
          },
        });

        // No account, or a Google-only account with no password set.
        if (!user?.passwordHash) {
          await bcrypt.compare(password, DUMMY_HASH);
          return null;
        }

        if (!(await bcrypt.compare(password, user.passwordHash))) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  events: {
    // Fires on the Google path (the adapter creates the row). The
    // credentials path bypasses the adapter, so /api/signup calls
    // ensureDefaultShelves itself.
    async createUser({ user }) {
      if (user.id) await ensureDefaultShelves(user.id);
    },
  },
});
