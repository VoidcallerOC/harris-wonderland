import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth/server";

/** Better Auth owns the complete same-origin `/api/auth/*` contract. */
export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => auth.handler(request),
      POST: ({ request }) => auth.handler(request),
    },
  },
});
