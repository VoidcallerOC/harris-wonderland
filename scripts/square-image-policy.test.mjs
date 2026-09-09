import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createServer } from "vite";

const root = new URL("..", import.meta.url).pathname;
const catalog = JSON.parse(
  await readFile(new URL("../src/lib/square-catalog.json", import.meta.url), "utf8"),
);

async function withSquareModule(run) {
  const vite = await createServer({ root, server: { middlewareMode: true }, appType: "custom" });
  try {
    await run(await vite.ssrLoadModule("/src/lib/square.ts"));
  } finally {
    await vite.close();
  }
}

test("keeps real Square photos and uses the supplied artwork for missing active animal photos", async () => {
  await withSquareModule(
    ({ STOCK_ANIMAL_PLACEHOLDER, canBuy, isAnimal, productImage, usesStockAnimalPlaceholder }) => {
      const activeAnimals = catalog.products.filter(
        (product) => isAnimal(product) && canBuy(product),
      );
      const missingPhotos = activeAnimals.filter(usesStockAnimalPlaceholder);
      const realPhotos = activeAnimals.filter((product) => product.image);

      assert.ok(
        missingPhotos.length > 0,
        "fixture must include active animals without Square photos",
      );
      assert.ok(realPhotos.length > 0, "fixture must include active animals with Square photos");
      for (const product of missingPhotos) {
        assert.equal(productImage(product), STOCK_ANIMAL_PLACEHOLDER, product.name);
      }
      for (const product of realPhotos) {
        assert.equal(productImage(product), product.image, product.name);
      }
    },
  );
});

test("does not render husbandry merchandise as an animal placeholder", async () => {
  await withSquareModule(({ STOCK_ANIMAL_PLACEHOLDER, productImage }) => {
    const aspen = catalog.products.find((product) => product.name === "ZM Aspen Snake Bedding");
    assert.ok(aspen, "fixture must include snake bedding");
    assert.notEqual(productImage(aspen), STOCK_ANIMAL_PLACEHOLDER);
    assert.equal(productImage(aspen), "/images/supplies/aspen.jpg");
  });
});
