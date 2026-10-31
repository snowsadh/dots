export const landingContent = {
  howItWorks: {
    title: "How it works",
    steps: [
      {
        title: "Upload",
        description: "Start with a PDF or image of one floor.",
        image: "/how-it-works/upload.svg",
        alt: "Floor plan file moving into an upload window",
      },
      {
        title: "Output STL",
        description: "Review the tactile map, then download its 3D-printable STL.",
        image: "/how-it-works/output-stl.svg",
        alt: "Isometric illustration of a tactile map ready to export",
      },
      {
        title: "3D printed",
        description: "Print the raised map on a consumer 3D printer.",
        image: "/how-it-works/3d-printed.jpg",
        alt: "A turquoise tactile map on a 3D printer bed",
      },
      {
        title: "Final",
        description: "A finished map you can explore by touch.",
        image: "/how-it-works/final.jpg",
        alt: "Finished turquoise tactile map held in one hand",
      },
    ],
  },
  hero: {
    brand: "dots",
    subheading:
      "Create tactile maps for visually impaired visitors in minutes, not weeks.",
    tagline:
      "No custom commissions. Upload a floor plan and print it for about $1 in filament.",
    upload: {
      failed: "Upload failed. Try again.",
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
  footer: {
    poweredBy: "powered by Gemini",
  },
} as const;
