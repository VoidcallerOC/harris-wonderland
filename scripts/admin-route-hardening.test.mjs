import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routes = ["admin.index.tsx", "admin.animals.tsx", "admin.holds.tsx", "admin.payments.tsx", "admin.audit-log.tsx", "admin.settings.tsx", "admin.users.tsx"];

test("all protected admin routes use the shared unauthorized redirect guard", async () => {
  for (const route of routes) {
    const source = await readFile(new URL(`../src/routes/${route}`, import.meta.url), "utf8");
    assert.match(source, /requireAdminRoute/, route);
  }
});

test("the shared guard preserves non-authentication failures", async () => {
  const source = await readFile(new URL("../src/lib/auth/admin-route.ts", import.meta.url), "utf8");
  assert.match(source, /error\.message === "Unauthorized"/);
  assert.match(source, /throw error/);
});
