import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import { displayDay, displayEventDate, editionKey } from "@/lib/dates";
import { getArticle, getEdition } from "@/lib/stories";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const story = getArticle((await params).slug);
  return { title: story?.title || "Story", description: story?.standfirst || story?.briefing || undefined };
}

export default async function StoryPage({ params }: Props) {
  const story = getArticle((await params).slug);
  if (!story) notFound();
  const key = editionKey(story.calendarMonth, story.calendarDay);
  const dayLabel = displayDay(story.calendarMonth, story.calendarDay);
  const otherStories = getEdition(key).filter((other) => other.id !== story.id);
  return (
    <article className="article-page">
      <div className="article-heading">
        <p className="eyebrow">{story.sport}</p>
        <p className="article-date">{displayEventDate(story.eventDate)}</p>
        <h1>{story.title}</h1>
        {story.standfirst && <p className="standfirst">{story.standfirst}</p>}
        <p className="reading-time">{story.readingTime} min read</p>
      </div>
      <div className="article-body"><ReactMarkdown>{story.body}</ReactMarkdown></div>
      <div className="article-end">
        <Link className="text-link" href={`/editions/${key}`}>← Back to {dayLabel}</Link>
      </div>
      {otherStories.length > 0 && <aside className="more-stories">
        <h2>More from this day</h2>
        <ul>{otherStories.map((other) => <li key={other.id}>
          {other.body ? <Link href={`/stories/${other.slug}`}>{other.title} <span aria-hidden="true">→</span></Link> : <span>{other.title}</span>}
        </li>)}</ul>
      </aside>}
    </article>
  );
}
