# Adam Review Access Notes

Internal notes. Do not treat this as a production credential handoff.

## Preview URL

https://harris-wonderland-git-adam-review-nickhsousa96-8307s-projects.vercel.app

This is a Preview deployment of the existing Vercel project, built from branch `adam-review`. Production domains are unchanged.

## Authentication method

The preview exposes the application's existing Better Auth email/password login at `/login`.

## Adam review account

| Field | Value |
|---|---|
| Name | Adam Review |
| Email | `adam.review@harris-review.invalid` |
| Password | `HarrisReview-Adam-2026` |
| Role | manager |
| Seeded | Yes, on every isolated PGlite boot |

This password is committed only because the repository is already public and the account can reach **synthetic review data only**. It is not a production secret. It cannot access GitHub, Vercel, Supabase, Square, billing, or production Postgres.

Manager permissions are the existing RBAC role: business admin minus `users.*`, `roles.manage`, `system.database`, `system.deploy`, and `system.secrets`.

## Data isolation

- Preview **ignores** production `DATABASE_URL` unless `REVIEW_DATABASE_URL` is explicitly set.
- Default preview path is in-process PGlite, reseeded with synthetic holds/payments/copy.
- `scripts/migrate.mjs` will not migrate production Postgres during a Preview build.
- PGlite WASM/data files are copied into the Vercel function `_libs` directory so `/var/task/_libs/pglite.data` exists.
- Better Auth on preview uses a commit-SHA-derived secret, never the production `BETTER_AUTH_SECRET`.
- Square charges, refunds, and payment-links are hard-disabled when `VERCEL_ENV=preview`.

## Limitations and dependencies

- **SQUARE API ACCESS REQUIRED FROM ADAM** if live Square payment behavior must be verified.
- PGlite is ephemeral per serverless instance. Cookie cache is extended on preview so sessions can survive instance hops; created demo rows may not.
- No production data, production database, production credentials, service-role credentials, Stripe credentials, Square credentials, Vercel access, or infrastructure access are provided.

## Hard stop

Do not merge `adam-review` into `main`, promote the preview to production, change DNS, or give Adam production credentials.
