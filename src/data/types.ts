export type NavItem = {
  label: string;
  href: string;
};

export type ThemeSettings = {
  defaultMode: "system";
};

export type HeroFactItem = {
  label: string;
  value: string;
};

export type HeroFigure = {
  label: string;
  title: string;
  image: string;
  alt: string;
  note?: string;
  href?: string;
  imagePosition?: string;
};

export type Affiliation = {
  name: string;
  shortName?: string;
  href: string;
  logo: string;
  alt: string;
  note?: string;
};

export type ContactData = {
  lab: string;
  department: string;
  institutionDisplayLines?: string[];
  addressLines: string[];
  email: string;
  managerEmail: string;
  mapDisplayName: string;
  mapUrl: string;
  mapEmbedUrl: string;
  mapBuilding: string;
};

export type SiteData = {
  name: string;
  fullName: string;
  shortInstitution: string;
  description: string;
  url: string;
  theme: ThemeSettings;
  heroTitle: string;
  heroDeck: string;
  heroFacts: HeroFactItem[];
  heroFigures: HeroFigure[];
  institutionLabel: string;
  institutionTitle: string;
  institutionSummary: string;
  tagline: string;
  nav: NavItem[];
  affiliations: Affiliation[];
  contact: ContactData;
  social: {
    x: string;
    bluesky?: string;
  };
};

export type PublicationReference = {
  title: string;
  journal: string;
  year: number;
  href: string;
  note?: string;
};

export type ResearchProgram = {
  title: string;
  keyQuestion: string;
  importance: string;
  summary: string;
  paragraphs: string[];
  systems: string[];
  methods: string[];
  image: string;
  imagePosition?: string;
  imageAlt: string;
  papers: PublicationReference[];
};

export type Publication = {
  year: number;
  title: string;
  citation: string;
  link: string;
  authors?: string;
  journal?: string;
  publishedAt?: string;
  doi?: string;
  pmid?: string;
  featured?: boolean;
  leadFeature?: boolean;
  homepageProof?: boolean;
  foundational?: boolean;
  system?: string;
  methodCluster?: string;
  significanceLine?: string;
  openAccess?: boolean;
  coverageLinks?: string[];
  summary?: string;
  image?: string;
  imagePosition?: string;
  imageAlt?: string;
  visualReuseStatus?: "open-access" | "lab-approved" | "link-only";
};

export type NewsItem = {
  date: string;
  category: string;
  source: string;
  title: string;
  summary: string;
  link: string;
  linkLabel?: string;
  homepageEligible?: boolean;
  milestoneTier?: "major" | "secondary";
  image?: string;
  imageAlt?: string;
};

export type Person = {
  name: string;
  title: string;
  note?: string;
  roleSummary?: string;
  programTags?: Array<"Virology" | "MD-PhD / Biophysics" | "MD-PhD / Biological and Biomedical Sciences">;
  group: "Leadership" | "Postdoctoral Fellows & Instructors" | "Graduate Students" | "Operations & Strategy";
  image: string;
  imageAlt: string;
  imagePosition?: string;
  order: number;
};

export type AlumniEntry = {
  name: string;
  destination?: string;
};

export type AlumniGroup = {
  label: string;
  entries: AlumniEntry[];
};

export type PeopleData = {
  currentMembers: Person[];
  alumni: AlumniGroup[];
};

export type JonathanProfile = {
  name: string;
  title: string;
  secondaryTitle: string;
  portrait: string;
  portraitAlt: string;
  portraitPosition?: string;
  overview: string;
  biography: string[];
  appointments: string[];
  distinctions: string[];
  focusAreas: string[];
  representativeWork: string[];
};
