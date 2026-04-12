export type NavItem = {
  label: string;
  href: string;
};

export type HeroDossierItem = {
  label: string;
  value: string;
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
  addressLines: string[];
  email: string;
  managerEmail: string;
  mapDisplayName: string;
  homeLocationLabel: string;
  mapQuery: string;
  mapUrl: string;
  mapEmbedUrl: string;
  mapContext: string;
  mapBuilding: string;
};

export type SiteData = {
  name: string;
  fullName: string;
  shortInstitution: string;
  description: string;
  url: string;
  heroTitle: string;
  heroDeck: string;
  heroImage: string;
  heroImageAlt: string;
  heroImagePosition?: string;
  heroDossier: HeroDossierItem[];
  institutionLabel: string;
  institutionTitle: string;
  institutionSummary: string;
  tagline: string;
  nav: NavItem[];
  affiliations: Affiliation[];
  contact: ContactData;
  social: {
    x: string;
    bluesky: string;
  };
};

export type ResearchProgram = {
  title: string;
  lead: string;
  importance: string;
  summary: string;
  intro: string;
  paragraphs: string[];
  systems: string[];
  methods: string[];
  image: string;
  imagePosition?: string;
  imageAlt: string;
  relatedPublication: string;
  relatedLink: string;
};

export type Publication = {
  year: number;
  title: string;
  citation: string;
  link: string;
  doi?: string;
  featured?: boolean;
  summary?: string;
  image?: string;
  imagePosition?: string;
  imageAlt?: string;
};

export type NewsItem = {
  sort: number;
  dateLabel: string;
  category: string;
  sourceType: string;
  title: string;
  summary: string;
  link: string;
  linkLabel?: string;
  image?: string;
  imageAlt?: string;
};

export type Person = {
  name: string;
  title: string;
  note?: string;
  group: "Leadership" | "Postdoctoral Fellows" | "Graduate Students" | "Operations & Strategy";
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
