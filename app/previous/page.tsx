import Link from "next/link";
import { displayDay, parseEditionKey } from "@/lib/dates";
import { getEditionKeys } from "@/lib/stories";

export const metadata = { title: "Previous Editions" };

export default function PreviousPage() {
  const dates = getEditionKeys();
  return (
    <div className="previous-page">
      <div className="edition-heading">
        <p className="eyebrow">The archive</p>
        <h1>Previous Editions</h1>
      </div>
      {dates.length ? <ul className="edition-list">
        {dates.map((key) => {
          const { month, day } = parseEditionKey(key)!;
          return <li key={key}><Link href={`/editions/${key}`}><span>{displayDay(month, day)}</span><span aria-hidden="true">→</span></Link></li>;
        })}
      </ul> : <p>No editions have been published yet.</p>}
    </div>
  );
}
