import type { SiteData } from "./types";

export const siteData = {
  name: "Abraham Lab",
  fullName: "Jonathan Abraham Lab",
  shortInstitution: "Harvard Medical School",
  description:
    "The Abraham Lab studies viral entry, antibody recognition, and genome replication using structural biology, molecular virology, and biophysics.",
  url: process.env.SITE_URL || "https://abrahamlab.med.harvard.edu",
  heroTitle: "Mechanistic studies of viral entry, antibody escape, and genome replication.",
  heroDeck:
    "The laboratory studies receptor engagement, glycoprotein architecture, antiviral antibodies, and polymerase complexes in human viral pathogens, with emphasis on mechanisms relevant to pathogenesis and antiviral development.",
  heroFacts: [
    {
      label: "Institution",
      value: "Department of Microbiology, Blavatnik Institute, Harvard Medical School"
    },
    {
      label: "Appointments",
      value: "Harvard Medical School, Howard Hughes Medical Institute, Brigham and Women's Hospital"
    },
    {
      label: "Methods",
      value: "Structural biology, molecular virology, and biophysics"
    }
  ],
  heroProof: [
    {
      label: "Cell | 2026",
      value: "HSV-1 helicase-primase inhibition and replication fork assembly",
      href: "https://www.cell.com/cell/fulltext/S0092-8674(25)01376-5"
    },
    {
      label: "Nature Microbiology | 2025",
      value: "New World arenavirus spike glycoprotein architecture",
      href: "https://www.nature.com/articles/s41564-025-02085-6"
    },
    {
      label: "Cell | 2025",
      value: "Shifted receptor recognition in an encephalitic arbovirus",
      href: "https://www.cell.com/cell/fulltext/S0092-8674(25)00347-2"
    },
    {
      label: "HHMI | 2024-present",
      value: "Jonathan Abraham named HHMI Investigator",
      href: "https://www.hhmi.org/scientists/jonathan-abraham"
    }
  ],
  heroFigures: [
    {
      label: "Entry",
      title: "Receptor recognition across encephalitic alphaviruses",
      image: "/assets/images/research/viral-entry-comparison.png",
      alt: "Structural comparison figure showing receptor recognition features across encephalitic alphaviruses.",
      note: "Nature Communications, 2024",
      href: "https://www.nature.com/articles/s41467-024-50887-9",
      imagePosition: "center center"
    },
    {
      label: "Replication",
      title: "HSV-1 helicase-primase and replication fork assembly",
      image: "/assets/images/publications/hsv-helicase-primase.jpg",
      alt: "Publication figure showing the HSV helicase-primase complex and replication fork assembly.",
      note: "Cell, 2026",
      href: "https://www.cell.com/cell/fulltext/S0092-8674(25)01376-5",
      imagePosition: "center center"
    },
    {
      label: "Neutralization",
      title: "SARS-CoV-2 receptor-binding domain antibody evasion",
      image: "/assets/images/research/antibody-evasion.jpg",
      alt: "Structural antibody footprint figure illustrating receptor-binding domain antibody evasion.",
      note: "Science, 2022",
      href: "https://www.science.org/doi/10.1126/science.abl6251",
      imagePosition: "center center"
    }
  ],
  institutionLabel: "Institutional Affiliation",
  institutionTitle: "Department of Microbiology, Blavatnik Institute, Harvard Medical School",
  institutionSummary:
    "The laboratory is based in the Department of Microbiology at Harvard Medical School and is part of the Blavatnik Institute. Jonathan Abraham is an HHMI Investigator and also serves on the faculty of the Division of Infectious Diseases at Brigham and Women's Hospital.",
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
    institutionDisplayLines: ["Department of Microbiology", "Blavatnik Institute, Harvard Medical School"],
    addressLines: ["77 Avenue Louis Pasteur", "Veritas Science Center (VSC)", "Boston, MA 02115"],
    email: "jonathan_abraham@hms.harvard.edu",
    managerEmail: "james_spencer@hms.harvard.edu",
    mapDisplayName: "Harvard Medical School",
    homeLocationLabel: "Harvard Medical School",
    mapQuery: "Harvard Medical School, 77 Avenue Louis Pasteur, Boston, MA 02115",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Harvard+Medical+School%2C+77+Avenue+Louis+Pasteur%2C+Boston%2C+MA+02115",
    appleMapUrl:
      "https://maps.apple.com/?q=Harvard%20Medical%20School&ll=42.3387705,-71.1027833",
    mapPreviewImage: "/assets/images/location/veritas-science-center-map.svg",
    mapPreviewAlt: "Stylized locator map highlighting Harvard Medical School and Veritas Science Center (VSC) in the Longwood Medical Area.",
    mapContext: "Longwood Medical Area, Boston",
    mapBuilding: "Veritas Science Center (VSC)"
  },
  social: {
    x: "https://twitter.com/abrahamlabhms"
  }
} satisfies SiteData;
