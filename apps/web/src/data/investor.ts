export const investorMetadata = {
  title: "dots — business opportunity",
  description: "Four slides on the opportunity, product, and proposed revenue model for tactile maps.",
} as const;

export const investorLabels = {
  slide: "Slide",
  of: "of",
  controls: "Slide controls",
  previous: "Previous slide",
  next: "Next slide",
  kicker: "Business case / dots",
} as const;

export const investorSlides = [
  {
    section: "The opportunity",
    title: "A better entrance opens a bigger market.",
    body: "Blind and low-vision visitors want to shop, eat, and explore independently. When a building is hard to understand, that experience starts with a barrier.",
    takeaway: "Accessibility can improve the visit and help businesses welcome more customers.",
    photo: {
      src: "/how-it-works/final.jpg",
      alt: "A finished tactile floor map held in one hand",
      caption: "A map visitors can understand by touch",
      fit: "cover",
    },
  },
  {
    section: "The bottleneck",
    title: "The map is useful. Making it is expensive.",
    body: "Today, a specialist often has to interpret the drawing, simplify the layout, add braille, check every detail, and prepare it for manufacture. Each building becomes a custom project.",
    takeaway: "Smaller stores, schools, and libraries can struggle to justify that cost.",
    photo: {
      src: "/gallery/test-library-floor-plan-source.png",
      alt: "A detailed source floor plan for a library",
      caption: "The floor plan already exists; the conversion is the hard part",
      fit: "contain",
    },
  },
  {
    section: "The product",
    title: "A floor plan becomes a printable tactile map.",
    body: "dots reads an uploaded plan, checks the extracted layout, lets a person correct it, and produces a tactile design with a matching braille legend. The final files are ready for a consumer 3D printer.",
    takeaway: "A repeatable workflow replaces much of the manual design work.",
    photo: {
      src: "/how-it-works/3d-printed.jpg",
      alt: "A turquoise tactile map on a 3D printer bed",
      caption: "Printed from the generated STL",
      fit: "cover",
    },
  },
  {
    section: "Proposed revenue model",
    title: "Two buyers. One production engine.",
    body: "We can sell the same map-making workflow to private organizations and public institutions without building a separate product for each building.",
    takeaway: "The goal: make each map affordable to produce, then serve many locations.",
    routes: [
      {
        label: "Private organizations",
        title: "Paid projects per location",
        body: "Malls, retailers, and venues can commission maps for their own spaces and improve the visitor experience.",
      },
      {
        label: "Public institutions",
        title: "Multi-building contracts",
        body: "Schools, hospitals, and transport sites could procure maps across a group of facilities.",
      },
    ],
  },
] as const;
