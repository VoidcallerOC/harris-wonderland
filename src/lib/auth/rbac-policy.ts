export const RBAC_ROLES = ["owner", "manager", "animal_manager", "staff", "admin_developer"] as const;
export type RbacRole = (typeof RBAC_ROLES)[number];

export const RBAC_PERMISSIONS = [
  "dashboard.view", "animals.view", "animals.create", "animals.edit", "animals.availability", "animals.sell",
  "holds.view", "holds.create", "holds.edit", "holds.extend", "holds.release", "holds.override",
  "payments.view", "payments.deposit", "payments.balance", "payments.refund", "payments.price_override",
  "content.view", "content.edit", "navigation.edit", "seo.edit",
  "users.view", "users.create", "users.edit", "users.delete", "roles.manage",
  "system.logs", "system.database", "system.deploy", "system.secrets",
] as const;
export type Permission = (typeof RBAC_PERMISSIONS)[number];

const allBusinessPermissions: readonly Permission[] = RBAC_PERMISSIONS.filter(
  (permission) => !permission.startsWith("users.") && permission !== "roles.manage" && !permission.startsWith("system."),
);

export const ROLE_PERMISSIONS: Record<RbacRole, readonly Permission[]> = {
  owner: RBAC_PERMISSIONS,
  manager: [...allBusinessPermissions, "system.logs"],
  animal_manager: [
    "dashboard.view", "animals.view", "animals.create", "animals.edit", "animals.availability", "animals.sell",
    "holds.view", "holds.create", "holds.edit", "holds.extend", "holds.release",
    "payments.view", "payments.deposit", "payments.balance", "content.view", "system.logs",
  ],
  staff: ["dashboard.view", "animals.view", "holds.view", "holds.create", "holds.edit", "holds.release", "payments.view"],
  admin_developer: ["dashboard.view", "animals.view", "system.logs", "system.database", "system.deploy", "system.secrets"],
};

export type AuditAction =
  | "role_created" | "role_changed" | "user_created" | "user_deleted"
  | "animal_created" | "animal_updated" | "animal_sold" | "animal_availability_changed"
  | "hold_created" | "hold_updated" | "hold_extended" | "hold_released" | "hold_overridden"
  | "payment_initiated" | "deposit_created" | "balance_recorded" | "refund_created" | "price_overridden"
  | "content_updated" | "navigation_updated" | "seo_updated" | "system_configuration_changed";

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export function canChangeRoleSafely(currentRole: RbacRole | null, nextRole: RbacRole, currentOwnerCount: number) {
  return !(currentRole === "owner" && nextRole !== "owner" && currentOwnerCount <= 1);
}

export function canDeleteUserSafely(targetRole: RbacRole | null, currentOwnerCount: number) {
  return !(targetRole === "owner" && currentOwnerCount <= 1);
}
