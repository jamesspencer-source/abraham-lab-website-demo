import type { NewsItem } from "./types";

export const newsItems = [
  {
    date: "2026-03-03",
    category: "Institutional Coverage",
    source: "HMS Office for Graduate Education",
    title: "Inside the Labs of HMS profiles the Abraham Lab's work on viral infection mechanisms",
    summary:
      "A Harvard Medical School video feature follows the lab's work on how viruses infect cells and how mechanistic insight can sharpen outbreak preparedness.",
    link: "https://ogephd.hms.harvard.edu/news?page=2",
    linkLabel: "View HMS feature",
    image: "/assets/images/research/viral-entry-comparison.png",
    imageAlt:
      "Structural comparison figure showing receptor recognition features across encephalitic alphaviruses."
  },
  {
    date: "2026-01-08",
    category: "Institutional Coverage",
    source: "Harvard Medical School",
    title: "Harvard Medical School reports the mechanism of a new class of antivirals",
    summary:
      "HMS covered the lab's structural and biophysical work explaining how helicase-primase inhibitors disable a critical HSV enzyme complex.",
    link: "https://hms.harvard.edu/news/researchers-now-understand-how-new-class-antivirals-works",
    linkLabel: "Read HMS story",
    image: "/assets/images/publications/hsv-helicase-primase.jpg",
    imageAlt:
      "Publication figure showing the HSV helicase-primase complex and replication fork assembly."
  },
  {
    date: "2026-01-22",
    category: "Publication",
    source: "Cell",
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
    date: "2025-08-08",
    category: "Publication",
    source: "Nature Microbiology",
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
    date: "2025-04-04",
    category: "Publication",
    source: "Cell",
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
    date: "2025-01-20",
    category: "Publication",
    source: "Cell",
    title: "Cell reports structural and functional analysis of the Nipah virus polymerase complex",
    summary:
      "A Cell study resolves the Nipah virus polymerase complex and identifies features relevant to RNA replication and drug resistance.",
    link: "https://pubmed.ncbi.nlm.nih.gov/39837328/",
    linkLabel: "Read paper",
    image: "/assets/images/publications/hsv-helicase-primase.jpg",
    imageAlt: "Structural figure associated with viral polymerase architecture."
  },
  {
    date: "2024-08-27",
    category: "Publication",
    source: "Cell",
    title: "Cell study identifies structural mechanisms of viral DNA polymerase drug resistance",
    summary:
      "The lab maps resistance-associated conformations in viral DNA polymerase complexes relevant to antiviral action.",
    link: "https://www.cell.com/cell/fulltext/S0092-8674(24)00842-0",
    linkLabel: "Read paper",
    image: "/assets/images/research/polymerase-complex.jpg",
    imageAlt: "Structural view of a viral polymerase complex."
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
    image: "/assets/images/publications/vldlr-recognition.jpeg",
    imageAlt:
      "Publication figure showing the receptor-recognition interface in eastern equine encephalitis virus."
  },
  {
    date: "2024-07-23",
    category: "Institutional Recognition",
    source: "Harvard Medical Microbiology",
    title: "Harvard Medical Microbiology highlights Jonathan Abraham as a new HHMI Investigator",
    summary:
      "The department archived the announcement that Jonathan Abraham joined the 2024 cohort of HHMI Investigators.",
    link: "https://micro.hms.harvard.edu/news-events/archived-news",
    linkLabel: "View archive",
    image: "/assets/images/people/jonathan-abraham.jpeg",
    imageAlt: "Portrait of Jonathan Abraham."
  },
  {
    date: "2021-12-01",
    category: "Institutional Coverage",
    source: "Harvard Gazette",
    title: "Harvard Gazette covers work forecasting antibody escape in SARS-CoV-2 variants",
    summary:
      "Harvard coverage highlighted the lab's work modeling how SARS-CoV-2 variants could evade vaccine- and antibody-derived immunity.",
    link: "https://news.harvard.edu/gazette/story/2021/12/new-study-forecasts-how-sars-cov-2-variants-could-evade-vaccines/",
    linkLabel: "Read coverage",
    image: "/assets/images/research/viral-entry-comparison.png",
    imageAlt:
      "Figure comparing viral entry determinants across alphavirus systems."
  }
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) satisfies NewsItem[];
