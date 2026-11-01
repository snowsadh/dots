import type { Metadata } from "next";
import { InvestorDeck } from "@/components/pitch/investor-deck";
import { investorMetadata } from "@/data/investor";

export const metadata: Metadata = investorMetadata;

export default function PresentationPage() {
  return <InvestorDeck />;
}
