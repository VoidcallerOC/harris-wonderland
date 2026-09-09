import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.PHASE5_BASE_URL ?? "http://127.0.0.1:8080";
const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium" });
const page = await browser.newPage();
try {
  await page.goto(`${baseUrl}/collection/sugar-gliders`, { waitUntil: "networkidle" });
  await page.getByText("Current and upcoming animals.").waitFor();
  assert.match(await page.locator("body").innerText(), /Submit a request with your setup questions/);

  const requestButton = page.getByRole("button", { name: "Request this animal" }).nth(2);
  await requestButton.click();
  const form = page.locator("form").filter({ has: page.getByRole("button", { name: "Submit hold request" }) }).first();
  await form.getByPlaceholder("Your name").fill("Phase Five Tester");
  await form.getByPlaceholder("Email").fill("phase5@example.com");
  await form.getByPlaceholder("Phone").fill("860-555-0199");
  await form.getByPlaceholder("Setup notes or questions (optional)").fill("Habitat is ready.");
  assert.match(await form.innerText(), /does not charge your card/);
  await form.getByRole("button", { name: "Submit hold request" }).click();
  await page.getByRole("status").waitFor({ timeout: 15_000 });
  const confirmation = await page.getByRole("status").innerText();
  assert.match(confirmation, /Request received/i);
  assert.match(confirmation, /phase5@example.com/);

  const soldCard = page.locator("article").filter({ hasText: "Recently placed" });
  assert.equal(await soldCard.getByRole("button", { name: "Request this animal" }).count(), 0);
  console.log("Phase 5 customer workflow smoke passed");
} finally {
  await browser.close();
}
