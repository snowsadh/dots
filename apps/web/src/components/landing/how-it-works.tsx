import Image from "next/image";
import { landingContent } from "@/data/landing";

export function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works-title" className="border-t px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <h2
          className="font-pixel text-4xl tracking-tight sm:text-5xl"
          id="how-it-works-title"
        >
          {landingContent.howItWorks.title}
        </h2>
        <ol className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {landingContent.howItWorks.steps.map((step, index) => (
            <li key={step.title}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm border bg-muted">
                <Image
                  alt={step.alt}
                  className="object-cover"
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  src={step.image}
                />
              </div>
              <div className="mt-5 flex items-baseline gap-4">
                <span className="font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-medium tracking-tight">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
