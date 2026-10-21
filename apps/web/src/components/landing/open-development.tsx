import { ModelInformation } from "@/components/landing/model-information";
import { FRONTEND_ONLY } from "@/lib/api";

export function OpenDevelopment() {
  if (FRONTEND_ONLY) return null;

  return (
    <section aria-labelledby="model-information-title" className="mx-auto max-w-5xl px-6 pb-12 pt-6 sm:pb-16">
      <div className="border-t border-foreground/15 pt-10 md:pt-12">
        <ModelInformation />
      </div>
    </section>
  );
}
