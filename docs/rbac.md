# Harris Wonderland RBAC

Harris Wonderland keeps Better Auth responsible for identity and sessions. Authorization is implemented separately in `src/lib/auth/rbac.ts` and uses the persistent `app_user_roles` table. Every protected server function resolves the authenticated Better Auth user to a role and then to the centralized permission matrix in `src/lib/auth/rbac-policy.ts`.

## Roles

The closed role set is:

| Role | Scope |
|---|---|
| Owner | Full business, user, role, financial, and system authority. The final Owner cannot be demoted or deleted. |
| Manager | Full operational and business authority, including financial operations, but no user/role management or system secret/database/deployment controls. |
| Animal Manager | Animal inventory, availability, holds, normal deposits, and balances. No refunds, price overrides, role management, or technical controls. |
| Staff | Normal customer and hold operations with limited payment-status visibility. No overrides, payments, refunds, price changes, user management, or technical controls. |
| Admin / Developer | Technical logs, database, deployment, and secrets controls only. This role does not receive business or financial permissions automatically. |

Permissions are defined once in `rbac-policy.ts`. New permissions must be added there, assigned deliberately to roles, and covered by matrix tests before use.

## Server enforcement

Use `requirePermissionForUser(sql, userId, permission)` or `requireRoleForUser(sql, userId, role)` in server-only handlers. `authMiddleware` supplies the verified Better Auth user ID; browser fields, hidden buttons, and client role state are never authoritative. The admin UI uses the same permission list only to hide unavailable controls; server checks remain mandatory.

Hold management is protected by `holds.*` permissions. Staff payment identifiers are redacted from the admin response while payment status needed for their workflow remains visible. Public customer payment flows continue to calculate amounts from authoritative hold/listing data and do not require business-admin permissions.

## Initial Owner bootstrap

Set these deployment variables temporarily for the first authenticated bootstrap:

- `RBAC_BOOTSTRAP_OWNER_USER_ID`: the existing Better Auth user ID that must become Owner.
- `RBAC_BOOTSTRAP_TOKEN`: a high-entropy one-time secret.

After sign-in, call the protected `bootstrapOwner` server function once from an authenticated administrative bootstrap tool or controlled deployment operation. The function requires both the exact user ID and token, refuses to run if an Owner already exists, writes an audit entry, and can never be replayed successfully. Remove or rotate the bootstrap token after use.

No existing users are automatically elevated. Existing users remain unassigned until an Owner deliberately assigns a closed-set role through `/admin/users`.

## Audit logging

Sensitive role, user, hold, and future business/system mutations write append-oriented records to `app_audit_log`. Records contain the actor, action, resource, optional previous/new JSON values, and timestamp. Passwords, secrets, payment credentials, and session tokens must never be written to audit values. The read-only `/admin/audit-log` route requires `system.logs`.

## Validation

Run:

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

The RBAC matrix tests cover Owner, Manager, Animal Manager, Staff, and Admin / Developer boundaries, including the intentional separation of technical and business authority.
