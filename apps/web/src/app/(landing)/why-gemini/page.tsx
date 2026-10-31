import { InfoPage } from "@/components/landing/info-page";
import { pagesContent } from "@/data/pages";

export default function WhyGeminiPage() {
  return (
    <InfoPage
      paragraphs={pagesContent.whyGemini.paragraphs}
      steps={pagesContent.whyGemini.steps}
      title={pagesContent.whyGemini.title}
    />
  );
}
