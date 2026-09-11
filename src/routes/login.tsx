import { useState } from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { GROK_PROVIDERS, authClient, authEnabled, signIn, signOut } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    reason: typeof search.reason === "string" ? search.reason : undefined,
  }),
  component: LoginPage,
});

function LoginPage() {
  const session = authClient.useSession();
  const { reason } = Route.useSearch();
  const [pendingProvider, setPendingProvider] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const denied = reason === "denied";

  if (session.data?.user && !denied) return <Navigate to="/admin" />;

  async function handleSignIn(providerId: string) {
    setPendingProvider(providerId);
    setErrorMessage(null);
    try {
      await signIn(providerId, { callbackURL: "/admin", errorCallbackURL: "/login" });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Sign-in failed. Please try again.");
      setPendingProvider(null);
    }
  }

  return (
    <SiteShell>
      <main className="wrap flex min-h-[70svh] items-center justify-center py-16 sm:py-24">
        <section className="w-full max-w-lg border border-border bg-card p-6 sm:p-10">
          <p className="font-ui text-kicker font-bold uppercase tracking-kicker text-brass">Studio access</p>
          <h1 className="mt-2 font-display text-4xl font-semibold italic leading-none tracking-display text-ticket sm:text-5xl">
            Sign in.
          </h1>
          <p className="mt-4 leading-snug text-fg-soft">
            Google sign-in is for the site builder until the shop is ready to take the desk. Shop staff are not added until that handoff.
          </p>

          {!session.isPending && !authEnabled && (
            <p className="mt-6 border border-ember/40 bg-ember/10 p-3 text-sm text-fg-soft">
              Sign-in is disabled in this environment.
            </p>
          )}

          {(denied || errorMessage) && (
            <p role="alert" className="mt-6 border border-red-500/40 bg-red-500/10 p-3 text-sm text-fg-soft">
              {errorMessage ?? "This Google account is not on the studio list. Sign out and use the approved Gmail."}
            </p>
          )}

          {denied && session.data?.user ? (
            <div className="mt-8">
              <button
                type="button"
                onClick={() => void signOut("/login")}
                className="min-h-12 w-full border border-brass/50 bg-transparent px-5 py-3 text-center font-ui font-bold uppercase tracking-kicker text-ticket transition-colors hover:border-brass hover:bg-brass/10"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="mt-8 grid gap-3">
              {GROK_PROVIDERS.map((provider) => (
                <button
                  key={provider.providerId}
                  type="button"
                  disabled={pendingProvider !== null || !authEnabled}
                  onClick={() => void handleSignIn(provider.providerId)}
                  className="min-h-12 border border-brass/50 bg-transparent px-5 py-3 text-center font-ui font-bold uppercase tracking-kicker text-ticket transition-colors hover:border-brass hover:bg-brass/10 disabled:cursor-wait disabled:opacity-50"
                >
                  {pendingProvider === provider.providerId ? "Opening sign-in…" : `Continue with ${provider.label}`}
                </button>
              ))}
            </div>
          )}
        </section>
      </main>
    </SiteShell>
  );
}
