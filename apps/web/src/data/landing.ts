export const landingContent = {
  hero: {
    brand: "dots",
    subheading:
      "Create tactile maps for visually impaired visitors in minutes, not weeks.",
    tagline:
      "Public source, configurable AI, and tactile maps that more people can help improve.",
    generationTime: "Allow 15–20 minutes to generate an output when running locally.",
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
  openDevelopment: {
    eyebrow: "Built in the open",
    title: "Make tactile maps easier to create, together.",
    description:
      "Explore the code, test a floor plan, or help improve model support and tactile validation. Every useful contribution can make the next building easier to navigate.",
    source: {
      label: "View source on GitHub",
      href: "https://github.com/snowsadh/dots",
    },
    contribute: {
      label: "Suggest an improvement",
      href: "https://github.com/snowsadh/dots/issues",
    },
    licenseStatus: "Public source · application license pending",
    licenseDetail:
      "The application license is being finalized. Model licenses are listed separately.",
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
