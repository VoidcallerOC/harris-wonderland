import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.PHASE5_BASE_URL ?? "http://127.0.0.1:8080";
const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium" });
const page = await browser.newPage();
try {
  let confirmation = "";
  for (let index = 0; index < 3 && !confirmation; index += 1) {
    await page.goto(`${baseUrl}/collection/sugar-gliders`, { waitUntil: "networkidle" });
    await page.getByText("Current and upcoming animals.").waitFor();
    assert.match(await page.locator("body").innerText(), /Submit a request with your setup questions/);
    const requestButtons = page.getByRole("button", { name: "Request this animal" });
    if (index >= await requestButtons.count()) continue;
    await requestButtons.nth(index).click();
    const form = page.locator("form").filter({ has: page.getByRole("button", { name: "Submit hold request" }) }).first();
    const email = `phase5-${Date.now()}@example.com`;
    await form.getByPlaceholder("Your name").fill("Phase Five Tester");
    await form.getByPlaceholder("Email").fill(email);
    await form.getByPlaceholder("Phone").fill("860-555-0199");
    await form.getByPlaceholder("Setup notes or questions (optional)").fill("Habitat is ready.");
    assert.match(await form.innerText(), /does not charge your card/);
    await form.getByRole("button", { name: "Submit hold request" }).click();
    try {
      await page.getByRole("status").waitFor({ timeout: 5_000 });
      confirmation = await page.getByRole("status").innerText();
      assert.match(confirmation, /Request received/i);
      assert.match(confirmation, /phase5-\d+@example.com/);
    } catch {
      // This listing may already be held by an earlier smoke run; try the next one.
      confirmation = "";
    }
  }
  assert.ok(confirmation, "at least one eligible Sugar Glider listing should accept a request");

  const soldCard = page.locator("article").filter({ hasText: "Recently placed" });
  assert.equal(await soldCard.getByRole("button", { name: "Request this animal" }).count(), 0);
  console.log("Phase 5 customer workflow smoke passed");
} finally {
  await browser.close();
}
