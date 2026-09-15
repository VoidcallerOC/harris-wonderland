/**
 * Preview-only isolation helpers.
 *
 * Vercel Preview must never inherit production Postgres, production auth
 * secrets, or live Square charge capability. Production continues to use
 * DATABASE_URL / BETTER_AUTH_SECRET / SQUARE_ACCESS_TOKEN unchanged.
 *
 * Keep this file free of Node built-in imports so client bundles that pull
 * Square server-fn modules can still tree-shake it.
 */

export function isVercelPreview(): boolean {
  return typeof process !== "undefined" && process.env.VERCEL_ENV === "preview";
}

export function isVercelProduction(): boolean {
  return typeof process !== "undefined" && process.env.VERCEL_ENV === "production";
}

/**
 * Isolated database URL for this process.
 *
 * Preview uses REVIEW_DATABASE_URL only. Production DATABASE_URL is ignored
 * on preview even if Vercel inherited it from Production env, so a preview
 * cannot open the live shop database.
 */
export function isolatedDatabaseUrl(): string | undefined {
  if (typeof process === "undefined") return undefined;
  if (isVercelPreview()) {
    const review = process.env.REVIEW_DATABASE_URL?.trim();
    return review || undefined;
  }
  const raw = process.env.DATABASE_URL?.trim();
  return raw || undefined;
}

/** Live Square charges and payment-links are forbidden on preview. */
export function squarePaymentsAllowed(): boolean {
  return !isVercelPreview();
}

/**
 * Temporary Adam Review account. Seeded into the isolated PGlite database on
 * every preview boot. This is a public-repo demo credential for synthetic
 * data only — it cannot reach production.
 */
export const REVIEW_ADAM = {
  userId: "adam-review-user-000000000000",
  accountId: "adam-review-account-00000000",
  name: "Adam Review",
  email: "adam.review@harris-review.invalid",
  role: "manager" as const,
  password: "HarrisReview-Adam-2026",
};

export const REVIEW_BRANCH_ALIAS =
  "https://harris-wonderland-git-adam-review-nickhsousa96-8307s-projects.vercel.app";
