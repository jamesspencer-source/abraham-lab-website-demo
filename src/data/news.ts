import type { NewsItem } from "./types";

export const newsItems = [
  {
    sort: 202603,
    dateLabel: "March 2026",
    category: "Institutional Coverage",
    sourceType: "HMS News",
    title: "HMS highlights the mechanistic basis of a new class of antivirals",
    summary:
      "Harvard Medical School covered the lab's structural and biophysical work showing how helicase-primase inhibitors disable a critical herpes simplex virus enzyme.",
    link: "https://hms.harvard.edu/news/researchers-now-understand-how-new-class-antivirals-works",
    linkLabel: "Read HMS story",
    image: "/assets/images/publications/hsv-helicase-primase.jpg",
    imageAlt:
      "Structural figure associated with HSV-1 helicase-primase inhibition and replication fork assembly."
  },
  {
    sort: 202602,
    dateLabel: "March 2026",
    category: "Video",
    sourceType: "HMS Microbiology",
    title: "Inside the Labs of HMS profiles the Abraham Lab's outbreak-preparedness work",
    summary:
      "A short HMS feature spotlights how members of the lab investigate viral infection to help the world prepare for future threats.",
    link: "https://www.youtube.com/shorts/GFM3KLZCDps",
    linkLabel: "Watch feature",
    image: "/assets/images/research/hero-emergingvirus.jpg",
    imageAlt:
      "Illustrated structural virology composition highlighting viral surface proteins and host receptor engagement."
  },
  {
    sort: 202601,
    dateLabel: "January 2026",
    category: "Publication",
    sourceType: "Cell",
    title: "Cell publishes mechanistic analysis of HSV-1 helicase-primase inhibition",
    summary:
      "A new Cell paper defines the structural basis of HSV-1 helicase-primase inhibition and replication fork complex assembly.",
    link: "https://www.cell.com/cell/fulltext/S0092-8674(25)01376-5",
    linkLabel: "Read paper",
    image: "/assets/images/publications/hsv-helicase-primase.jpg",
    imageAlt:
      "Structural figure associated with HSV-1 helicase-primase inhibition and replication fork assembly."
  },
  {
    sort: 202508,
    dateLabel: "August 2025",
    category: "Publication",
    sourceType: "Nature Microbiology",
    title: "Nature Microbiology features arenavirus spike glycoprotein architecture",
    summary:
      "The lab reports the molecular organization of the New World arenavirus spike glycoprotein complex in Nature Microbiology.",
    link: "https://www.nature.com/articles/s41564-025-02085-6",
    linkLabel: "Read paper",
    image: "/assets/images/publications/arenavirus-gpc.jpeg",
    imageAlt:
      "Structural render of the New World arenavirus glycoprotein complex."
  },
  {
    sort: 202503,
    dateLabel: "March 2025",
    category: "Publication",
    sourceType: "Cell",
    title: "Cell paper defines shifted receptor recognition in an encephalitic arbovirus",
    summary:
      "A Cell study resolves the molecular basis for altered receptor engagement in an encephalitic arbovirus.",
    link: "https://www.cell.com/cell/fulltext/S0092-8674(25)00347-2",
    linkLabel: "Read paper",
    image: "/assets/images/publications/weev-structures.jpeg",
    imageAlt:
      "Comparative structural figure associated with receptor recognition in an encephalitic arbovirus."
  },
  {
    sort: 202408,
    dateLabel: "August 2024",
    category: "Publication",
    sourceType: "Cell",
    title: "Cell study identifies structural mechanisms of viral DNA polymerase drug resistance",
    summary:
      "The lab maps resistance-associated conformations in viral DNA polymerase complexes relevant to antiviral action.",
    link: "https://www.cell.com/cell/fulltext/S0092-8674(24)00842-0",
    linkLabel: "Read paper",
    image: "/assets/images/research/polymerase-complex.jpg",
    imageAlt: "Structural view of a viral polymerase complex."
  },
  {
    sort: 202407,
    dateLabel: "July 2024",
    category: "Publication",
    sourceType: "Nature Communications",
    title: "Nature Communications publishes VLDLR recognition study in eastern equine encephalitis virus",
    summary:
      "A receptor-recognition study defines how eastern equine encephalitis virus engages VLDLR at high resolution.",
    link: "https://www.nature.com/articles/s41467-024-50887-9",
    linkLabel: "Read paper",
    image: "/assets/images/publications/vldlr-recognition.jpeg",
    imageAlt:
      "Publication figure showing the receptor-recognition interface in eastern equine encephalitis virus."
  },
  {
    sort: 202112,
    dateLabel: "December 2021",
    category: "Institutional Coverage",
    sourceType: "Harvard Gazette",
    title: "Harvard Gazette covers work forecasting antibody escape in SARS-CoV-2 variants",
    summary:
      "Harvard coverage highlighted the lab's work modeling how SARS-CoV-2 variants could evade vaccine- and antibody-derived immunity.",
    link: "https://news.harvard.edu/gazette/story/2021/12/new-study-forecasts-how-sars-cov-2-variants-could-evade-vaccines/",
    linkLabel: "Read coverage",
    image: "/assets/images/research/viral-entry-comparison.png",
    imageAlt:
      "Figure comparing viral entry determinants across alphavirus systems."
  }
].sort((a, b) => b.sort - a.sort) satisfies NewsItem[];
