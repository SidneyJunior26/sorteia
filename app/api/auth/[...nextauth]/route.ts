import { handlers } from "@/auth";

// bcryptjs and the Prisma adapter pull this out of the Edge runtime.
export const runtime = "nodejs";

export const { GET, POST } = handlers;
