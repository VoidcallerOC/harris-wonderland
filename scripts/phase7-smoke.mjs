import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.PHASE7_BASE_URL ?? "http://127.0.0.1:8080";
const categories = [
  ["reptiles", "Reptiles"],
  ["snakes", "Snakes"],
  ["lizards", "Lizards"],
  ["turtles-tortoises", "Turtles & Tortoises"],
  ["amphibians", "Amphibians"],
  ["mammals", "Mammals"],
  ["sugar-gliders", "Sugar Gliders"],
  ["birds", "Birds"],
  ["tropical-fish", "Tropical Fish"],
];
const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium" });
try {
  for (const [width, height, label] of [[1440, 1000, "desktop"], [390, 844, "mobile"]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const [slug, name] of categories) {
      const response = await page.goto(`${baseUrl}/collection/${slug}`, { waitUntil: "networkidle" });
      assert.equal(response?.status(), 200, `${label} ${slug} should load`);
      assert.match(await page.locator("body").innerText(), new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), `${label} ${slug} should render its category label`);
      assert.match(await page.locator("body").innerText(), /Birds/i, `${label} ${slug} should render Birds in category navigation`);
      if (slug === "birds") {
        await assert.doesNotReject(() => page.getByText(/not on the floor right now/i).waitFor({ timeout: 5000 }));
      }
    }
    await page.goto(`${baseUrl}/shop`, { waitUntil: "networkidle" });
    for (const name of ["Reptiles", "Mammals", "Birds", "Tropical Fish"]) {
      await page.getByRole("button", { name, exact: true }).click();
      await page.waitForTimeout(100);
      const cardIds = await page.locator('[id^="sku-"]').evaluateAll((nodes) => nodes.map((node) => node.id));
      assert.equal(new Set(cardIds).size, cardIds.length, `${label} ${name} filter should not duplicate inventory cards`);
    }
    assert.deepEqual(errors, [], `${label} category pages should have no runtime errors`);
    await page.close();
  }
  console.log("Phase 7 category smoke passed: all taxonomy routes verified on desktop and mobile");
} finally {
  await browser.close();
}
