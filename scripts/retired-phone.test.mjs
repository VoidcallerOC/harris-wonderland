import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const SOURCE_ROOT = new URL("../src", import.meta.url).pathname;
const RETIRED_PHONE = /(?:\+?1[-.\s]?)?\(?860\)?[-.\s]?888[-.\s]?5130/;

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return sourceFiles(path);
      return /\.(?:ts|tsx|css|json)$/.test(entry.name) ? [path] : [];
    }),
  );
  return nested.flat();
}

test("does not publish the retired second phone number", async () => {
  const matches = [];
  for (const path of await sourceFiles(SOURCE_ROOT)) {
    const content = await readFile(path, "utf8");
    if (RETIRED_PHONE.test(content)) matches.push(path);
  }
  assert.deepEqual(matches, []);
});
