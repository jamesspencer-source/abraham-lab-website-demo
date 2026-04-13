import type { ResearchProgram } from "./types";

export const researchPrograms = [
  {
    title: "Viral entry",
    keyQuestion: "Which receptor interactions and fusion steps define cellular entry?",
    importance:
      "Receptor engagement and membrane fusion define tropism and establish the first committed step in infection.",
    summary:
      "The lab resolves how viral attachment and fusion proteins engage host receptors and how those interfaces vary across strains, tissues, and host species.",
    paragraphs: [
      "Entry is the first irreversible commitment to infection, making receptor recognition and fusion machinery central determinants of viral tropism and pathogenesis.",
      "Using structural biology, receptor-focused experiments, and functional virology, the group defines how viral surface proteins engage host factors and how those interactions shift across related viruses."
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
    keyQuestion: "Which glycoprotein surfaces remain accessible to neutralizing antibodies?",
    importance:
      "Neutralization depends on defined structural epitopes, conformational states, and routes of escape.",
    summary:
      "The group maps glycoprotein architecture and antibody interfaces to distinguish durable neutralizing sites from strain-specific recognition.",
    paragraphs: [
      "Neutralizing antibodies can act by blocking receptor engagement or by constraining the structural transitions required for membrane fusion.",
      "The lab combines glycoprotein structure determination, monoclonal antibody analysis, and mechanistic neutralization experiments to define which viral surfaces support broad recognition and which readily escape."
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
    keyQuestion: "How do viral polymerase assemblies govern replication, inhibition, and resistance?",
    importance:
      "Replication complexes contain essential enzymology and many clinically relevant antiviral targets.",
    summary:
      "The lab analyzes polymerase assemblies, inhibitor engagement, and resistance mutations in DNA and RNA virus systems.",
    paragraphs: [
      "After entry, genome replication and transcription depend on specialized polymerase complexes with distinctive structural organization and catalytic logic.",
      "By resolving polymerase assemblies, inhibitor interactions, and resistance mechanisms, the group connects structural observations to drug action and antiviral failure."
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
