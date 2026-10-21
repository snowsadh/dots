import { landingContent } from "@/data/landing";

export function LandingFooter() {
  return (
    <footer className="flex justify-center px-6 py-6">
      <p className="text-xs text-muted-foreground">
        {landingContent.footer.poweredBy}
      </p>
    </footer>
  );
}
