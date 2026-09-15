# Adam Review Access Notes

## Preview URL

https://harris-wonderland-b2jftuvpt-nickhsousa96-8307s-projects.vercel.app

This is a Preview deployment of the existing Vercel project, built from branch `adam-review`.

## Authentication method

The preview exposes the application's existing Better Auth email/password login at `/login`. A temporary Adam review account has **not** been created because the current serverless preview database is not yet reliable or persistent.

## Adam review account

Status: **BLOCKED pending isolated review database**.

Name: Adam Review

Purpose: Project review only.

Permissions: The intended account would receive only the minimum admin permissions needed to review the existing admin interface. It would receive no infrastructure, production database, secrets, billing, deployment, Vercel, or ownership access.

## Data isolation

The current code selects PGlite when `DATABASE_URL` is absent, and production continues to require Postgres. However, the Vercel Preview runtime currently logs `ENOENT: no such file or directory, open '/var/task/_libs/pglite.data'`. Because this prevents dependable database initialization and persistence, Adam must not be given access yet.

No Supabase development branch currently exists for the Harris project. Creating one may incur a provider cost and requires approval before proceeding.

## Limitations and dependencies

- **SQUARE API ACCESS REQUIRED FROM ADAM** if live Square payment behavior must be verified.
- An isolated preview database is required before admin CRUD, authentication persistence, demo data, and permissions can be signed off.
- No production data, production database, production credentials, service-role credentials, Stripe credentials, Square credentials, Vercel access, or infrastructure access are provided.
- Demo data is intended to be synthetic and temporary; it is not safe to use until the database-backed Preview is working.

## Credential handling

Any temporary password or one-time access token must be delivered separately through a secure channel. Never commit it to this repository.
