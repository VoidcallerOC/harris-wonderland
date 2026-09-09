import assert from "node:assert/strict";
import test from "node:test";
import {
  formatDatabaseMetadata,
  inspectDatabaseUrl,
  sanitizedDatabaseMetadata,
} from "./database-url.mjs";

const password = "super-secret-password";
const poolerUrl =
  `postgresql://postgres.project-ref:${encodeURIComponent(password)}` +
  "@aws-0-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require";

test("accepts a Supabase Transaction Pooler URI and reports safe metadata", () => {
  const metadata = inspectDatabaseUrl(poolerUrl);
  assert.deepEqual(metadata, {
    protocol: "postgresql:",
    hostname: "aws-0-us-east-2.pooler.supabase.com",
    port: "6543",
    database: "postgres",
    username: "postgres.project-ref",
    passwordPresent: true,
    isSupabasePooler: true,
  });
  assert.equal(formatDatabaseMetadata(metadata).includes(password), false);
});

test("rejects malformed and incomplete credentials without echoing secrets", () => {
  const cases = [
    "not a url",
    "https://postgres:secret@example.com/postgres",
    "postgresql://postgres@example.com/postgres",
    "postgresql://:secret@example.com/postgres",
    "postgresql://postgres:secret@/postgres",
    "postgresql://postgres:secret@example.com/",
  ];
  for (const value of cases) {
    assert.throws(() => inspectDatabaseUrl(value), (error) => {
      assert.doesNotMatch(error.message, /secret|example\.com/);
      return true;
    });
  }
});

test("preserves the supplied username and excludes password/query secrets", () => {
  const uniquePassword = "pw-never-log-this";
  const url =
    `postgres://postgres.custom-ref:${uniquePassword}@db.example.com:5432/app` +
    "?sslmode=require&api_key=query-secret";
  const metadata = sanitizedDatabaseMetadata(url);
  const serialized = formatDatabaseMetadata(metadata);
  assert.equal(metadata.username, "postgres.custom-ref");
  assert.equal(metadata.passwordPresent, true);
  assert.doesNotMatch(serialized, /pw-never-log-this|query-secret|api_key/);
  assert.doesNotMatch(JSON.stringify(metadata), /pw-never-log-this|query-secret|api_key/);
});
