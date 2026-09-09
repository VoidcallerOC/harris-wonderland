const DEFAULT_POSTGRES_PORT = "5432";

function decodeComponent(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Parse and validate DATABASE_URL without exposing its secret components.
 * @param {unknown} value
 * @returns {{ protocol: string, hostname: string, port: string, database: string, username: string, passwordPresent: boolean, isSupabasePooler: boolean }}
 */
export function inspectDatabaseUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("DATABASE_URL must be a non-empty PostgreSQL connection URL.");
  }

  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error("DATABASE_URL is not a valid PostgreSQL connection URL.");
  }

  if (parsed.protocol !== "postgres:" && parsed.protocol !== "postgresql:") {
    throw new Error("DATABASE_URL must use the postgres:// or postgresql:// scheme.");
  }

  const username = decodeComponent(parsed.username);
  const database = decodeComponent(parsed.pathname.replace(/^\//, ""));
  const hostname = parsed.hostname;
  const passwordPresent = parsed.password.length > 0;

  if (!username) throw new Error("DATABASE_URL must include a database username.");
  if (!hostname) throw new Error("DATABASE_URL must include a database hostname.");
  if (!database) throw new Error("DATABASE_URL must include a database name.");
  if (!passwordPresent) throw new Error("DATABASE_URL must include a database password.");

  // WHATWG URL rejects non-numeric/out-of-range ports during parsing. Keep an
  // explicit check here so this invariant remains clear if parsing changes.
  if (parsed.port && !/^\d+$/.test(parsed.port)) {
    throw new Error("DATABASE_URL has an invalid database port.");
  }

  return {
    protocol: parsed.protocol,
    hostname,
    port: parsed.port || DEFAULT_POSTGRES_PORT,
    database,
    username,
    passwordPresent,
    isSupabasePooler: hostname.endsWith("pooler.supabase.com"),
  };
}

/**
 * Return only safe connection metadata for deployment diagnostics.
 * @param {unknown} value
 */
export function sanitizedDatabaseMetadata(value) {
  return inspectDatabaseUrl(value);
}

/** @param {unknown} metadata */
export function formatDatabaseMetadata(metadata) {
  return JSON.stringify(metadata);
}
