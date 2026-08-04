import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Resolves the caller's user id, or the 401 response to return.
 *
 * Every /api route that touches user data starts with this. Ownership is
 * then enforced by putting `userId` inside the Prisma `where` — never by
 * fetching a row and comparing in JS, which is an IDOR one refactor away.
 */
export async function requireUserId(): Promise<
  { userId: string } | { response: NextResponse }
> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      response: NextResponse.json(
        { error: "Você precisa estar logado." },
        { status: 401 }
      ),
    };
  }

  return { userId: session.user.id };
}
