import type { ResearchProgram } from "./types";

export const researchPrograms = [
  {
    title: "Receptor engagement and entry",
    keyQuestion: "Which host receptors and entry interfaces determine tropism and cross-species risk?",
    importance: "Entry sets the first committed step in infection and constrains tissue tropism.",
    summary:
      "The lab defines how viral surface proteins recognize host receptors and how those interfaces shift across related viruses.",
    paragraphs: [
      "Entry is the first irreversible commitment to infection, making receptor recognition and membrane-fusion machinery central determinants of viral tropism.",
      "Using structural biology, receptor-binding experiments, and functional virology, the laboratory defines how viral surface proteins engage host factors across related viruses."
    ],
    systems: ["alphaviruses", "arenaviruses", "arthropod-borne viruses"],
    methods: [
      "structural biology",
      "receptor-binding experiments",
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
      },
      {
        title: "VLDLR and ApoER2 are receptors for multiple alphaviruses",
        journal: "Nature",
        year: 2022,
        href: "https://www.nature.com/articles/s41586-021-04326-0",
        note: "Identifies VLDLR and ApoER2 as alphavirus receptors."
      }
    ]
  },
  {
    title: "Glycoprotein architecture and antibody recognition",
    keyQuestion: "Which glycoprotein surfaces support neutralization, and which support escape?",
    importance: "Neutralization depends on defined epitopes and conformational control.",
    summary:
      "The group maps glycoprotein architecture and antibody interfaces to distinguish conserved recognition surfaces from escape-prone regions.",
    paragraphs: [
      "Neutralizing antibodies can block receptor engagement or constrain the structural transitions required for membrane fusion.",
      "The laboratory combines glycoprotein structure determination, monoclonal antibody analysis, and mechanistic neutralization experiments to define which viral surfaces support broad recognition and which readily escape."
    ],
    systems: ["SARS-CoV-2", "alphaviruses", "mammarenaviruses"],
    methods: [
      "structural analysis",
      "epitope mapping",
      "neutralization assays",
      "monoclonal antibody analysis"
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
      },
      {
        title: "Vaccine-elicited receptor-binding site antibodies neutralize two New World hemorrhagic fever arenaviruses",
        journal: "Nature Communications",
        year: 2018,
        href: "https://www.nature.com/articles/s41467-018-04271-z",
        note: "Defines a neutralizing antibody response against New World arenaviruses."
      }
    ]
  },
  {
    title: "Replication complexes and antiviral mechanism",
    keyQuestion: "How do viral replication assemblies govern inhibition and resistance?",
    importance: "Replication complexes contain enzymology and drug targets.",
    summary:
      "The laboratory analyzes polymerase assemblies, inhibitor engagement, and resistance in DNA and RNA virus systems.",
    paragraphs: [
      "After entry, genome replication and transcription depend on specialized polymerase complexes with distinctive structural organization and catalytic logic.",
      "By resolving polymerase assemblies, inhibitor interactions, and resistance mechanisms, the group connects structural observations to drug action and antiviral failure."
    ],
    systems: ["herpesviruses", "RNA viruses", "replication fork complexes"],
    methods: [
      "single-particle cryo-EM",
      "mechanistic enzymology",
      "single-molecule assays",
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
