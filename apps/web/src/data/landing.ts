export const landingContent = {
  hero: {
    brand: "dots",
    subheading:
      "Create tactile maps for visually impaired visitors in minutes, not weeks.",
    tagline:
      "Public source, configurable AI, and tactile maps that more people can help improve.",
    generationTime: "Allow 15–20 minutes to generate an output when running locally.",
    inputHelp: {
      prompt: "Don't have a floor plan?",
      creator: {
        label: "Create one with Floor Plan Creator",
        href: "https://floorplancreator.net/",
      },
      demos: {
        label: "Use a demo input from the gallery",
        href: "https://github.com/snowsadh/dots/tree/main/demo-inputs",
      },
    },
    upload: {
      failed: "Upload failed. Try again.",
      backendUnavailable:
        "Error connecting with backend. Please run locally to generate an output.",
      previewHint: "Frontend preview · generation requires a local backend",
      guideHref: "/input-guide",
      guideLabel: "Good and bad floor-plan examples",
      hint: "PDF, PNG, JPG, or WebP · up to 10 MB",
      label: "Upload floor plan",
      tooLarge: "That file is over 10 MB. Try a smaller export.",
      uploading: "Uploading…",
    },
    compliance: {
      lead: "Every map is validated rule-by-rule against",
      standards: [
        {
          name: "BANA 2022",
          fullName:
            "Guidelines and Standards for Tactile Graphics (2022), Braille Authority of North America",
          href: "https://www.brailleauthority.org/tg/",
        },
        {
          name: "ADA §703",
          fullName:
            "ADA Standards for Accessible Design §703 — braille and tactile signage",
          href: "https://www.access-board.gov/ada/guides/chapter-7-signs/",
        },
      ],
      tail: "— it exports only at zero violations.",
    },
  },
  demos: {
    title: "Try a real demo",
    description:
      "Download a floor plan from the gallery and upload it when running dots locally.",
    downloadLabel: "Download input",
  },
  openDevelopment: {
    source: {
      label: "View source on GitHub",
      href: "https://github.com/snowsadh/dots",
    },
  },
  modelInformation: {
    title: "Current AI configuration",
    loading: "Checking the connected API…",
    unavailable:
      "Model information could not be verified. Check the API connection and refresh this page.",
    preview:
      "This deployment contains the frontend only. Run dots locally to connect a backend and view its model configuration.",
    source: "Configuration reported by the connected API on page load.",
    providerLabel: "Provider",
    modelCardLabel: "Model card",
    opennessLabels: {
      "open-weight": "Open weights",
      proprietary: "Proprietary model",
      unverified: "License not verified",
    },
    roleLabels: {
      critical: "Parsing and review",
      fast: "Editing",
      layout: "Tactile layout",
      compare: "Visual comparison",
    },
  },
  footer: {
    poweredBy: "AI-assisted tactile maps",
  },
} as const;
