import { ModelInformation } from "@/components/landing/model-information";
import { landingContent } from "@/data/landing";

export function OpenDevelopment() {
  const content = landingContent.openDevelopment;

  return (
    <section aria-labelledby="open-development-title" className="mx-auto max-w-5xl px-6 pb-12 pt-6 sm:pb-16">
      <div className="grid gap-10 border-t border-foreground/15 pt-10 md:grid-cols-[1.2fr_1fr] md:pt-12">
        <div>
          <p className="font-mono text-sm text-muted-foreground">{content.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-medium leading-tight tracking-tight sm:text-4xl" id="open-development-title">
            {content.title}
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">{content.description}</p>
          <a className="mt-5 inline-flex min-h-11 items-center text-base font-medium underline underline-offset-4 hover:text-blue" href={content.contribute.href} rel="noopener noreferrer" target="_blank">
            {content.contribute.label}
          </a>
          <p className="mt-8 text-sm font-medium">{content.licenseStatus}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{content.licenseDetail}</p>
        </div>
        <ModelInformation />
      </div>
    </section>
  );
}
