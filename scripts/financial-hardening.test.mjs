import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const squareSource = await readFile(new URL("../src/lib/square-api.ts", import.meta.url), "utf8");
const holdsSource = await readFile(new URL("../src/lib/sugar-glider-holds.ts", import.meta.url), "utf8");

test("checkout allow-lists the canonical paid shop return URL", () => {
  assert.match(squareSource, /url\.origin === SITE\.origin/);
  assert.match(squareSource, new RegExp('url\\.pathname === "/shop"'));
  assert.match(squareSource, /url\.searchParams\.get\("paid"\) === "1"/);
});

test("only completed Square payments are treated as captured", () => {
  assert.match(squareSource, /isCompletedSquarePayment\(json\.payment\.status\)/);
  assert.match(squareSource, /return status === "COMPLETED"/);
  assert.doesNotMatch(squareSource, /json\.payment\.status !== "COMPLETED" && json\.payment\.status !== "APPROVED"/);
});

test("payment idempotency is bound to the original hold", () => {
  assert.match(holdsSource, /select id, hold_id, amount_cents, payment_mode, status, square_payment_id/);
  assert.match(holdsSource, /attempt\.hold_id !== data\.holdId/);
});

test("paid holds are not automatically expired back into inventory", () => {
  assert.match(holdsSource, /full_payment_status not in \('processing', 'succeeded'\)/);
  assert.match(holdsSource, /deposit_payment_status not in \('processing', 'succeeded'\)/);
  assert.match(holdsSource, /balance_payment_status not in \('processing', 'succeeded'\)/);
});

test("hold cancellation and completion are payment-gated", () => {
  assert.match(holdsSource, /hasPaidOrProcessingPayment/);
  assert.match(holdsSource, /Reconcile or refund the payment before releasing it/);
  assert.match(holdsSource, /A deposit or full payment is required before marking this hold held/);
  assert.match(holdsSource, /Full payment or deposit plus balance payment is required before completing this hold/);
});
