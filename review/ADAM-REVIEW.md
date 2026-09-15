# Adam Review

Welcome to the project review environment.

This is a temporary Vercel Preview deployment of the existing Harris in Wonderland application. It contains demonstration data created for review and is intended for project review only. It is not the production site and must not be used for real customer, payment, or operational activity.

**Do not merge `adam-review` into `main`.**

## Review Environment

- Preview URL: https://harris-wonderland-git-adam-review-nickhsousa96-8307s-projects.vercel.app
- Login: `/login`
- Branch: `adam-review`
- Account: Adam Review (`adam.review@harris-review.invalid`) / role **manager**
- Password: `HarrisReview-Adam-2026` (review-only demo credential for synthetic data)

### What to Review

1. Does the admin system work?
2. Does it contain what we agreed?
3. Does it do what you need?
4. Are there any specific defects or missing requirements?

Please document specific, reproducible issues rather than general preferences. Include the page, the action you took, what you expected, and what happened.

**Good:** “Inventory editing fails when changing quantity.”

**Not specific:** “I don't like the admin.”

### Review Scope

Review the dashboard, admin navigation, holds, animal/catalog visibility, payment-attempt visibility, audit log, site-copy settings, error messages, and desktop/mobile layout. Users and roles are owner-only and are not included in this manager account. Use clearly labeled demo records only.

### Important Safety Notes

The preview uses an isolated in-process review database. It is seeded with synthetic records only. Do not enter real customer information, real payment details, or production credentials.

**SQUARE API ACCESS REQUIRED FROM ADAM** if live Square payment behavior must be verified. Preview cannot charge cards.

Use the accompanying `adam-review-checklist.md` to record findings. This branch is review-only and must not be merged into production.
