import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingDemos } from "@/components/landing/landing-demos";
import { OpenDevelopment } from "@/components/landing/open-development";

export default function LandingPage() {
  return (
    <>
      <LandingHero />
      <LandingDemos />
      <OpenDevelopment />
      <LandingFooter />
    </>
  );
}
