import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const fromAjv = createRequire(require.resolve("ajv/package.json"));
const uri = fromAjv("fast-uri");

test("the schema tooling canonicalizes international hosts consistently", () => {
  for (const host of ["m\u00fcnich.example", "b\u00fccher.example"]) {
    const expected = new URL(`https://${host}/`).href;
    assert.equal(uri.resolve("https://base.example/", `//${host}/`), expected);
    assert.equal(uri.normalize(`https://${host}/`), expected);
  }
});

test("the patched URI resolver preserves ordinary schema-reference behavior", () => {
  assert.equal(uri.resolve("https://base.example/schemas/", "../person.json"), "https://base.example/person.json");
  assert.equal(uri.resolve("https://base.example/person.json", "#/$defs/name"), "https://base.example/person.json#/$defs/name");
  const Ajv = require("ajv");
  const validate = new Ajv().compile({
    $id: "https://base.example/person.json",
    type: "object",
    properties: { name: { $ref: "#/$defs/name" } },
    required: ["name"],
    $defs: { name: { type: "string", minLength: 1 } }
  });
  assert.equal(validate({ name: "Example" }), true);
  assert.equal(validate({ name: 12 }), false);
});
