import type { SiteData } from "./types";

export const siteData = {
  name: "Abraham Lab",
  fullName: "Jonathan Abraham Lab",
  shortInstitution: "Harvard Medical School",
  description:
    "The Abraham Lab studies how medically important viruses enter cells, evade antibodies, and replicate.",
  url: process.env.SITE_URL || "https://abrahamlab.med.harvard.edu",
  theme: {
    defaultMode: "system"
  },
  heroTitle: "Mechanisms of viral infection.",
  heroDeck:
    "The Abraham Lab studies how medically important viruses enter cells, evade antibodies, and replicate. Recent work resolves HSV-1 replication machinery, New World arenavirus spike organization, and receptor recognition by encephalitic alphaviruses.",
  heroFigures: [
    {
      label: "Nature Microbiology | 2025",
      title: "Molecular organization of the New World arenavirus spike glycoprotein complex",
      image: "/assets/images/publications/arenavirus-gpc.jpeg",
      alt: "Cryo-EM figure showing the prefusion architecture of the New World arenavirus glycoprotein complex.",
      note: "Open-access structural study",
      href: "https://www.nature.com/articles/s41564-025-02085-6",
      imagePosition: "center 42%"
    },
    {
      label: "Cell | 2025",
      title: "Molecular basis for shifted receptor recognition by an encephalitic arbovirus",
      image: "/assets/images/publications/weev-structures.jpeg",
      alt: "Composite structural figure from the 2025 Cell paper on shifted receptor recognition by an encephalitic arbovirus.",
      note: "Entry biology",
      href: "https://www.cell.com/cell/fulltext/S0092-8674(25)00347-2",
      imagePosition: "center 40%"
    },
    {
      label: "Cell | 2026",
      title: "HSV-1 helicase-primase and replication fork assembly",
      image: "/assets/images/publications/hsv-helicase-primase.jpg",
      alt: "Structural figure showing the HSV-1 helicase-primase complex and replication fork assembly.",
      note: "Replication machinery",
      href: "https://www.cell.com/cell/fulltext/S0092-8674(25)01376-5",
      imagePosition: "center 34%"
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
      "https://maps.google.com/maps?q=42.33825%2C-71.10362&t=m&z=17&ie=UTF8&iwloc=&output=embed",
    mapBuilding: "Veritas Science Center (VSC)"
  },
  social: {
    x: "https://twitter.com/abrahamlabhms"
  }
} satisfies SiteData;
