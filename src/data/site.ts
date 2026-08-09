import type { SiteData } from "./types";

export const siteData = {
  name: "Abraham Lab",
  fullName: "Jonathan Abraham Lab",
  shortInstitution: "Harvard Medical School",
  description:
    "The Abraham Lab studies the mechanisms of viral infection at Harvard Medical School.",
  url: process.env.SITE_URL || "https://abrahamlab.med.harvard.edu",
  theme: {
    defaultMode: "system"
  },
  heroTitle: "Mechanisms of viral infection.",
  heroDeck:
    "We study how medically important viruses enter cells, avoid antibodies, and replicate. We use structural biology and virology to define these steps and how antiviral drugs block them.",
  heroFigures: [
    {
      label: "Nature Microbiology · 2025",
      title: "Molecular organization of the New World arenavirus spike glycoprotein complex",
      image: "/assets/images/publications/arenavirus-gpc-figure-2.png",
      alt: "Cryo-EM structures and biochemical measurements of the Machupo virus glycoprotein complex.",
      note: "Open-access figure",
      href: "https://www.nature.com/articles/s41564-025-02085-6",
      imagePosition: "center",
      figureCredit: "Mann et al., Nature Microbiology (2025)",
      figureNumber: "Figure 2",
      license: "CC BY 4.0",
      visualSource: "https://www.nature.com/articles/s41564-025-02085-6/figures/2"
    }
  ],
  institutionLabel: "Affiliation",
  institutionTitle: "Department of Microbiology, Blavatnik Institute, Harvard Medical School",
  institutionSummary:
    "Based in the Department of Microbiology at Harvard Medical School. Jonathan Abraham is an HHMI Investigator.",
  tagline: "Mechanisms of viral entry, antibody recognition, and replication.",
  nav: [
    { label: "Home", href: "/" },
    { label: "Publications", href: "/publications/" },
    { label: "Jonathan Abraham", href: "/jonathan-abraham/" },
    { label: "Team", href: "/team/" },
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
    institutionDisplayLines: ["Department of Microbiology", "Blavatnik Institute, Harvard Medical School"],
    addressLines: ["Veritas Science Center (VSC)", "77 Avenue Louis Pasteur", "Boston, MA 02115"],
    email: "jonathan_abraham@hms.harvard.edu",
    managerEmail: "james_spencer@hms.harvard.edu",
    mapDisplayName: "Harvard Medical School",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Veritas+Science+Center%2C+77+Avenue+Louis+Pasteur%2C+Boston%2C+MA+02115",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=42.33825%2C-71.10362&t=m&z=15&ie=UTF8&iwloc=&output=embed",
    mapBuilding: "Veritas Science Center (VSC)"
  },
  social: {
    x: "https://twitter.com/abrahamlabhms"
  }
} satisfies SiteData;
