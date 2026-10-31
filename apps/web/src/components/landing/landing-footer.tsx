import { landingContent } from "@/data/landing";

export function LandingFooter() {
  return (
    <footer className="flex justify-center py-6">
      <p className="text-sm text-muted-foreground">
        {landingContent.footer.poweredBy}
      </p>
    </footer>
  );
}
