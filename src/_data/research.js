module.exports = [
  {
    title: "Viral entry",
    lead: "How viruses identify susceptible cells and trigger fusion.",
    summary:
      "The lab defines receptor usage and membrane-fusion mechanisms that set tropism, pathogenesis, and the first actionable step in infection.",
    intro:
      "The lab studies how viral surface proteins recognize host receptors and trigger membrane fusion.",
    paragraphs: [
      "Entry is the first irreversible commitment to infection, making receptor recognition and fusion machinery central determinants of tropism, pathogenesis, and therapeutic opportunity.",
      "The group uses CRISPR-based discovery, protein biochemistry, biophysics, cryo-EM, and crystallography to define how viruses engage specific receptors and how those interactions shape susceptibility in target tissues."
    ],
    systems: ["alphaviruses", "arenaviruses", "arthropod-borne viruses"],
    methods: [
      "CRISPR-Cas9 screens",
      "structural biology",
      "protein biochemistry",
      "cell-based infection assays"
    ],
    image: "/assets/images/research/viral-entry-comparison.png",
    imageAlt:
      "Structural comparison figure showing receptor recognition features across encephalitic alphaviruses.",
    relatedPublication: "Structural basis for VLDLR recognition by eastern equine encephalitis virus"
  },
  {
    title: "Antibody neutralization",
    lead: "How antiviral antibodies block infection and where escape emerges.",
    summary:
      "The group maps high-resolution antibody-virus interfaces to understand neutralization breadth, vulnerability, and routes of immune evasion.",
    intro:
      "The lab defines how antiviral antibodies block attachment, fusion, and conformational change.",
    paragraphs: [
      "Neutralizing antibodies can act by preventing receptor engagement or by locking viral glycoproteins away from the structural transitions needed for membrane fusion.",
      "The group isolates antiviral monoclonal antibodies, maps their epitopes at high resolution, and uses those findings to identify combinations most likely to remain effective across strain variation and emerging threats."
    ],
    systems: ["SARS-CoV-2", "alphaviruses", "mammarenaviruses"],
    methods: [
      "monoclonal antibody isolation",
      "epitope mapping",
      "structural analysis",
      "neutralization assays"
    ],
    image: "/assets/images/research/antibody-evasion.jpg",
    imageAlt:
      "Structural antibody footprint figure illustrating receptor-binding domain antibody evasion.",
    relatedPublication: "Structural basis for continued antibody evasion by the SARS-CoV-2 receptor-binding domain"
  },
  {
    title: "Viral polymerases",
    lead: "How replication complexes create liabilities for durable antiviral design.",
    summary:
      "The lab investigates replication machinery as both a core engine of infection and a structural framework for understanding drug action and resistance.",
    intro:
      "The lab investigates viral polymerases as core engines of replication and as tractable drug targets.",
    paragraphs: [
      "Once viruses enter cells, genome replication and transcription depend on specialized polymerase complexes with distinctive structural and mechanistic vulnerabilities.",
      "By characterizing polymerase assemblies and resistance mechanisms, the lab aims to define features that can be exploited for more durable antiviral development."
    ],
    systems: ["herpesviruses", "RNA viruses", "replication fork complexes"],
    methods: [
      "protein biochemistry",
      "single-particle cryo-EM",
      "mechanistic enzymology",
      "drug-resistance analysis"
    ],
    image: "/assets/images/research/polymerase-complex.jpg",
    imageAlt:
      "Structural figure of a viral polymerase complex highlighting replication machinery architecture.",
    relatedPublication: "Viral DNA polymerase structures reveal mechanisms of antiviral drug resistance"
  }
];
