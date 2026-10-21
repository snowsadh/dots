import { galleryContent } from "@/data/gallery";

export function GalleryPrints() {
  const content = galleryContent.demoPrints;

  return (
    <section aria-labelledby="demo-prints-title" className="mt-10">
      <h2 className="text-xl font-medium" id="demo-prints-title">
        {content.title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {content.description}
      </p>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        {content.photos.map((photo) => (
          <figure className="overflow-hidden rounded-sm border" key={photo.source}>
            {/* eslint-disable-next-line @next/next/no-img-element -- static gallery asset */}
            <img
              alt={photo.alt}
              className="h-auto w-full bg-muted/40"
              height={1600}
              src={photo.source}
              width={900}
            />
            <figcaption className="border-t px-4 py-3 text-sm text-muted-foreground">
              {photo.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
