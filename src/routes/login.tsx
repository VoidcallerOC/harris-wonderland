import { useState } from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { authClient, authEnabled, signOut } from "@/lib/auth/client";

const BUILDER_EMAIL = "nickhsousa96@gmail.com";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>) => ({
    reason: typeof search.reason === "string" ? search.reason : undefined,
  }),
  component: LoginPage,
});

function LoginPage() {
  const session = authClient.useSession();
  const { reason } = Route.useSearch();
  const [email, setEmail] = useState(BUILDER_EMAIL);
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const denied = reason === "denied";

  if (session.data?.user && !denied) return <Navigate to="/admin" />;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setErrorMessage(null);
    const normalized = email.trim().toLowerCase();
    if (normalized !== BUILDER_EMAIL) {
      setErrorMessage("Use the studio Gmail for now. Shop accounts are assigned later.");
      setPending(false);
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      setPending(false);
      return;
    }
    try {
      const signedIn = await authClient.signIn.email({
        email: normalized,
        password,
        callbackURL: "/admin",
      });
      if (!signedIn.error) {
        window.location.href = "/admin";
        return;
      }
      const message = signedIn.error.message ?? "";
      const unknownUser = /not found|invalid email or password|invalid password|no user/i.test(message);
      if (!unknownUser) {
        setErrorMessage(message || "Sign-in failed.");
        setPending(false);
        return;
      }
      const signedUp = await authClient.signUp.email({
        email: normalized,
        password,
        name: "Nick Sousa",
        callbackURL: "/admin",
      });
      if (signedUp.error) {
        setErrorMessage(signedUp.error.message ?? "Could not create the studio account.");
        setPending(false);
        return;
      }
      window.location.href = "/admin";
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Sign-in failed. Please try again.");
      setPending(false);
    }
  }

  return (
    <SiteShell>
      <main className="wrap flex min-h-[70svh] items-center justify-center py-16 sm:py-24">
        <section className="w-full max-w-lg border border-border bg-card p-6 sm:p-10">
          <p className="font-ui text-kicker font-bold uppercase tracking-kicker text-brass">Staff access</p>
          <h1 className="mt-2 font-display text-4xl font-semibold italic leading-none tracking-display text-ticket sm:text-5xl">
            Sign in.
          </h1>
          <p className="mt-4 leading-snug text-fg-soft">
            Use the studio Gmail and a password. First time here, that password creates the account.
          </p>

          {!session.isPending && !authEnabled && (
            <p className="mt-6 border border-ember/40 bg-ember/10 p-3 text-sm text-fg-soft">
              Sign-in is disabled in this environment.
            </p>
          )}

          {(denied || errorMessage) && (
            <p role="alert" className="mt-6 border border-red-500/40 bg-red-500/10 p-3 text-sm text-fg-soft">
              {errorMessage ?? "This account does not have a desk role yet."}
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
            <form className="mt-8 grid gap-3" onSubmit={(event) => void handleSubmit(event)}>
              <label className="grid gap-1 text-sm text-fg-soft">
                Email
                <input
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="min-h-12 border border-border bg-transparent px-3 text-ticket outline-none focus:border-brass"
                />
              </label>
              <label className="grid gap-1 text-sm text-fg-soft">
                Password
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="min-h-12 border border-border bg-transparent px-3 text-ticket outline-none focus:border-brass"
                />
              </label>
              <button
                type="submit"
                disabled={pending || !authEnabled}
                className="mt-2 min-h-12 border border-brass/50 bg-transparent px-5 py-3 text-center font-ui font-bold uppercase tracking-kicker text-ticket transition-colors hover:border-brass hover:bg-brass/10 disabled:cursor-wait disabled:opacity-50"
              >
                {pending ? "Signing in…" : "Sign in"}
              </button>
            </form>
          )}
        </section>
      </main>
    </SiteShell>
  );
}
