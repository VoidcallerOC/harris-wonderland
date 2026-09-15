# Adam Review Access Notes

## Preview URL

To be filled after the `adam-review` branch deployment is ready.

## Authentication method

The preview uses the application's existing Better Auth email/password flow. The temporary Adam review account, if created, must be created inside the isolated preview database and delivered through a secure channel. No password or secret belongs in Git.

## Adam review account

Status: Pending preview deployment and account creation.

Name: Adam Review

Purpose: Project review only.

Permissions: The minimum admin permissions needed to review the existing admin interface. No infrastructure, production database, secrets, billing, deployment, Vercel, or ownership access.

## Data isolation

The preview is intended to run without `DATABASE_URL`, which selects the application's in-process PGlite database. The preview database is seeded with synthetic demo records only. Production uses a separate Postgres connection and is not used by the review preview.

## Limitations and dependencies

- Square payment execution is not enabled for safe review. **SQUARE API ACCESS REQUIRED FROM ADAM** if live Square payment behavior must be verified.
- The review environment does not provide production storage, production database access, production credentials, Stripe secrets, Square secrets, Vercel access, or infrastructure access.
- Demo data is temporary and may reset when the preview instance is recreated.

## Credential handling

Any temporary password or one-time access token must be delivered separately through a secure channel. Never commit it to this repository.
