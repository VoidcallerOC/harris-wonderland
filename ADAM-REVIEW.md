# Adam Review

This is a **temporary Vercel Preview** of the existing Harris in Wonderland application. It is the real admin system with **isolated demo data**. It is **not** production.

**Do not merge `adam-review` into `main`.**

## Review Environment

- **Preview URL:** https://harris-wonderland-git-adam-review-nickhsousa96-8307s-projects.vercel.app
- **Review branch:** `adam-review` on [VoidcallerOC/harris-wonderland](https://github.com/VoidcallerOC/harris-wonderland)
- **Vercel project:** existing `harris-wonderland` (Preview deployment only)
- **Sign-in:** https://harris-wonderland-git-adam-review-nickhsousa96-8307s-projects.vercel.app/login

### Review account

| Field | Value |
|---|---|
| Name | Adam Review |
| Email | `adam.review@harris-review.invalid` |
| Password | `HarrisReview-Adam-2026` |
| Role | **manager** (business admin) |

This password is a **review-only demo credential** for synthetic data. It cannot open production, GitHub, Vercel, Supabase, Square, or billing.

Manager can use dashboard, animals/catalog, holds, payments (view), site copy, and the audit log. Manager **cannot** manage users, assign roles, or access system deploy/secrets.

## What Is Ready

- Public storefront (home, collection, care, shop, visit, story, merch, rentals)
- Staff login at `/login`
- Admin dashboard at `/admin`
- Holds list and authorized status changes
- Animals/catalog view from the live public Square catalog
- Payment-attempt visibility (demo rows; no live charges)
- Site copy editor
- Audit log
- Server-enforced RBAC (manager vs owner vs staff)

## What Adam Should Test

- [ ] Log in with the review account above
- [ ] Open the admin dashboard
- [ ] Review animals / catalog
- [ ] Review demo holds and change a demo hold status
- [ ] Review payment-attempt visibility
- [ ] Edit a demo site-copy field, then confirm it on the public site
- [ ] Open the audit log
- [ ] Confirm the Users page is **not** available (manager is not owner)
- [ ] Review mobile and desktop layout
- [ ] Identify anything that does not behave as expected

Record specific, reproducible issues: page, action, expected, actual.

**Good:** “Hold status does not change when I mark it held.”

**Not specific:** “I don't like the admin.”

## External Dependencies

**SQUARE API ACCESS REQUIRED FROM ADAM** if live Square payment charging, refunds, or checkout links must be verified.

The public catalog still reads Square's public storefront API (inventory/pricing display). Preview **cannot** charge cards, create live payment links, or refund. That is an external credential dependency, not a coding defect.

## Production Access

Intentionally excluded from this review environment:

- Production database and customer records
- Production authentication secrets
- Square / Stripe secret credentials
- Supabase service-role keys
- GitHub / Vercel / infrastructure ownership
- DNS, billing, and production domain changes

Writes in this preview stay in an isolated in-process demo database. They do not modify production.

## Limitations

- Preview data is **ephemeral**. A new serverless instance reseeds the same demo records; extra rows Adam creates may not survive a cold start.
- Live Square charges are disabled on purpose.
- Users & roles administration is owner-only and is not part of this manager review account.
