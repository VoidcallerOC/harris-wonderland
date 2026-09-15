import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export type PgliteAssetOptions = {
  pgliteWasmModule: WebAssembly.Module;
  initdbWasmModule?: WebAssembly.Module;
  fsBundle: Blob;
};

function candidateDirs(): string[] {
  const dirs: string[] = [
    "/var/task/_libs",
    join(process.cwd(), "_libs"),
    join(process.cwd(), "node_modules/@electric-sql/pglite/dist"),
  ];
  try {
    dirs.unshift(join(dirname(fileURLToPath(import.meta.url)), "_libs"));
    dirs.unshift(dirname(fileURLToPath(import.meta.url)));
  } catch {
    // import.meta.url is unavailable in some bundled shapes
  }
  try {
    const req = createRequire(import.meta.url);
    dirs.unshift(join(dirname(req.resolve("@electric-sql/pglite"))));
  } catch {
    // bundled serverless output may not resolve the package
  }
  return [...new Set(dirs)];
}

/**
 * Load PGlite WASM + filesystem bundle from disk so Vercel does not depend on
 * Nitro rewriting `new URL("./pglite.data", import.meta.url)` to
 * `/var/task/_libs/pglite.data` without copying the file.
 */
export async function loadPgliteAssetOptions(): Promise<PgliteAssetOptions | null> {
  for (const dir of candidateDirs()) {
    const dataPath = join(dir, "pglite.data");
    const wasmPath = join(dir, "pglite.wasm");
    const initdbPath = join(dir, "initdb.wasm");
    if (!existsSync(dataPath) || !existsSync(wasmPath)) continue;
    const fsBundle = new Blob([readFileSync(dataPath)]);
    const pgliteWasmModule = await WebAssembly.compile(readFileSync(wasmPath));
    const options: PgliteAssetOptions = { fsBundle, pgliteWasmModule };
    if (existsSync(initdbPath)) {
      options.initdbWasmModule = await WebAssembly.compile(readFileSync(initdbPath));
    }
    console.info(`[db] PGlite assets loaded from ${dir}`);
    return options;
  }
  console.warn(
    "[db] PGlite assets were not found next to the function; falling back to the package loader.",
  );
  return null;
}
