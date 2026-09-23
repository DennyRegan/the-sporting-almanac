import Link from "next/link";
import type { Story, Sport } from "@/lib/stories";
import { displayEventDate } from "@/lib/dates";

export function Edition({ dayLabel, stories, isToday = false }: { dayLabel: string; stories: Story[]; isToday?: boolean }) {
  return (
    <div className="edition">
      <div className="edition-heading">
        <p className="eyebrow">On this day {isToday && <span className="today-dot" aria-label="Today" />}</p>
        <h1>{dayLabel}</h1>
        <p className="edition-summary">Football and boxing history, selected for this date.</p>
      </div>
      {stories.length === 0 ? (
        <div className="empty-edition">
          <p>No edition has been published for this date yet.</p>
          <Link className="text-link" href="/previous">See previous editions <span aria-hidden="true">→</span></Link>
        </div>
      ) : (
        <>
          {(["football", "boxing"] as Sport[]).map((sport) => {
            const section = stories.filter((story) => story.sport === sport);
            if (!section.length) return null;
            return (
              <section className="sport-section" aria-labelledby={`${sport}-heading`} key={sport}>
                <h2 className="section-title" id={`${sport}-heading`}>{sport}</h2>
                <div className="story-list">
                  {section.map((story) => <StorySummary key={story.id} story={story} />)}
                </div>
              </section>
            );
          })}
        </>
      )}
    </div>
  );
}

function StorySummary({ story }: { story: Story }) {
  return (
    <article className="story-summary">
      <h3>{story.title}</h3>
      <p className="story-date">{displayEventDate(story.eventDate)}</p>
      {story.briefing ? <p className="briefing">{story.briefing}</p> : (
        <p className="briefing-pending">{story.event || "Briefing awaiting approved text"}<span className="pending-note">Briefing awaiting approved text</span></p>
      )}
      {story.body && <Link className="text-link story-link" href={`/stories/${story.slug}`}>Read story <span aria-hidden="true">→</span></Link>}
    </article>
  );
}
