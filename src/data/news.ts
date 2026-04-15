import type { NewsItem } from "./types";

const newsItemsList: NewsItem[] = [
  {
    date: "2026-03-03",
    category: "Institutional coverage",
    source: "HMS Office for Graduate Education",
    title: "HMS Office for Graduate Education profiles the Abraham Lab's viral infection research",
    summary:
      "A Harvard Medical School video feature follows the lab's mechanistic work on viral infection and outbreak preparedness.",
    link: "https://ogephd.hms.harvard.edu/news?page=2",
    linkLabel: "View HMS feature",
    homepageEligible: true,
    milestoneTier: "major",
    image: "/assets/images/research/viral-entry-comparison.png",
    imageAlt:
      "Structural comparison figure showing receptor recognition features across encephalitic alphaviruses."
  },
  {
    date: "2026-01-08",
    category: "Institutional coverage",
    source: "Harvard Medical School",
    title: "Harvard Medical School covers the mechanism of a new class of antivirals",
    summary:
      "HMS covered the structural and biophysical work explaining how helicase-primase inhibitors disable a herpesvirus enzyme complex.",
    link: "https://hms.harvard.edu/news/researchers-now-understand-how-new-class-antivirals-works",
    linkLabel: "Read HMS story",
    homepageEligible: true,
    milestoneTier: "major",
    image: "/assets/images/publications/hsv-helicase-primase.jpg",
    imageAlt:
      "Publication figure showing the HSV helicase-primase complex and replication fork assembly."
  },
  {
    date: "2026-01-22",
    category: "Publication",
    source: "Cell",
    title: "Cell publishes HSV-1 helicase-primase inhibition study",
    summary:
      "The paper defines the structural basis of HSV-1 helicase-primase inhibition and replication fork complex assembly.",
    link: "https://www.cell.com/cell/fulltext/S0092-8674(25)01376-5",
    linkLabel: "Read paper",
    homepageEligible: true,
    milestoneTier: "major",
    image: "/assets/images/publications/hsv-helicase-primase.jpg",
    imageAlt:
      "Structural figure associated with HSV-1 helicase-primase inhibition and replication fork assembly."
  },
  {
    date: "2025-08-08",
    category: "Publication",
    source: "Nature Microbiology",
    title: "Nature Microbiology publishes the New World arenavirus spike study",
    summary:
      "The lab reports the molecular organization of the New World arenavirus spike glycoprotein complex in Nature Microbiology.",
    link: "https://www.nature.com/articles/s41564-025-02085-6",
    linkLabel: "Read paper",
    homepageEligible: true,
    milestoneTier: "major",
    image: "/assets/images/publications/arenavirus-gpc.jpeg",
    imageAlt:
      "Structural render of the New World arenavirus glycoprotein complex."
  },
  {
    date: "2025-04-04",
    category: "Publication",
    source: "Cell",
    title: "Cell publishes shifted receptor recognition study in an encephalitic arbovirus",
    summary:
      "A Cell study resolves the molecular basis for altered receptor engagement in an encephalitic arbovirus.",
    link: "https://www.cell.com/cell/fulltext/S0092-8674(25)00347-2",
    linkLabel: "Read paper",
    homepageEligible: true,
    milestoneTier: "major",
    image: "/assets/images/publications/weev-structures.jpeg",
    imageAlt:
      "Comparative structural figure associated with receptor recognition in an encephalitic arbovirus."
  },
  {
    date: "2025-01-20",
    category: "Publication",
    source: "Cell",
    title: "Cell publishes Nipah virus polymerase analysis",
    summary:
      "A Cell study resolves the Nipah virus polymerase complex and identifies features relevant to RNA replication and drug resistance.",
    link: "https://pubmed.ncbi.nlm.nih.gov/39837328/",
    linkLabel: "Read paper",
    homepageEligible: false,
    milestoneTier: "secondary",
    image: "/assets/images/publications/hsv-helicase-primase.jpg",
    imageAlt: "Structural figure associated with viral polymerase architecture."
  },
  {
    date: "2024-08-02",
    category: "Publication",
    source: "Nature Communications",
    title: "Nature Communications publishes VLDLR recognition study in eastern equine encephalitis virus",
    summary:
      "A receptor-recognition study defines how eastern equine encephalitis virus engages VLDLR at high resolution.",
    link: "https://www.nature.com/articles/s41467-024-50887-9",
    linkLabel: "Read paper",
    homepageEligible: true,
    milestoneTier: "major",
    image: "/assets/images/publications/vldlr-recognition.jpeg",
    imageAlt:
      "Publication figure showing the receptor-recognition interface in eastern equine encephalitis virus."
  },
  {
    date: "2024-07-23",
    category: "Recognition",
    source: "Harvard Medical Microbiology",
    title: "Harvard Medical Microbiology highlights Jonathan Abraham as a new HHMI Investigator",
    summary:
      "The department archived the announcement that Jonathan Abraham joined the 2024 cohort of HHMI Investigators.",
    link: "https://micro.hms.harvard.edu/news-events/archived-news",
    linkLabel: "View archive",
    homepageEligible: true,
    milestoneTier: "major",
    image: "/assets/images/people/jonathan-abraham.jpeg",
    imageAlt: "Portrait of Jonathan Abraham."
  }
];

export const newsItems = newsItemsList.sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);
