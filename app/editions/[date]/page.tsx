import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { displayDay, parseEditionKey } from "@/lib/dates";
import { getEdition } from "@/lib/stories";
import { Edition } from "@/app/ui";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ date: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const parsed = parseEditionKey((await params).date);
  return { title: parsed ? displayDay(parsed.month, parsed.day) : "Edition" };
}

export default async function EditionPage({ params }: Props) {
  const key = (await params).date;
  const parsed = parseEditionKey(key);
  if (!parsed) notFound();
  const stories = getEdition(key);
  if (!stories.length) notFound();
  return <Edition dayLabel={displayDay(parsed.month, parsed.day)} stories={stories} />;
}
