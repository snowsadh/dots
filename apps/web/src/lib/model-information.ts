// Validates backend model metadata and attaches only verified catalog claims.
import { modelCatalog } from "../data/models";

type ModelRole = "critical" | "fast" | "layout" | "compare";

export type ModelInformation = {
  provider: string;
  models: Array<{
    id: string;
    name: string;
    roles: ModelRole[];
    openness: "open-weight" | "proprietary" | "unverified";
    modelCardUrl: string | null;
    license: string | null;
  }>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Invalid model configuration: ${field} must be a non-empty string.`);
  }
  return value;
}

export function readModelInformation(payload: unknown): ModelInformation {
  if (!isRecord(payload) || payload.ok !== true || !isRecord(payload.models)) {
    throw new Error("Invalid model configuration response: expected ok=true and a models object.");
  }

  const provider = requiredString(payload.models.provider, "provider");
  const models: ModelInformation["models"] = [];

  for (const role of ["critical", "fast", "layout", "compare"] as const) {
    const id = requiredString(payload.models[role], role);
    const existing = models.find((model) => model.id === id);
    if (existing) {
      existing.roles.push(role);
      continue;
    }

    const catalogEntry = modelCatalog.find((entry) =>
      entry.ids.some((alias) => alias === id.toLowerCase())
    );
    models.push({
      id,
      name: catalogEntry?.name ?? id,
      roles: [role],
      openness: catalogEntry?.openness ?? (/^(?:google\/)?gemini-/i.test(id) ? "proprietary" : "unverified"),
      modelCardUrl: catalogEntry?.modelCardUrl ?? null,
      license: catalogEntry?.license ?? null,
    });
  }

  return { provider, models };
}
