import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql, type Sql } from "@/lib/db";
import { authMiddleware } from "./middleware";
import { canChangeRoleSafely, canDeleteUserSafely, RBAC_ROLES, ROLE_PERMISSIONS, type AuditAction, type JsonValue, type Permission, type RbacRole } from "./rbac-policy";

export { RBAC_ROLES, RBAC_PERMISSIONS, ROLE_PERMISSIONS } from "./rbac-policy";
export { canChangeRoleSafely, canDeleteUserSafely } from "./rbac-policy";
export type { AuditAction, JsonValue, Permission, RbacRole } from "./rbac-policy";

export type AuditEntry = {
  id: string;
  actorUserId: string;
  action: AuditAction;
  resourceType: string;
  resourceId: string | null;
  previousValue: JsonValue;
  newValue: JsonValue;
  createdAt: string;
};

type RoleRow = { user_id: string; role: RbacRole };
type UserRow = { id: string; name: string; email: string; role: RbacRole | null; role_updated_at: string | null };
type CurrentUserRow = { id: string; name: string; email: string; image: string | null };
type AuditRow = {
  id: string;
  actor_user_id: string;
  action: AuditAction;
  resource_type: string;
  resource_id: string | null;
  previous_value: JsonValue;
  new_value: JsonValue;
  created_at: string;
};
type PaymentAttemptRow = {
  id: string;
  hold_id: string;
  payment_mode: "full" | "deposit" | "balance";
  amount_cents: number;
  status: "pending" | "succeeded" | "failed";
  square_payment_id: string | null;
  square_order_id: string | null;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
};

export class ForbiddenError extends Error {
  status = 403 as const;
  constructor(message = "You do not have permission to perform this action.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

function permissionsForRole(role: RbacRole | null): readonly Permission[] {
  return role ? ROLE_PERMISSIONS[role] : [];
}

function toAudit(row: AuditRow): AuditEntry {
  return {
    id: row.id,
    actorUserId: row.actor_user_id,
    action: row.action,
    resourceType: row.resource_type,
    resourceId: row.resource_id,
    previousValue: row.previous_value,
    newValue: row.new_value,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function getRoleForUser(sql: Sql, userId: string): Promise<RbacRole | null> {
  const rows = await sql.query<RoleRow>("select user_id, role from app_user_roles where user_id = $1", [userId]);
  return rows[0]?.role ?? null;
}

export async function getCurrentUser(sql: Sql, userId: string): Promise<CurrentUserRow | null> {
  const rows = await sql.query<CurrentUserRow>(`select id, name, email, image from "user" where id = $1`, [userId]);
  return rows[0] ?? null;
}

export async function getCurrentPermissions(sql: Sql, userId: string): Promise<readonly Permission[]> {
  return permissionsForRole(await getRoleForUser(sql, userId));
}

export async function hasPermissionForUser(sql: Sql, userId: string, permission: Permission): Promise<boolean> {
  return (await getCurrentPermissions(sql, userId)).includes(permission);
}

export async function requirePermissionForUser(sql: Sql, userId: string, permission: Permission): Promise<void> {
  if (!(await hasPermissionForUser(sql, userId, permission))) {
    throw new ForbiddenError(`Permission required: ${permission}`);
  }
}

export const hasPermission = hasPermissionForUser;
export const requirePermission = requirePermissionForUser;

export async function requireRoleForUser(sql: Sql, userId: string, role: RbacRole): Promise<void> {
  if ((await getRoleForUser(sql, userId)) !== role) throw new ForbiddenError(`Role required: ${role}`);
}

export async function recordAudit(
  sql: Sql,
  input: {
    actorUserId: string;
    action: AuditAction;
    resourceType: string;
    resourceId?: string | null;
  previousValue?: JsonValue;
  newValue?: JsonValue;
  },
): Promise<void> {
  await sql.query(
    `insert into app_audit_log (id, actor_user_id, action, resource_type, resource_id, previous_value, new_value)
     values ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb)`,
    [
      crypto.randomUUID(),
      input.actorUserId,
      input.action,
      input.resourceType,
      input.resourceId ?? null,
      input.previousValue === undefined ? null : JSON.stringify(input.previousValue),
      input.newValue === undefined ? null : JSON.stringify(input.newValue),
    ],
  );
}

async function ownerCount(sql: Sql): Promise<number> {
  const rows = await sql.query<{ count: number }>("select count(*)::int as count from app_user_roles where role = 'owner'");
  return Number(rows[0]?.count ?? 0);
}

const RoleInput = z.object({
  userId: z.string().trim().min(1).max(200),
  role: z.enum(RBAC_ROLES),
});
const UserIdInput = z.object({ userId: z.string().trim().min(1).max(200) });
const BootstrapInput = z.object({ token: z.string().min(1).max(500) });

export const getAdminDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const role = await getRoleForUser(sql, context.userId);
    const permissions = await getCurrentPermissions(sql, context.userId);
    return { userId: context.userId, role, permissions };
  });

export const bootstrapOwner = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(BootstrapInput)
  .handler(async ({ context, data }) => {
    const expectedUserId = process.env.RBAC_BOOTSTRAP_OWNER_USER_ID?.trim();
    const expectedToken = process.env.RBAC_BOOTSTRAP_TOKEN?.trim();
    if (!expectedUserId || !expectedToken || data.token !== expectedToken || context.userId !== expectedUserId) {
      throw new ForbiddenError("Owner bootstrap is not available for this account.");
    }
    const sql = await getSql();
    if ((await ownerCount(sql)) > 0) throw new Error("An Owner already exists; bootstrap is non-replayable.");
    await sql.query(
      `insert into app_user_roles (user_id, role, assigned_by) values ($1, 'owner', $1)
       on conflict (user_id) do nothing`,
      [context.userId],
    );
    if ((await ownerCount(sql)) !== 1) throw new Error("Owner bootstrap did not complete safely.");
    await recordAudit(sql, {
      actorUserId: context.userId,
      action: "role_created",
      resourceType: "user_role",
      resourceId: context.userId,
      newValue: { role: "owner", bootstrap: true },
    });
    return { ok: true as const, role: "owner" as const };
  });

export const assignRole = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(RoleInput)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requirePermissionForUser(sql, context.userId, "roles.manage");
    const existing = await sql.query<{ role: RbacRole | null }>(
      `select r.role from "user" u left join app_user_roles r on r.user_id = u.id where u.id = $1`,
      [data.userId],
    );
    if (!existing[0]) throw new Error("User not found.");
    const previousRole = existing[0].role;
    if (!canChangeRoleSafely(previousRole, data.role, await ownerCount(sql))) {
      throw new Error("The final Owner cannot be demoted.");
    }
    await sql.query(
      `insert into app_user_roles (user_id, role, assigned_by) values ($1, $2, $3)
       on conflict (user_id) do update set role = excluded.role, assigned_by = excluded.assigned_by, updated_at = now()`,
      [data.userId, data.role, context.userId],
    );
    await recordAudit(sql, {
      actorUserId: context.userId,
      action: previousRole ? "role_changed" : "role_created",
      resourceType: "user_role",
      resourceId: data.userId,
      previousValue: previousRole ? { role: previousRole } : undefined,
      newValue: { role: data.role },
    });
    return { userId: data.userId, role: data.role };
  });

