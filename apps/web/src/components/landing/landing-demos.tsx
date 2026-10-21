import { galleryContent } from "@/data/gallery";
import { landingContent } from "@/data/landing";

export function LandingDemos() {
  const content = landingContent.demos;

  return (
    <section aria-labelledby="landing-demos-title" className="mx-auto max-w-5xl px-6 pb-10 pt-6">
      <div className="border-t border-foreground/15 pt-10">
        <h2 className="text-2xl font-medium tracking-tight" id="landing-demos-title">
          {content.title}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {content.description}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {galleryContent.entries.slice(0, 5).map((entry) => (
            <a className="flex flex-col overflow-hidden rounded-sm border hover:border-foreground/40" download href={entry.source} key={entry.slug}>
              {/* eslint-disable-next-line @next/next/no-img-element -- static gallery asset */}
              <img
                alt={`${entry.title} — ${galleryContent.sourceLabel}`}
                className="aspect-square w-full border-b bg-white object-contain"
                loading="lazy"
                src={entry.source}
              />
              <h3 className="px-3 pt-3 text-sm font-medium">{entry.title}</h3>
              <p className="mt-auto px-3 pb-3 pt-2 text-sm text-muted-foreground underline underline-offset-4">
                {content.downloadLabel}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
