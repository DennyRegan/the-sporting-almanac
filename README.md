# The Sporting Almanac

A small mobile-first daily football and boxing history site. The seven supplied 23 September stories are present as content files. Their briefings and articles are intentionally blank until approved text is added.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. For a production check, run `npm run build` and `npm run start`.

## Deploy

Import this folder as a Next.js project in Vercel. The build command is `npm run build`; no environment variables or external services are needed. Deploy again when content files change.

## Add or edit a story

Create one `.md` file in `content/football/` or `content/boxing/`, or edit one of the seven existing files. Copy an existing file to keep the frontmatter format. Give each story a unique `id` and `slug`. Set `eventDate` to the historical `YYYY-MM-DD`, then set `calendarMonth` and `calendarDay` to the matching month and day. Set `published: true` to display it. A file with `published: false` is omitted. Optional `order` controls position within a sport's list; stories without it sort after numbered stories by event date.

Put the approved 2–3 sentence homepage text in `briefing`. Use quotes for a one-line briefing, or YAML's `>-` syntax for multiple source lines:

```yaml
briefing: >-
  Paste the approved briefing here.
  It will appear as one paragraph on the edition page.
```

For a full article, write approved Markdown **after** the closing `---` of the frontmatter. An article page and **Read story** link appear automatically when that body has text. `standfirst` is optional. `readingTime` can be set to a number of minutes; if omitted, it is estimated from the article body.

For a briefing-only story, fill in `briefing` and leave the area after the closing `---` empty. It appears in the edition without a read link or article route.

Structured tags live in the same frontmatter: `players`, `fighters`, `clubs`, `nationalTeams`, `competitions`, `countries`, `decade`, `era`, and `articleType`. These are stored for future use and do not create public tag pages.

## Daily editions

The homepage reads the current day and month in the `Europe/London` timezone on every request, then selects all published stories with matching `calendarMonth` and `calendarDay`. The event year does not affect selection. If the date has no stories, the homepage explains that there is no edition and links to Previous Editions. The archive lists dates with published content, and an edition remains available at `/editions/MM-DD`.

There is no story limit. The site uses server rendering for today's page, so a new morning does not require a code edit or scheduled task. A previously open Home Screen session should be reopened or refreshed to request the new edition.

## Current content state

The seven 23 September files contain only the titles, events, dates, and metadata. They deliberately have no briefing or article text. The homepage shows their events with an awaiting-copy note. No article links are shown until approved bodies are pasted in.
