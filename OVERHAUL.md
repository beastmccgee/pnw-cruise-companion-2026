# v2 Overhaul — "THE HONEYMOON: Season 1"

**Status: PLANNED, not started.** v1.0 is tagged `v1.0-trip-ready` (rollback: `git checkout v1.0-trip-ready`).
Execute phases in order; each phase ships independently (bump SW `CACHE_NAME` every push).

## The Concept

Reframe the whole app as a prestige reality-show season about one couple. Chloe loves
*Love Island* and *Love on the Spectrum*; Tanner plans itineraries like a man with a
laminated spreadsheet (per the running joke). So the app becomes the show:

- **The 11 days are Episodes.** Day cards get episode numbers, title cards, and a
  "Previously on…" recap line pulled from yesterday's journal entry.
- **The couple are the cast.** "Starring Tanner & Chloe Purdum — coupled up since Day 1."
- **The itinerary is the joke.** The schedule tab gets a subtitle: *"produced with
  loving, forensic precision by Tanner"* — a gentle Love-on-the-Spectrum-style
  earnestness about his special interest being *this trip*.
- Tone rule: warm and in on the joke, never mocking. Chloe should laugh, not wince.

### Show-language map (used across copy, sparingly)
| App thing | Show name |
|---|---|
| Push-style banner for next activity | **"I'VE GOT A TEXT!"** |
| Evening journal check-in | **The Firepit Debrief** |
| Daily "one nice thing about them" entry | **The Rose Ceremony** (each gives one 🌹 + why) |
| Interview-style journal prompts | **The Confessional** (Love-on-the-Spectrum earnest Qs) |
| Trip-prep tab | **Pre-Production** |
| Confirms tab | **The Producers' Binder** |
| Dispensary runs | **Casa Amor** 🌿 (a detour everyone pretends isn't the point) |
| Settings toggle for all of this | **"Documentary Crew: ON/OFF"** (show-mode is optional!) |

## Feature Slate

### A. The Season experience (biggest wow)
1. **Episode title cards** — opening a day plays a 1.2s title card ("EPISODE 6:
   *Whales, Actually*") with a Ken-Burns pan on the day photo. View Transitions API
   (Safari 18+; Chloe is on iOS 26) with instant fallback.
2. **"I'VE GOT A TEXT!"** — during the trip, a banner on app-open announces the next
   timed stop in Love Island text-message style. Tap = jump to stop. Pure local logic.
3. **Now/Next live strip** — sticky strip during trip hours: current stop, next stop,
   minutes until. The "where do we go now" glanceable answer.
4. **Season Finale recap** — after Aug 15, home becomes a scrolling recap reel:
   every day's photo, journal lines, roses given, badges earned. CSS scroll-driven
   animation. The app's final form is a keepsake.

### B. The lovey-dovey layer
5. **Daily love notes from Tanner** 💌 — 11 pre-written notes (Tanner writes them
   pre-trip in a hidden authoring screen), each unlocks on its morning: "A text has
   arrived for Chloe." This is the feature she'll cry at. Content stored in data.js,
   lightly obfuscated (base64) so she can't peek ahead.
6. **The Rose Ceremony** — nightly ritual: each picks 1–5 roses + one sentence for
   the other. Stored locally, replayed in the finale.
7. **The Confessional** — 2 earnest interview questions per day ("What did you
   notice about them today that nobody else would?"). Alternating who answers first.
8. **Heart-burst double-tap** — port the iOS HeartBurst: double-tap any photo →
   particle hearts. Cheap, delightful.
9. **Badges** — "First Whale 🐋", "Glacier Cuddle 🧊", "Survived the Ferry Line",
   "Casa Amor Loyalty Test Passed". ~15 badges, tap to award, confetti burst.

### C. Utility upgrades (the app gets smarter)
10. **Journal + photo scrapbook** — per-day photos (IndexedDB, device-only) + free
    text. Feeds the finale reel. JSON/print export for backup.
11. **Live weather** — open-meteo.com (free, keyless) for each day's location when
    online; cached; falls back to existing static climate notes offline.
12. **Route lines on maps** — polyline connecting numbered stops + total walking
    distance estimate per day.
13. **Countdown lock-screen** — pre-trip home hero becomes a beautiful full-bleed
    countdown (days/hours/minutes) with milestone unlocks tied to prepChecklist
    dates ("1 week out: passports in carry-on!").
14. **"Running late" shift** — one tap on a stop = "we're here now", subsequent
    stops show adjusted times (display-only, never edits source data).

### D. Design system overhaul
15. Typography: keep Playfair Display (italic) + add a script accent face (e.g.
    self-hosted "Great Vibes") for "Forever", episode numbers in a condensed serif.
16. Per-day accent palettes (precomputed from each photo, stored in data.js — no
    runtime extraction cost): every episode feels color-graded.
17. Glass cards, grain overlay, gradient-mesh heros, spring micro-animations
    (CSS only), skeleton loading, `prefers-reduced-motion` respected throughout.
18. Keep: offline-first SW architecture, static .ics generator, tile prefetch,
    no build step, no frameworks. Everything stays vanilla + self-hosted.

## Phases (each independently shippable)
- **P1 — Design system + episodes**: tokens, per-day palettes, title cards, view
  transitions, hero redesign, show-mode toggle. *(the "whoa" moment)*
- **P2 — Rituals**: love notes, Rose Ceremony, Confessional, journal + IndexedDB.
- **P3 — Smart trip**: Now/Next, I'VE-GOT-A-TEXT banner, weather, route lines,
  running-late shift, countdown lock-screen.
- **P4 — Keepsake**: badges, heart-burst, Season Finale reel, export.
- **P5 — QA**: full offline drill (airplane-mode walkthrough of all 11 days),
  Lighthouse pass, reduced-motion pass, real-iPhone test, `CACHE_NAME` bump.

## Hard rules carried from v1
- Every deploy: bump `CACHE_NAME`. Schedule edits: rerun `node generate_ics.mjs`.
- Everything must work in airplane mode after one Wi-Fi visit. No CDNs, ever.
- User data (journal/photos/roses) is device-local only; export = manual backup.
- Tanner writes the 11 love notes before Aug 5 (app has an authoring screen, or
  he edits data.js directly — his call).
