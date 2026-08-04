import type { DefaultSession } from "next-auth";

// Without this augmentation `session.user.id` is a type error under
// `strict: true` — the default Session.user has only name/email/image.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
  }
}
