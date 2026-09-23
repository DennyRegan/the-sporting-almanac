# The Sporting Almanac

A small mobile-first daily football and boxing history site. The seven supplied 23 September stories are present as content files. Their briefings and articles are intentionally blank until approved text is added.

Repository: https://github.com/DennyRegan/the-sporting-almanac (`main` branch)

Public website: https://the-sporting-almanac.vercel.app

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. For a production check, run `npm run build` and `npm run start`.

## Deploy

The existing Vercel project is `denny-regan/the-sporting-almanac`. The build command is `npm run build`; no environment variables or external services are needed. The GitHub repository has not yet been connected to Vercel's Git integration, so pushing a content change does **not** deploy it automatically. After committing and pushing approved content to `main`, run this from the project folder:

```bash
vercel deploy --prod --yes --scope denny-regan
```

Verify the public website after each deployment. The `.vercel` project link and `.env.local` are local, ignored files; they are not stored in GitHub.

## Add or edit a story

Create one `.md` file in `content/football/` or `content/boxing/`, or edit one of the seven existing files. Copy an existing file to keep the frontmatter format. Give each story a unique `id` and `slug`. Set `eventDate` to the historical `YYYY-MM-DD`, then set `calendarMonth` and `calendarDay` to the matching month and day. Set `published: true` and `publishOn` to the first `YYYY-MM-DD` when it may become public. The month and day in `publishOn` must match `calendarMonth` and `calendarDay`. A file with `published: false` is omitted. Optional `order` controls position within a sport's list; stories without it sort after numbered stories by event date.

For example, `content/football/maradona-napoli.md` has `eventDate: "1984-09-23"`, `calendarMonth: 9`, `calendarDay: 23`, and `publishOn: "2026-09-23"`. Its historical year and first publication year serve different purposes. For a story in the 24 September 2026 batch, set `calendarMonth: 9`, `calendarDay: 24`, and `publishOn: "2026-09-24"`, using the story's true historical year in `eventDate`.

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

The homepage reads the current day and month in the `Europe/London` timezone on every request, then selects released stories with matching `calendarMonth` and `calendarDay`. A story becomes released at 00:00 London time on its `publishOn` date; before then it is absent from Today, Previous Editions, direct edition URLs, and article URLs. The historical event year does not affect selection. If the date has no released stories, the homepage explains that there is no edition and links to Previous Editions. The archive lists dates with released content, and an edition remains available at `/editions/MM-DD`.

There is no story limit. The site uses server rendering for today's page, so a new morning does not require a code edit or scheduled task. A previously open Home Screen session should be reopened or refreshed to request the new edition.

To add the website to an iPhone Home Screen, open the public URL in Safari, tap Share, then Add to Home Screen. Reopen or refresh the site each morning for the new edition.

## Current content state

The seven 23 September files contain only the titles, events, dates, and metadata. They deliberately have no briefing or article text. The homepage shows their events with an awaiting-copy note. No article links are shown until approved bodies are pasted in.
