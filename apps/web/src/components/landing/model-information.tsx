"use client";

import { useEffect, useState } from "react";
import { landingContent } from "@/data/landing";
import { API_URL, FRONTEND_ONLY } from "@/lib/api";
import { readModelInformation } from "@/lib/model-information";

type ModelState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; information: ReturnType<typeof readModelInformation> };

export function ModelInformation() {
  const [state, setState] = useState<ModelState>({ status: "loading" });
  const content = landingContent.modelInformation;

  useEffect(() => {
    if (FRONTEND_ONLY) return;
    const controller = new AbortController();
    void fetch(`${API_URL}/`, {
      cache: "no-store",
      signal: AbortSignal.any([controller.signal, AbortSignal.timeout(8_000)]),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Model configuration HTTP ${response.status}`);
        return readModelInformation(await response.json());
      })
      .then((information) => {
        if (!controller.signal.aborted) setState({ status: "ready", information });
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: "error" });
      });
    return () => controller.abort();
  }, []);

  return (
    <div className="min-w-0 border-t border-foreground/15 pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0">
      <h3 className="text-xl font-medium tracking-tight sm:text-2xl">{content.title}</h3>
      {FRONTEND_ONLY && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{content.preview}</p>
      )}
      {!FRONTEND_ONLY && state.status === "loading" && (
        <p className="mt-4 text-base text-muted-foreground" role="status">{content.loading}</p>
      )}
      {!FRONTEND_ONLY && state.status === "error" && (
        <p className="mt-4 text-base text-destructive" role="alert">{content.unavailable}</p>
      )}
      {!FRONTEND_ONLY && state.status === "ready" && (
        <>
          <ul className="mt-5 space-y-6">
            {state.information.models.map((model) => (
              <li key={model.id}>
                <p className="text-xl font-medium">{model.name}</p>
                <p className="mt-1 break-all font-mono text-sm text-muted-foreground">{model.id}</p>
                <p className="mt-2 text-base text-muted-foreground">
                  {model.roles.map((role) => content.roleLabels[role]).join(" · ")}
                </p>
                <p className="mt-2 text-base font-medium">
                  {content.opennessLabels[model.openness]}
                  {model.license && ` · ${model.license}`}
                </p>
                {model.modelCardUrl && (
                  <a className="mt-2 inline-flex min-h-11 items-center text-base underline underline-offset-4 hover:text-blue" href={model.modelCardUrl} rel="noopener noreferrer" target="_blank">
                    {content.modelCardLabel}
                  </a>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-5 break-words font-mono text-sm text-muted-foreground">
            {content.providerLabel}: {state.information.provider}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{content.source}</p>
        </>
      )}
    </div>
  );
}
