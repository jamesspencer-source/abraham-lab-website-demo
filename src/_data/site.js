module.exports = {
  name: "Abraham Lab",
  fullName: "Jonathan Abraham Lab",
  shortInstitution: "Harvard Medical School",
  basePath: process.env.SITE_BASE_PATH || "",
  description:
    "The Abraham Lab at Harvard Medical School investigates viral entry, antibody neutralization, and polymerase function through structural biology, molecular virology, and biophysics.",
  url: process.env.SITE_URL || "https://abrahamlab.med.harvard.edu",
  heroTitle:
    "Resolving the molecular determinants of viral entry, immune escape, and genome replication.",
  heroDeck:
    "The Abraham Lab integrates structural biology, molecular virology, cell-based genetics, and biophysics to define how medically significant viruses engage host receptors, evade antibody pressure, and assemble replication machinery.",
  heroDetails: [
    "Viral entry and receptor usage",
    "Antibody-mediated neutralization and escape",
    "Replication machinery and antiviral resistance"
  ],
  heroApproach:
    "Structural biology, molecular virology, protein biochemistry, and infection-focused functional assays.",
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
      href: "https://micro.hms.harvard.edu/",
      logo: "/assets/images/brands/hms-microbiology-logo.svg",
      alt: "Harvard Medical School Department of Microbiology"
    },
    {
      name: "Howard Hughes Medical Institute",
      href: "https://www.hhmi.org/",
      logo: "/assets/images/brands/hhmi-horizontal-signature-color.png",
      alt: "Howard Hughes Medical Institute"
    }
  ],
  contact: {
    lab: "Abraham Lab",
    department: "Department of Microbiology, Blavatnik Institute, Harvard Medical School",
    addressLines: ["77 Avenue Louis Pasteur", "NRB 939", "Boston, MA 02115"],
    email: "jonathan_abraham@hms.harvard.edu",
    managerEmail: "james_spencer@hms.harvard.edu",
    mapUrl:
      "https://www.google.com/maps/search/77+Avenue+Louis+Pasteur+Boston+MA+02115"
  },
  social: {
    x: "https://twitter.com/AbrahamLabHMS"
  }
};
