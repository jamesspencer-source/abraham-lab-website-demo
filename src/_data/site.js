module.exports = {
  name: "Abraham Lab",
  fullName: "Jonathan Abraham Lab",
  shortInstitution: "Harvard Medical School",
  basePath: process.env.SITE_BASE_PATH || "",
  description:
    "The Abraham Lab uses molecular virology and structural biology to understand how viruses enter cells, evade neutralizing antibodies, and replicate, with a focus on emerging viruses and human disease.",
  url: process.env.SITE_URL || "https://abrahamlab.med.harvard.edu",
  heroTitle:
    "Understanding how viruses enter cells, evade antibodies, and replicate.",
  heroDeck:
    "The Abraham Lab uses molecular virology and structural biology to study receptor recognition, antibody escape, and replication machinery in medically important viruses, with an emphasis on emerging pathogens and human disease.",
  heroDetails: [
    "Viral entry and receptor usage",
    "Antibody-mediated neutralization and escape",
    "Replication machinery and antiviral resistance"
  ],
  heroApproach:
    "Structural biology, molecular virology, protein biochemistry, genetics, and infection-focused functional assays.",
  institutionLabel: "Institutional Affiliation",
  institutionTitle: "Department of Microbiology, Blavatnik Institute, Harvard Medical School",
  institutionSummary:
    "The laboratory is part of the Department of Microbiology at Harvard Medical School's Blavatnik Institute and studies viral infection mechanisms with direct relevance to outbreak preparedness, immune evasion, and antiviral strategy.",
  tagline:
    "Structural virology and molecular mechanisms of viral entry, neutralization, and genome replication.",
  nav: [
    { label: "Home", href: "/" },
    { label: "Research", href: "/research/" },
    { label: "Publications", href: "/publications/" },
    { label: "Jonathan Abraham", href: "/jonathan-abraham/" },
    { label: "People", href: "/people/" },
    { label: "News", href: "/news/" },
    { label: "Contact", href: "/contact/" }
  ],
  affiliations: [
    {
      name: "Harvard Medical School Department of Microbiology",
      shortName: "HMS Microbiology",
      href: "https://micro.hms.harvard.edu/",
      logo: "/assets/images/brands/hms-microbiology-logo.svg",
      alt: "Harvard Medical School Department of Microbiology",
      note: "Blavatnik Institute, Harvard Medical School"
    },
    {
      name: "Howard Hughes Medical Institute",
      shortName: "Howard Hughes Medical Institute",
      href: "https://www.hhmi.org/",
      logo: "/assets/images/brands/hhmi-horizontal-signature-color.png",
      alt: "Howard Hughes Medical Institute",
      note: "Investigator affiliation"
    }
  ],
  contact: {
    lab: "Abraham Lab",
    department: "Department of Microbiology, Blavatnik Institute, Harvard Medical School",
    addressLines: ["77 Avenue Louis Pasteur", "NRB 939", "Boston, MA 02115"],
    email: "jonathan_abraham@hms.harvard.edu",
    managerEmail: "james_spencer@hms.harvard.edu",
    mapUrl:
      "https://www.google.com/maps/search/77+Avenue+Louis+Pasteur+Boston+MA+02115",
    mapEmbedUrl:
      "https://www.google.com/maps?q=77+Avenue+Louis+Pasteur,+Boston,+MA+02115&z=16&output=embed"
  },
  social: {
    x: "https://twitter.com/abrahamlabhms",
    bluesky: "https://bsky.app/profile/abrahamlabhms.bsky.social"
  }
};