export const listAdminUsers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requirePermissionForUser(sql, context.userId, "users.view");
    const rows = await sql.query<UserRow>(
      `select u.id, u.name, u.email, r.role, r.updated_at as role_updated_at
       from "user" u left join app_user_roles r on r.user_id = u.id order by u.createdAt desc`,
    );
    return rows.map((row) => ({ ...row, roleUpdatedAt: row.role_updated_at ? new Date(row.role_updated_at).toISOString() : null }));
  });

export const deleteAdminUser = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(UserIdInput)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requirePermissionForUser(sql, context.userId, "users.delete");
    const target = await sql.query<{ role: RbacRole | null }>(
      `select r.role from "user" u left join app_user_roles r on r.user_id = u.id where u.id = $1`,
      [data.userId],
    );
    if (!target[0]) throw new Error("User not found.");
    if (!canDeleteUserSafely(target[0].role, await ownerCount(sql))) {
      throw new Error("The final Owner cannot be deleted.");
    }
    await recordAudit(sql, {
      actorUserId: context.userId,
      action: "user_deleted",
      resourceType: "user",
      resourceId: data.userId,
      previousValue: { role: target[0].role },
      newValue: { deleted: true },
    });
    await sql.query(`delete from "user" where id = $1`, [data.userId]);
    return { ok: true as const };
  });

export const listAuditLog = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requirePermissionForUser(sql, context.userId, "system.logs");
    const rows = await sql.query<AuditRow>(
      `select id, actor_user_id, action, resource_type, resource_id, previous_value, new_value, created_at
       from app_audit_log order by created_at desc limit 200`,
    );
    return rows.map(toAudit);
  });

export const listAdminPayments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await requirePermissionForUser(sql, context.userId, "payments.view");
    const rows = await sql.query<PaymentAttemptRow>(
      `select id, hold_id, payment_mode, amount_cents, status, square_payment_id, square_order_id, error_message, created_at, completed_at
       from sugar_glider_payment_attempts order by created_at desc limit 200`,
    );
    const staff = await getRoleForUser(sql, context.userId) === "staff";
    return rows.map((row) => ({
      id: row.id,
      holdId: row.hold_id,
      paymentMode: row.payment_mode,
      amountCents: Number(row.amount_cents),
      status: row.status,
      squarePaymentId: staff ? null : row.square_payment_id,
      squareOrderId: staff ? null : row.square_order_id,
      errorMessage: row.error_message,
      createdAt: new Date(row.created_at).toISOString(),
      completedAt: row.completed_at ? new Date(row.completed_at).toISOString() : null,
    }));
  });

export async function requireAdminPermission(permission: Permission, userId: string): Promise<Sql> {
  const sql = await getSql();
  await requirePermissionForUser(sql, userId, permission);
  return sql;
}
