import type { Person, Publication } from "../data/types";

const PEOPLE_GROUP_ORDER = [
  "Leadership",
  "Postdoctoral Fellows",
  "Graduate Students",
  "Operations & Strategy"
] as const;

export function withBase(path = "/") {
  if (/^(https?:|mailto:|tel:)/.test(path)) {
    return path;
  }

  const base = import.meta.env.BASE_URL || "/";
  const normalized = path === "/" ? "" : path.replace(/^\/+/, "");
  return `${base}${normalized}`;
}

export function featuredOnly(items: Publication[]) {
  return [...items]
    .filter((item) => Boolean(item.featured))
    .sort(comparePublicationDates);
}

export function limitItems<T>(items: T[], count: number) {
  return items.slice(0, count);
}

export function groupPublicationsByYear(items: Publication[]) {
  const grouped = new Map<number, Publication[]>();

  for (const item of [...items].sort(comparePublicationDates)) {
    if (!grouped.has(item.year)) {
      grouped.set(item.year, []);
    }
    grouped.get(item.year)?.push(item);
  }

  return [...grouped.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, entries]) => ({ year, entries }));
}

export function groupPeople(items: Person[]) {
  const grouped = new Map<Person["group"], Person[]>();

  for (const item of [...items].sort((a, b) => a.order - b.order)) {
    if (!grouped.has(item.group)) {
      grouped.set(item.group, []);
    }
    grouped.get(item.group)?.push(item);
  }

  return PEOPLE_GROUP_ORDER.map((label) => ({
    label,
    entries: grouped.get(label) ?? []
  })).filter((group) => group.entries.length > 0);
}

export function formatDateLabel(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

export function formatMonthYear(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}

function comparePublicationDates(a: Publication, b: Publication) {
  const left = a.publishedAt ? new Date(a.publishedAt).getTime() : new Date(`${a.year}-01-01`).getTime();
  const right = b.publishedAt ? new Date(b.publishedAt).getTime() : new Date(`${b.year}-01-01`).getTime();
  return right - left;
}
