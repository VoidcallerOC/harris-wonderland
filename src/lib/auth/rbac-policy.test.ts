import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { canChangeRoleSafely, canDeleteUserSafely, RBAC_PERMISSIONS, RBAC_ROLES, ROLE_PERMISSIONS, type Permission, type RbacRole } from "./rbac-policy.ts";

function allows(role: RbacRole, permission: Permission) {
  return ROLE_PERMISSIONS[role].includes(permission);
}

describe("RBAC role matrix", () => {
  it("defines exactly the closed business role set", () => {
    assert.deepEqual(RBAC_ROLES, ["owner", "manager", "animal_manager", "staff", "admin_developer"]);
  });

  it("gives Owner every permission", () => {
    for (const permission of RBAC_PERMISSIONS) assert.equal(allows("owner", permission), true, permission);
  });

  it("separates Admin/Developer technical authority from business and financial authority", () => {
    for (const permission of ["system.logs", "system.database", "system.deploy", "system.secrets"] as const) {
      assert.equal(allows("admin_developer", permission), true, permission);
    }
    for (const permission of ["payments.deposit", "payments.balance", "payments.refund", "payments.price_override", "roles.manage", "users.delete"] as const) {
      assert.equal(allows("admin_developer", permission), false, permission);
    }
  });

  it("keeps Staff within normal customer and hold operations", () => {
    for (const permission of ["holds.create", "holds.edit", "holds.release", "payments.view"] as const) {
      assert.equal(allows("staff", permission), true, permission);
    }
    for (const permission of ["holds.extend", "holds.override", "payments.deposit", "payments.balance", "payments.refund", "payments.price_override", "users.view", "system.logs"] as const) {
      assert.equal(allows("staff", permission), false, permission);
    }
  });

  it("keeps Animal Manager out of refunds, overrides, roles, and system controls", () => {
    for (const permission of ["animals.create", "animals.edit", "animals.availability", "holds.extend", "payments.deposit", "payments.balance"] as const) {
      assert.equal(allows("animal_manager", permission), true, permission);
    }
    for (const permission of ["holds.override", "payments.refund", "payments.price_override", "roles.manage", "system.database", "system.deploy"] as const) {
      assert.equal(allows("animal_manager", permission), false, permission);
    }
  });

  it("allows Managers business authority but not ownership, user, or technical controls", () => {
    for (const permission of ["animals.edit", "holds.override", "payments.refund", "payments.price_override", "content.edit", "system.logs"] as const) {
      assert.equal(allows("manager", permission), true, permission);
    }
    for (const permission of ["users.view", "users.delete", "roles.manage", "system.database", "system.deploy", "system.secrets"] as const) {
      assert.equal(allows("manager", permission), false, permission);
    }
  });

  it("protects the final Owner from demotion and deletion", () => {
    assert.equal(canChangeRoleSafely("owner", "manager", 1), false);
    assert.equal(canChangeRoleSafely("owner", "manager", 2), true);
    assert.equal(canChangeRoleSafely("manager", "owner", 1), true);
    assert.equal(canDeleteUserSafely("owner", 1), false);
    assert.equal(canDeleteUserSafely("owner", 2), true);
    assert.equal(canDeleteUserSafely("manager", 1), true);
  });
});
