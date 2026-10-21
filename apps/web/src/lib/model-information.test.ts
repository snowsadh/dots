import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { readModelInformation } from "./model-information";

const gemmaId = "google/gemma-4-26b-a4b-it";

function payload(critical: string, fast = critical, layout = critical, compare = critical) {
  return { ok: true, models: { provider: "openai-compatible", critical, fast, layout, compare } };
}

describe("model information", () => {
  test("deduplicates identical IDs and preserves all roles in backend order", () => {
    assert.deepEqual(readModelInformation(payload(gemmaId)), {
      provider: "openai-compatible",
      models: [{
        id: gemmaId,
        name: "Gemma 4 26B A4B",
        roles: ["critical", "fast", "layout", "compare"],
        openness: "open-weight",
        modelCardUrl: "https://huggingface.co/google/gemma-4-26B-A4B-it",
        license: "Apache 2.0",
      }],
    });
  });

  test("reports mixed Gemma and Gemini models without treating Gemini as open", () => {
    const result = readModelInformation(payload(
      gemmaId, "google/gemini-3.7-flash", gemmaId, "google/gemini-3.7-flash"
    ));
    assert.deepEqual(result.models.map((model) => ({
      name: model.name,
      roles: model.roles,
      openness: model.openness,
      license: model.license,
      modelCardUrl: model.modelCardUrl,
    })), [
      {
        name: "Gemma 4 26B A4B",
        roles: ["critical", "layout"],
        openness: "open-weight",
        license: "Apache 2.0",
        modelCardUrl: "https://huggingface.co/google/gemma-4-26B-A4B-it",
      },
      {
        name: "google/gemini-3.7-flash",
        roles: ["fast", "compare"],
        openness: "proprietary",
        license: null,
        modelCardUrl: null,
      },
    ]);
  });

  test("recognizes native and case-insensitive verified aliases", () => {
    for (const id of ["gemma-4-26b-a4b-it", "GOOGLE/GEMMA-4-26B-A4B-IT"]) {
      const [model] = readModelInformation(payload(id)).models;
      assert.equal(model.id, id);
      assert.equal(model.name, "Gemma 4 26B A4B");
      assert.equal(model.openness, "open-weight");
    }
  });

  test("recognizes native Gemini IDs as proprietary and preserves raw provider", () => {
    const input = payload("GEMINI-3.7-FLASH");
    input.models.provider = "custom-local-provider";
    const result = readModelInformation(input);
    assert.equal(result.provider, "custom-local-provider");
    assert.equal(result.models[0].name, "GEMINI-3.7-FLASH");
    assert.equal(result.models[0].openness, "proprietary");
  });

  test("keeps unknown and misleading model names unverified", () => {
    for (const id of [
      "unknown-model", "custom/gemma-4-26b-a4b-it", "google/gemma-4-26b-a4b-it:free",
      "gemma-4-26b-a4b-it-preview", "llama-open", "lark-open", ` ${gemmaId} `,
    ]) {
      const [model] = readModelInformation(payload(id)).models;
      assert.equal(model.name, id);
      assert.equal(model.openness, "unverified");
      assert.equal(model.modelCardUrl, null);
      assert.equal(model.license, null);
    }
  });

  test("rejects malformed response objects and failed backend responses", () => {
    for (const input of [null, undefined, [], "invalid", {}, { ok: false },
      { ...payload(gemmaId), ok: "true" }, { ok: true, models: [] }]) {
      assert.throws(() => readModelInformation(input), /Invalid model configuration response/);
    }
  });

  test("requires non-empty strings for the provider and every model role", () => {
    for (const field of ["provider", "critical", "fast", "layout", "compare"]) {
      for (const value of [undefined, null, "", " \n ", 42, {}, []]) {
        const input = payload(gemmaId);
        const models: Record<string, unknown> = { ...input.models, [field]: value };
        assert.throws(
          () => readModelInformation({ ...input, models }),
          new RegExp(`${field} must be a non-empty string`)
        );
      }
    }
  });
});
