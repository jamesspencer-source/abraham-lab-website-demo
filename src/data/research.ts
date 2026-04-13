import type { ResearchProgram } from "./types";

export const researchPrograms = [
  {
    title: "Viral entry",
    keyQuestion: "How do viruses identify susceptible cells and commit to entry?",
    importance:
      "Entry determines which cells and tissues become susceptible to infection and exposes one of the clearest intervention points in the viral life cycle.",
    summary:
      "The lab defines receptor usage and membrane-fusion mechanisms that set tropism, pathogenesis, and the first actionable step in infection.",
    paragraphs: [
      "Entry is the first irreversible commitment to infection, making receptor recognition and fusion machinery central determinants of tropism, pathogenesis, and therapeutic opportunity.",
      "Using structural biology, functional virology, and receptor-focused experiments, the group resolves how viral surface proteins engage host factors and how those interactions change across strains, host species, and disease contexts."
    ],
    systems: ["alphaviruses", "arenaviruses", "arthropod-borne viruses"],
    methods: [
      "CRISPR-Cas9 screens",
      "structural biology",
      "protein biochemistry",
      "cell-based infection assays"
    ],
    image: "/assets/images/research/viral-entry-comparison.png",
    imagePosition: "center 44%",
    imageAlt:
      "Structural comparison figure showing receptor recognition features across encephalitic alphaviruses.",
    papers: [
      {
        title: "Molecular basis for shifted receptor recognition by an encephalitic arbovirus",
        journal: "Cell",
        year: 2025,
        href: "https://www.cell.com/cell/fulltext/S0092-8674(25)00347-2",
        note: "Defines altered receptor usage in an encephalitic arbovirus."
      },
      {
        title: "Structural basis for VLDLR recognition by eastern equine encephalitis virus",
        journal: "Nature Communications",
        year: 2024,
        href: "https://www.nature.com/articles/s41467-024-50887-9",
        note: "Resolves how eastern equine encephalitis virus engages VLDLR."
      }
    ]
  },
  {
    title: "Antiviral antibodies and glycoprotein vulnerability",
    keyQuestion: "Which viral surface features remain vulnerable to neutralization?",
    importance:
      "Antibody responses can prevent infection or lose ground to viral variation, making neutralization breadth and escape central to durable countermeasure design.",
    summary:
      "The group maps high-resolution antibody-virus interfaces and glycoprotein architecture to understand neutralization breadth, vulnerability, and routes of immune evasion.",
    paragraphs: [
      "Neutralizing antibodies can act by preventing receptor engagement or by locking viral glycoproteins away from the structural transitions needed for membrane fusion.",
      "The lab combines glycoprotein structure determination, monoclonal antibody analysis, and mechanistic neutralization experiments to identify surfaces that remain exploitable across strain variation and emerging threats."
    ],
    systems: ["SARS-CoV-2", "alphaviruses", "mammarenaviruses"],
    methods: [
      "monoclonal antibody isolation",
      "epitope mapping",
      "structural analysis",
      "neutralization assays"
    ],
    image: "/assets/images/research/antibody-evasion.jpg",
    imagePosition: "center 38%",
    imageAlt:
      "Structural antibody footprint figure illustrating receptor-binding domain antibody evasion.",
    papers: [
      {
        title: "Molecular organization of the New World arenavirus spike glycoprotein complex",
        journal: "Nature Microbiology",
        year: 2025,
        href: "https://www.nature.com/articles/s41564-025-02085-6",
        note: "Defines arenavirus glycoprotein complex organization with implications for fusion control."
      },
      {
        title: "Structural basis for continued antibody evasion by the SARS-CoV-2 receptor-binding domain",
        journal: "Science",
        year: 2022,
        href: "https://www.science.org/doi/10.1126/science.abl6251",
        note: "Maps convergent routes of antibody escape in SARS-CoV-2."
      }
    ]
  },
  {
    title: "Viral polymerases",
    keyQuestion: "How does replication machinery create leverage for antiviral design?",
    importance:
      "Replication machinery is essential to viral propagation and provides a direct route to mechanism-based antiviral development and resistance analysis.",
    summary:
      "The lab investigates replication machinery as both a core engine of infection and a structural framework for understanding drug action and resistance.",
    paragraphs: [
      "Once viruses enter cells, genome replication and transcription depend on specialized polymerase complexes with distinctive structural and mechanistic vulnerabilities.",
      "By resolving polymerase assemblies, inhibitor interactions, and resistance mechanisms, the group aims to define features that can be exploited for more durable antiviral development."
    ],
    systems: ["herpesviruses", "RNA viruses", "replication fork complexes"],
    methods: [
      "protein biochemistry",
      "single-particle cryo-EM",
      "mechanistic enzymology",
      "drug-resistance analysis"
    ],
    image: "/assets/images/research/polymerase-complex.jpg",
    imagePosition: "center 42%",
    imageAlt:
      "Structural figure of a viral polymerase complex highlighting replication machinery architecture.",
    papers: [
      {
        title: "Mechanisms of HSV-1 helicase-primase inhibition and replication fork complex assembly",
        journal: "Cell",
        year: 2026,
        href: "https://www.cell.com/cell/fulltext/S0092-8674(25)01376-5",
        note: "Explains how a clinically relevant antiviral class disables an HSV enzyme complex."
      },
      {
        title: "Structural and functional analysis of the Nipah virus polymerase complex",
        journal: "Cell",
        year: 2025,
        href: "https://pubmed.ncbi.nlm.nih.gov/39837328/",
        note: "Defines the Nipah polymerase complex and features relevant to antiviral development."
      },
      {
        title: "Viral DNA polymerase structures reveal mechanisms of antiviral drug resistance",
        journal: "Cell",
        year: 2024,
        href: "https://www.cell.com/cell/fulltext/S0092-8674(24)00842-0",
        note: "Clarifies structural routes to clinically relevant drug resistance."
      }
    ]
  }
] satisfies ResearchProgram[];
