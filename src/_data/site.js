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
    "The Abraham Lab uses molecular virology and structural biology to define receptor recognition, antibody escape, and replication mechanisms in medically important viruses, with an emphasis on emerging pathogens and human disease.",
  heroImage: "/assets/images/research/hero-emergingvirus.jpg",
  heroImageAlt:
    "Illustrated structural virology composition highlighting viral surface proteins and host receptor engagement.",
  heroImagePosition: "center 34%",
  heroDetails: [
    "Viral entry and receptor usage",
    "Antibody-mediated neutralization and escape",
    "Replication machinery and antiviral resistance"
  ],
  heroApproach:
    "Structural biology, molecular virology, protein biochemistry, genetics, and infection-focused functional assays.",
  heroDossier: [
    {
      label: "Institution",
      value: "Department of Microbiology, Blavatnik Institute, Harvard Medical School"
    },
    {
      label: "Focus",
      value: "Viral entry, antibody escape, and replication machinery"
    },
    {
      label: "Methods",
      value: "Structural biology, molecular virology, and biophysics"
    }
  ],
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
      note: "HHMI Investigator"
    }
  ],
  contact: {
    lab: "Abraham Lab",
    department: "Department of Microbiology, Blavatnik Institute, Harvard Medical School",
    addressLines: ["77 Avenue Louis Pasteur", "NRB 939", "Boston, MA 02115"],
    email: "jonathan_abraham@hms.harvard.edu",
    managerEmail: "james_spencer@hms.harvard.edu",
    mapDisplayName: "Harvard Medical School",
    homeLocationLabel: "Harvard Medical School",
    mapQuery: "Harvard Medical School, 77 Avenue Louis Pasteur, Boston, MA 02115",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Harvard+Medical+School%2C+77+Avenue+Louis+Pasteur%2C+Boston%2C+MA+02115",
    mapEmbedUrl:
      "https://www.google.com/maps?q=Harvard+Medical+School,+77+Avenue+Louis+Pasteur,+Boston,+MA+02115&z=16&output=embed",
    mapPreviewTiles: [
      "/assets/images/location/hms-map-tile-1.png",
      "/assets/images/location/hms-map-tile-2.png",
      "/assets/images/location/hms-map-tile-3.png",
      "/assets/images/location/hms-map-tile-4.png"
    ],
    mapPreviewAlt:
      "Map preview centered on Harvard Medical School in the Longwood Medical Area of Boston."
  },
  social: {
    x: "https://twitter.com/abrahamlabhms",
    bluesky: "https://bsky.app/profile/abrahamlabhms.bsky.social"
  }
};
