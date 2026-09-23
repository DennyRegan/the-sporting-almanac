import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { editionKey, londonISODate } from "./dates";

export type Sport = "football" | "boxing";

export type Story = {
  id: string;
  slug: string;
  title: string;
  order: number;
  standfirst: string;
  sport: Sport;
  eventDate: string;
  calendarMonth: number;
  calendarDay: number;
  published: boolean;
  publishOn: string;
  briefing: string;
  body: string;
  readingTime: number | null;
  event: string;
  players: string[];
  fighters: string[];
  clubs: string[];
  nationalTeams: string[];
  competitions: string[];
  countries: string[];
  decade: string[];
  era: string[];
  articleType: string[];
};

const contentRoot = path.join(process.cwd(), "content");
const sports: Sport[] = ["football", "boxing"];

function stringValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function readStory(filePath: string, sport: Sport): Story {
  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
  const slug = stringValue(data.slug) || path.basename(filePath, ".md");
  const eventDate = stringValue(data.eventDate);
  const publishOn = stringValue(data.publishOn);
  const calendarMonth = Number(data.calendarMonth);
  const calendarDay = Number(data.calendarDay);

  if (!stringValue(data.id) || !stringValue(data.title) || data.sport !== sport || !/^\d{4}-\d{2}-\d{2}$/.test(eventDate) ||
      !Number.isInteger(calendarMonth) || !Number.isInteger(calendarDay) ||
      !editionKey(calendarMonth, calendarDay).match(/^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/)) {
    throw new Error(`Missing or invalid story metadata: ${filePath}`);
  }
  const [eventYear, eventMonth, eventDay] = eventDate.split("-").map(Number);
  const date = new Date(Date.UTC(eventYear, eventMonth - 1, eventDay));
  if (date.getUTCFullYear() !== eventYear || date.getUTCMonth() + 1 !== eventMonth || date.getUTCDate() !== eventDay ||
      eventMonth !== calendarMonth || eventDay !== calendarDay) {
    throw new Error(`eventDate and calendar date must match: ${filePath}`);
  }
  if (data.published === true) {
    if (!stringValue(data.briefing)) {
      throw new Error(`A published story needs an approved briefing: ${filePath}`);
    }
    const [releaseYear, releaseMonth, releaseDay] = publishOn.split("-").map(Number);
    const releaseDate = new Date(Date.UTC(releaseYear, releaseMonth - 1, releaseDay));
    if (!/^\d{4}-\d{2}-\d{2}$/.test(publishOn) ||
        releaseDate.getUTCFullYear() !== releaseYear || releaseDate.getUTCMonth() + 1 !== releaseMonth ||
        releaseDate.getUTCDate() !== releaseDay ||
        releaseMonth !== calendarMonth || releaseDay !== calendarDay) {
      throw new Error(`publishOn must be a valid release date matching the calendar date: ${filePath}`);
    }
  }

  const body = content.trim();
  const words = body.split(/\s+/).filter(Boolean).length;
  const explicitTime = Number(data.readingTime);

  return {
    id: data.id,
    slug,
    title: data.title,
    order: Number.isFinite(Number(data.order)) ? Number(data.order) : 999,
    standfirst: stringValue(data.standfirst),
    sport,
    eventDate,
    calendarMonth,
    calendarDay,
    published: data.published === true,
    publishOn,
    briefing: stringValue(data.briefing),
    body,
    readingTime: body ? (Number.isFinite(explicitTime) && explicitTime > 0 ? Math.ceil(explicitTime) : Math.max(1, Math.ceil(words / 220))) : null,
    event: stringValue(data.event),
    players: stringList(data.players),
    fighters: stringList(data.fighters),
    clubs: stringList(data.clubs),
    nationalTeams: stringList(data.nationalTeams),
    competitions: stringList(data.competitions),
    countries: stringList(data.countries),
    decade: stringList(data.decade),
    era: stringList(data.era),
    articleType: stringList(data.articleType),
  };
}

export function getStories(now: Date = new Date()): Story[] {
  const stories = sports.flatMap((sport) => {
    const folder = path.join(contentRoot, sport);
    if (!fs.existsSync(folder)) return [];
    return fs.readdirSync(folder)
      .filter((filename) => filename.endsWith(".md"))
      .map((filename) => readStory(path.join(folder, filename), sport));
  });
  const slugs = new Set<string>();
  const ids = new Set<string>();
  for (const story of stories) {
    if (slugs.has(story.slug)) throw new Error(`Duplicate story slug: ${story.slug}`);
    if (ids.has(story.id)) throw new Error(`Duplicate story id: ${story.id}`);
    slugs.add(story.slug);
    ids.add(story.id);
  }
  const londonToday = londonISODate(now);
  return stories.filter((story) => story.published && story.publishOn <= londonToday)
    .sort((a, b) => a.order - b.order || a.eventDate.localeCompare(b.eventDate));
}

export function getEdition(key: string, now: Date = new Date()): Story[] {
  return getStories(now).filter((story) => editionKey(story.calendarMonth, story.calendarDay) === key);
}

export function getEditionKeys(now: Date = new Date()): string[] {
  return [...new Set(getStories(now).map((story) => editionKey(story.calendarMonth, story.calendarDay)))].sort((a, b) => b.localeCompare(a));
}

export function getArticle(slug: string, now: Date = new Date()): Story | undefined {
  return getStories(now).find((story) => story.slug === slug && Boolean(story.body));
}
