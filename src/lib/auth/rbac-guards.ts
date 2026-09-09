import type { Sql } from "../db.ts";
import { canChangeRoleSafely, canDeleteUserSafely, ROLE_PERMISSIONS, type Permission, type RbacRole } from "./rbac-policy.ts";

type RoleRow = { user_id: string; role: RbacRole };

export class ForbiddenError extends Error {
  status = 403 as const;
  constructor(message = "You do not have permission to perform this action.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export async function getRoleForUser(sql: Sql, userId: string): Promise<RbacRole | null> {
  const rows = await sql.query<RoleRow>("select user_id, role from app_user_roles where user_id = $1", [userId]);
  return rows[0]?.role ?? null;
}

export async function getCurrentPermissions(sql: Sql, userId: string): Promise<readonly Permission[]> {
  const role = await getRoleForUser(sql, userId);
  return role ? ROLE_PERMISSIONS[role] : [];
}

export async function hasPermissionForUser(sql: Sql, userId: string, permission: Permission): Promise<boolean> {
  return (await getCurrentPermissions(sql, userId)).includes(permission);
}

export async function requirePermissionForUser(sql: Sql, userId: string, permission: Permission): Promise<void> {
  if (!(await hasPermissionForUser(sql, userId, permission))) throw new ForbiddenError(`Permission required: ${permission}`);
}

export const hasPermission = hasPermissionForUser;
export const requirePermission = requirePermissionForUser;

export async function requireRoleForUser(sql: Sql, userId: string, role: RbacRole): Promise<void> {
  if ((await getRoleForUser(sql, userId)) !== role) throw new ForbiddenError(`Role required: ${role}`);
}

export function holdTransitionPermission(nextStatus: string, override: boolean): Permission {
  if (override) return "holds.override";
  if (nextStatus === "cancelled") return "holds.release";
  if (nextStatus === "ready") return "holds.extend";
  return "holds.edit";
}

export async function ownerCount(sql: Sql): Promise<number> {
  const rows = await sql.query<{ count: number }>("select count(*)::int as count from app_user_roles where role = 'owner'");
  return Number(rows[0]?.count ?? 0);
}

export async function authorizeRoleAssignment(sql: Sql, actorUserId: string, targetUserId: string, nextRole: RbacRole): Promise<RbacRole | null> {
  await requirePermissionForUser(sql, actorUserId, "roles.manage");
  const existing = await sql.query<{ role: RbacRole | null }>(
    `select r.role from "user" u left join app_user_roles r on r.user_id = u.id where u.id = $1`,
    [targetUserId],
  );
  if (!existing[0]) throw new Error("User not found.");
  const previousRole = existing[0].role;
  if (!canChangeRoleSafely(previousRole, nextRole, await ownerCount(sql))) throw new Error("The final Owner cannot be demoted.");
  return previousRole;
}

export async function authorizeUserDeletion(sql: Sql, actorUserId: string, targetUserId: string): Promise<RbacRole | null> {
  await requirePermissionForUser(sql, actorUserId, "users.delete");
  const target = await sql.query<{ role: RbacRole | null }>(
    `select r.role from "user" u left join app_user_roles r on r.user_id = u.id where u.id = $1`,
    [targetUserId],
  );
  if (!target[0]) throw new Error("User not found.");
  if (!canDeleteUserSafely(target[0].role, await ownerCount(sql))) throw new Error("The final Owner cannot be deleted.");
  return target[0].role;
}
