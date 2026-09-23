import { displayDay, londonMonthDay, parseEditionKey } from "@/lib/dates";
import { getEdition } from "@/lib/stories";
import { Edition } from "./ui";

export const dynamic = "force-dynamic";

export default function TodayPage() {
  const key = londonMonthDay();
  const parsed = parseEditionKey(key)!;
  return <Edition dayLabel={displayDay(parsed.month, parsed.day)} stories={getEdition(key)} isToday />;
}
