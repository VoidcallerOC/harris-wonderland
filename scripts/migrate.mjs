#!/usr/bin/env node
/**
 * Deploy-time database migrator (node-postgres, `pg`).
 *
 * Runs during `npm run build` — on every Vercel deploy — applying pending files
 * in ../migrations to DATABASE_URL. Each file is applied in one transaction and
 * recorded in a `_migrations` table, so it runs once and is safe to re-run.
 *
 * The default read is non-recursive; the opt-in auth schema under migrations/auth/
 * is included only when VITE_AUTH_ENABLED is not explicitly false.
 *
 * No DATABASE_URL in local / preview builds -> skip; the PGLite fallback applies
 * the same files at startup instead (see src/lib/db.ts). Production builds fail
 * clearly rather than producing a deployment that can fall back to PGlite.
 */
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";
import { inspectDatabaseUrl } from "./database-url.mjs";
import { pendingMigrations } from "./migration-plan.mjs";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  if (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production") {
    console.error(
      "[migrate] Production database configuration error: DATABASE_URL is required.",
    );
    process.exit(1);
  }
  console.log(
    "[migrate] DATABASE_URL not set — skipping (the PGLite fallback migrates itself).",
  );
  process.exit(0);
}

let databaseMetadata;
try {
  databaseMetadata = inspectDatabaseUrl(databaseUrl);
} catch (err) {
  console.error(`[migrate] ${err.message}`);
  process.exit(1);
}

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), "..", "migrations");

async function main() {
  let entries;
  try {
    entries = await readdir(migrationsDir);
  } catch {
    console.log("[migrate] no migrations/ directory — nothing to do.");
    return;
  }
  const migrationPaths =
    process.env.VITE_AUTH_ENABLED === "false"
      ? entries
      : [...entries, "auth/0001_auth.sql"];
  // An app with no schema of its own must not pay for a database connection.
  if (pendingMigrations(migrationPaths, []).length === 0) {
    console.log("[migrate] no migrations — nothing to do.");
    return;
  }

  const pool = new pg.Pool({ connectionString: databaseUrl, max: 1 });
  let client;
  try {
    client = await pool.connect();
  } catch (err) {
    console.error(
      "[migrate] database connection failed; sanitized connection metadata:",
      JSON.stringify(databaseMetadata),
    );
    throw err;
  }
  try {
    await client.query(
      "CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())",
    );
    const applied = (await client.query("SELECT name FROM _migrations")).rows.map(
      (r) => r.name,
    );

    let count = 0;
    for (const { name, path } of pendingMigrations(migrationPaths, applied)) {
      const text = await readFile(join(migrationsDir, path), "utf8");
      try {
        await client.query("BEGIN");
        // pg's simple-query protocol runs a whole multi-statement file at once.
        await client.query(text);
        await client.query("INSERT INTO _migrations (name) VALUES ($1)", [name]);
        await client.query("COMMIT");
      } catch (err) {
        console.error(`[migrate] error applying ${name}`);
        try {
          await client.query("ROLLBACK");
        } catch {
          // ROLLBACK fails when the connection died — keep the original error.
        }
        throw err;
      }
      console.log(`[migrate] applied ${name}`);
      count += 1;
    }
    console.log(count ? `[migrate] done — ${count} migration(s) applied.` : "[migrate] up to date.");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  // Never print the driver message: connection errors can contain connection
  // details. The code plus sanitized metadata above are sufficient.
  console.error(`[migrate] failed${err?.code ? ` (code ${err.code})` : ""}.`);
  process.exit(1);
});
