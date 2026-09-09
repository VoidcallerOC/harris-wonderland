# RBAC Operation Matrix

This matrix records the final server-entry-point audit. The permission registry in `src/lib/auth/rbac-policy.ts` is the only role/permission source of truth.

| Operation | File / server entry point | Required permission | Existing protection | Status |
|---|---|---|---|---|
| Admin dashboard | `src/lib/auth/rbac.ts` / `getAdminDashboard` | `dashboard.view` for useful dashboard access | Better Auth + role lookup; UI cards also use `Can` | Protected |
| View holds | `sugar-glider-holds.ts` / `listSugarGliderHolds` | `holds.view` | `authMiddleware` + `requirePermissionForUser` | Protected |
| Edit normal hold status | `sugar-glider-holds.ts` / `updateSugarGliderHold` | `holds.edit` | Server-side permission check | Protected |
| Release/cancel hold | `updateSugarGliderHold` | `holds.release` | Server-side branch check | Protected |
| Extend hold to ready | `updateSugarGliderHold` | `holds.extend` | Server-side branch check | Protected |
| Expire/override hold | `updateSugarGliderHold` | `holds.override` | Server-side branch check; status/transition validation | Protected |
| Role assignment/change | `rbac.ts` / `assignRole` | `roles.manage` | Better Auth + permission + closed role enum + audit | Protected |
| View users | `rbac.ts` / `listAdminUsers` | `users.view` | Better Auth + permission | Protected |
| Delete user | `rbac.ts` / `deleteAdminUser` | `users.delete` | Better Auth + permission + final-Owner invariant + audit | Protected |
| Initial Owner bootstrap | `rbac.ts` / `bootstrapOwner` | Authenticated exact configured user + one-time token | User ID/token match, existing Owner count, audit | Protected |
| View audit log | `rbac.ts` / `listAuditLog` | `system.logs` | Better Auth + permission | Protected |
| View payment attempts | `rbac.ts` / `listAdminPayments` | `payments.view` | Better Auth + permission; Staff Square-ID redaction | Protected |
| View animal admin surface | `admin.animals.tsx` / `getAdminDashboard` | `animals.view` | Better Auth + role/permission-driven UI | Protected surface |
| View payment admin surface | `admin.payments.tsx` / `listAdminPayments` | `payments.view` | Better Auth + permission | Protected |
| Technical settings surface | `admin.settings.tsx` / `getAdminDashboard` | `system.database` / relevant technical permission | Permission-aware navigation; server loaders remain protected | Protected surface |
| Square catalog read | `square-api.ts` / `getSquareCatalog` | Public catalog read | No secrets; read-only catalog fallback/live fetch | Public by design |
| Square payment configuration read | `square-api.ts` / `getSquarePayConfig` | Public client capability read | Returns IDs/capabilities only; never access token | Public by design |
| Normal customer checkout | `square-api.ts` / `startSquareCheckout` | Public customer checkout; not an admin mutation | Server resolves submitted IDs to authoritative Square catalog prices; browser price is ignored | Public by design; server-authoritative |
| Customer hold request | `sugar-glider-holds.ts` / `createSugarGliderHold` | Public customer request | Server resolves animal, price, deposit, expiration, and unique active animal constraint | Public by design; server-authoritative |
| Customer hold deposit/full/balance payment | `sugar-glider-holds.ts` / `paySugarGliderHold` | Public payment against a server-issued hold; not an administrative payment mutation | Server resolves amount from hold, validates lifecycle, uses Square idempotency, records attempts, reconciles/refunds races | Public by design; server-authoritative |
| Square refund helper | `square-api.ts` / `refundSquarePayment` | Internal reconciliation only | Not exported as a server function or client route; called only by payment reconciliation | Internal-only |
| Animal create/edit/sell/price override | No server mutation exists in current architecture | Would require `animals.create`, `animals.edit`, `animals.sell`, or `payments.price_override` | Square remains authoritative inventory/payment source; no local mutation endpoint to protect | Not applicable; no endpoint exists |
| Content/navigation/SEO mutation | No server mutation exists in current architecture | Would require `content.edit`, `navigation.edit`, or `seo.edit` | No local CMS mutation endpoint exists | Not applicable; no endpoint exists |
| Payment refund/price override administration | No admin mutation exists in current architecture | Would require `payments.refund` or `payments.price_override` | No exposed refund/override server entry point exists | Not applicable; no endpoint exists |

## Security interpretation

Public customer checkout and hold/payment operations intentionally remain available without a business-admin role because the customer is the actor. They are not authorization shortcuts: the server independently authenticates where Better Auth is required for administrative actions, resolves all money and ownership from trusted server/database state, rejects invalid lifecycle states, and never accepts browser-provided financial values as authoritative.

Every currently exposed administrative mutation has an explicit server-side RBAC check. Future local animal, content, SEO, refund, or price-override mutations must be added only with the permissions listed above and must update this matrix and its direct authorization tests before release.
