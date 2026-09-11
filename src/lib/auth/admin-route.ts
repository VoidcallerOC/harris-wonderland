import { redirect } from "@tanstack/react-router";
import { ForbiddenError } from "./rbac-guards.ts";

/**
 * Route loaders use this wrapper so direct navigation to every protected admin
 * path behaves like /admin instead of surfacing an Unauthorized 500 page.
 */
export async function requireAdminRoute<T>(loader: () => Promise<T>): Promise<T> {
  try {
    return await loader();
  } catch (error) {
    if (error instanceof ForbiddenError) {
      throw redirect({ to: "/login", search: { reason: "denied" } });
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      throw redirect({ to: "/login" });
    }
    throw error;
  }
}
