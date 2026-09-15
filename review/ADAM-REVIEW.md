Welcome to the project review environment.

This is a temporary Vercel Preview deployment of the existing Harris in Wonderland application. It contains demonstration data created for review and is intended for project review only. It is not the production site and must not be used for real customer, payment, or operational activity.

### What to Review

1. Does the admin system work?
2. Does it contain what we agreed?
3. Does it do what you need?
4. Are there any specific defects or missing requirements?

Please document specific, reproducible issues rather than general preferences. Include the page, the action you took, what you expected, and what happened.

**Good:** “Inventory editing fails when changing quantity.”

**Not specific:** “I don't like the admin.”

### Review Scope

Review the dashboard, admin navigation, holds, animal/catalog visibility, payment-attempt visibility, audit log, users and roles where your account permits it, site-copy settings, error messages, and desktop/mobile layout. Use clearly labeled demo records only. CRUD behavior should be tested where the existing application exposes it.

### Important Safety Notes

The preview is configured to use an isolated in-process review database when no preview database URL is supplied. It is seeded with synthetic records only. Do not enter real customer information, real payment details, or production credentials. Square payment actions are not part of the safe review path and require Square API access from Adam/client if they must be verified.

Use the accompanying `adam-review-checklist.md` to record findings. This branch is review-only and must not be merged into production.
