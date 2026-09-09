import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { authorizeRoleAssignment, authorizeUserDeletion, ForbiddenError, holdTransitionPermission } from "./rbac-guards.ts";
import type { Sql } from "../db";
import type { RbacRole } from "./rbac-policy.ts";

function fakeSql(actorRole: RbacRole, targetRole: RbacRole | null, owners = 1): Sql {
  return {
    async query<T>(text: string): Promise<T[]> {
      if (text.includes("from app_user_roles where user_id")) return [{ user_id: "actor", role: actorRole } as T];
      if (text.includes("left join app_user_roles") && text.includes("where u.id")) return [{ role: targetRole } as T];
      if (text.includes("count(*)")) return [{ count: owners } as T];
      return [] as T[];
    },
  } as Sql;
}

describe("server RBAC mutation guards", () => {
  it("rejects Staff role assignment through the actual authorization helper", async () => {
    await assert.rejects(
      authorizeRoleAssignment(fakeSql("staff", "staff"), "actor", "target", "manager"),
      (error: unknown) => error instanceof ForbiddenError && /roles\.manage/.test(error.message),
    );
  });

  it("rejects Admin/Developer refund-equivalent role escalation through the actual helper", async () => {
    await assert.rejects(
      authorizeRoleAssignment(fakeSql("admin_developer", "staff"), "actor", "target", "owner"),
      (error: unknown) => error instanceof ForbiddenError && /roles\.manage/.test(error.message),
    );
  });

  it("rejects final Owner demotion through the real role mutation guard", async () => {
    await assert.rejects(
      authorizeRoleAssignment(fakeSql("owner", "owner", 1), "actor", "target", "manager"),
      /final Owner cannot be demoted/,
    );
  });

  it("allows Owner replacement when another Owner already exists", async () => {
    assert.equal(await authorizeRoleAssignment(fakeSql("owner", "owner", 2), "actor", "target", "manager"), "owner");
  });

  it("rejects final Owner deletion through the real user deletion guard", async () => {
    await assert.rejects(
      authorizeUserDeletion(fakeSql("owner", "owner", 1), "actor", "target"),
      /final Owner cannot be deleted/,
    );
  });

  it("rejects Staff deletion before inspecting the target user", async () => {
    await assert.rejects(
      authorizeUserDeletion(fakeSql("staff", "manager"), "actor", "target"),
      (error: unknown) => error instanceof ForbiddenError && /users\.delete/.test(error.message),
    );
  });

  it("maps hold extension and override paths to their distinct server permissions", () => {
    assert.equal(holdTransitionPermission("ready", false), "holds.extend");
    assert.equal(holdTransitionPermission("cancelled", false), "holds.release");
    assert.equal(holdTransitionPermission("held", true), "holds.override");
    assert.equal(holdTransitionPermission("held", false), "holds.edit");
  });
});
