import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHero } from "@/components/landing/landing-hero";
import { HowItWorks } from "@/components/landing/how-it-works";

export default function LandingPage() {
  return (
    <>
      <LandingHero />
      <HowItWorks />
      <LandingFooter />
    </>
  );
}
