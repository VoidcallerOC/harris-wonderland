#!/usr/bin/env node
/**
 * Nitro's Vercel preset rewrites `new URL("./pglite.data", import.meta.url)` to
 * `/var/task/_libs/pglite.data` but does not copy the WASM/data files. Copy them
 * into every serverless function output after `vite build`.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const FILES = ["pglite.data", "pglite.wasm", "initdb.wasm"];

function resolvePgliteDist() {
  try {
    return dirname(require.resolve("@electric-sql/pglite"));
  } catch {
    // package.json is not in "exports"; fall through
  }
  const fallback = join(process.cwd(), "node_modules/@electric-sql/pglite/dist");
  return fallback;
}

function collectFuncDirs(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  let names;
  try {
    names = readdirSync(dir);
  } catch {
    return acc;
  }
  for (const name of names) {
    const path = join(dir, name);
    let st;
    try {
      st = statSync(path);
    } catch {
      continue;
    }
    if (!st.isDirectory()) continue;
    if (name.endsWith(".func")) acc.push(path);
    collectFuncDirs(path, acc);
  }
  return acc;
}

export function copyPgliteAssets() {
  const pgliteDist = resolvePgliteDist();
  const missing = FILES.filter((file) => !existsSync(join(pgliteDist, file)));
  if (missing.length) {
    console.warn(`[copy-pglite-assets] missing source files in ${pgliteDist}: ${missing.join(", ")}`);
  }

  const roots = [
    join(process.cwd(), ".vercel/output/functions"),
    join(process.cwd(), ".output"),
  ];
  const funcDirs = roots.flatMap((root) => collectFuncDirs(root));
  const known = join(process.cwd(), ".vercel/output/functions/__server.func");
  if (existsSync(known) && !funcDirs.includes(known)) funcDirs.push(known);

  if (!funcDirs.length) {
    console.warn("[copy-pglite-assets] no Vercel/Nitro function output found — skipping");
    return 0;
  }

  let copied = 0;
  for (const funcDir of funcDirs) {
    const destinations = [funcDir, join(funcDir, "_libs")];
    for (const dest of destinations) {
      mkdirSync(dest, { recursive: true });
      for (const file of FILES) {
        const src = join(pgliteDist, file);
        if (!existsSync(src)) continue;
        copyFileSync(src, join(dest, file));
        copied += 1;
      }
    }
    console.log(`[copy-pglite-assets] copied PGlite assets into ${funcDir}`);
  }
  return copied;
}

const isCli =
  process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isCli) {
  const count = copyPgliteAssets();
  if (count === 0) {
    console.warn("[copy-pglite-assets] copied 0 files");
  }
}
