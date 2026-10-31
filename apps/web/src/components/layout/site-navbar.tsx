import Link from "next/link";
import { navigationContent } from "@/data/navigation";

export function SiteNavbar() {
  return (
    <nav
      aria-label={navigationContent.label}
      className="absolute inset-x-0 top-0 z-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-6 sm:gap-x-8"
    >
      {navigationContent.links.map((link) => (
        <Link
          className="text-sm text-muted-foreground transition-colors hover:text-foreground last:font-semibold last:text-foreground"
          href={link.href}
          key={link.href}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
