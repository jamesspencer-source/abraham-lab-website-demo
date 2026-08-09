import type { NewsItem } from "./types";

const newsItemsList: NewsItem[] = [
  {
    date: "2026-03-03",
    category: "Institutional coverage",
    source: "HMS Office for Graduate Education",
    title: "Inside the Labs of HMS: Preventing the Next Pandemic",
    summary: "An HMS film follows the Abraham Lab as its members study how viruses infect cells.",
    link: "https://www.youtube.com/shorts/GFM3KLZCDps",
    linkLabel: "Watch the HMS film",
    homepageEligible: true,
    milestoneTier: "major"
  },
  {
    date: "2026-01-08",
    category: "Institutional coverage",
    source: "Harvard Medical School",
    title: "Researchers now understand how a new class of antivirals works",
    summary: "HMS reports on work showing how helicase-primase inhibitors disable a herpesvirus enzyme complex.",
    link: "https://hms.harvard.edu/news/researchers-now-understand-how-new-class-antivirals-works",
    linkLabel: "Read the HMS story",
    homepageEligible: true,
    milestoneTier: "major"
  }
];

export const newsItems = newsItemsList.sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);
