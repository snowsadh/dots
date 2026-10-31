import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { PitchDeck } from "@/components/pitch/pitch-deck";
import { siteContent } from "@/data/site";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${siteContent.title} — hackathon pitch`,
  description: "Three-slide opening deck for the dots demo video.",
};

export default function PitchPage() {
  return <PitchDeck fontClassName={manrope.className} />;
}
