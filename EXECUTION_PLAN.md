# EXECUTION PLAN — "THE HONEYMOON: Season 1" (v2 phases 2–5)

Written 2026-07-15 for direct execution. Zero decisions left open: schemas, copy,
function shapes, and test steps are all specified. Work top-to-bottom. Trip starts
**Aug 5, 2026** — everything ships well before then.

---

## 0. CURRENT STATE (do not re-derive)

- Repo `C:\Users\tanne\WebProjects\HoneymoonPWA` → github.com/beastmccgee/pnw-cruise-companion-2026, **main** branch auto-deploys to GitHub Pages: https://beastmccgee.github.io/pnw-cruise-companion-2026/
- Rollback tags: `v1.0-trip-ready` (pre-overhaul). Currently deployed: SW **v4**.
- Shipped already (P1 + backdrop): Alaskan-beach-dusk SVG scene in `#bg` (index.html) + drifting aurora blobs; glass cards; grain overlay; Great Vibes script font (`fonts/great_vibes.woff2`); episode layer ("Documentary Crew" `ShowMode`, localStorage `hm_show_mode`, default ON) — episode titles/EP chips/title-card overlays/tab renames/Casa Amor tags/producer note; per-day accents `DAY_ACCENTS` + `EPISODE_TITLES` in js/data.js; deterministic map view + offline tile prefetch; 72 static `.ics` in calendar/ + SW precache; TODAY ribbon; hero status line (show-mode aware).
- Files: `index.html`, `css/styles.css`, `js/app.js`, `js/data.js`, `js/checklist.js`, `service-worker.js`, `generate_ics.mjs`, `generate_palettes.py`, `calendar/` (72 .ics + manifest.json), `fonts/`(3), `images/`(11), `icons/`, `vendor/leaflet/`.
- Trip data source of truth: `TripData` in js/data.js (days 1–11, calendarDate `2026-08-05`…`-15`).

## 1. INVARIANTS (violating any of these = regression)

1. **Every push that changes any cached file bumps `CACHE_NAME`** in service-worker.js (one bump per push, not per feature). Fetches are cache-first; installed apps only update via SW byte-change → reinstall.
2. Any new JS/CSS/font/image file **must be added to `CORE_ASSETS`** in service-worker.js.
3. Any edit to schedules in js/data.js → run `node generate_ics.mjs` and commit calendar/.
4. **No CDNs, no external assets.** Only allowed runtime network: same-origin, `*.tile.openstreetmap.org`, and (P3) `api.open-meteo.com` — each must degrade gracefully offline.
5. Everything must work in **airplane mode** after one online visit. Feature not offline-capable = feature not done.
6. No build step, no frameworks, vanilla JS only. `el()` helper in app.js is the component system.
7. **Do NOT re-add View Transitions** (`document.startViewTransition`) — it ghost-doubles with the fixed SVG backdrop + mix-blend grain (observed on desktop Chromium, user-reported). Title cards are the transition.
8. User-generated data (journal/photos/roses/etc.) is device-local only (IndexedDB). Never uploaded anywhere.
9. All dates use **local time**, format `YYYY-MM-DD` via existing `localISODate()`. Never `toISOString()` (UTC rolls the date after 5 PM PT).
10. Respect `prefers-reduced-motion` for every new animation.

### Local test loop (SW staleness trap — cost us twice already)
Before each test round in the browser pane, run:
```js
(async()=>{ for (const r of await navigator.serviceWorker.getRegistrations()) await r.unregister();
for (const k of await caches.keys()) await caches.delete(k); sessionStorage.clear(); })()
```
then reload TWICE (first load installs the SW, second load is controlled by it). Dev server: preview_start name "Honeymoon PWA" (port 8890).
If browser-pane screenshots time out (they do, intermittently), use headless Edge:
`& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu --hide-scrollbars --window-size=390,844 --screenshot="C:\Users\tanne\macos-vm-windows\shot.png" --virtual-time-budget=6000 http://localhost:8890`

### Deploy checklist (every phase)
1. bump `CACHE_NAME` → 2. local clean-slate test → 3. `git add -A && git commit && git push origin main` → 4. verify live: `until curl -s <pages-url>/js/app.js | grep -q <new-symbol>; do sleep 10; done` + grep SW version → 5. commit message ends with `Co-Authored-By:` line per repo convention.

---

## 2. STEP 0 — HOTFIX (ship alone, immediately, SW v5)

**Bug (user-reported, live now):** ghost "double exposure" of the whole UI. Cause: `withTransition()` in js/app.js uses `document.startViewTransition`; root snapshots stick with our fixed backdrop/blend layers.

**Fix:** replace the function body:
```js
// NOTE: document.startViewTransition ghost-doubles against the fixed SVG
// backdrop + mix-blend grain (seen on desktop Chromium). Navigation is
// instant on purpose; episode title cards are the cinematic moment.
function withTransition(fn) { fn(); }
```
Keep every existing `withTransition(...)` call site unchanged. Bump SW to v5, deploy, verify, tell Tanner to reopen the app twice.

---

## 3. PHASE 2 — RITUALS & MEMORY (SW v6)

### 3.1 New file `js/store.js` (load in index.html before app.js; add to CORE_ASSETS)
Promise-wrapped IndexedDB, DB name `honeymoon`, version 1:
```js
const Store = (() => {
  // stores: journal {date, text}, photos {id, date, blob, ts}, roses {date, tRoses, tLine, cRoses, cLine},
  //         confessional {date, answers: {promptIdx: {t, c}}}, badges {id, earnedDate}, kv {key, value}
  // API: Store.get(store,key) Store.put(store,obj) Store.all(store) Store.del(store,key) — all Promises
})();
```
`photos.id` = `${date}-${Date.now()}`. Photos saved as **Blobs** after canvas downscale: max edge 1600px, JPEG q0.82 (helper `compressImage(file) -> Promise<Blob>`).

### 3.2 New 5th tab "Us"
- index.html tab bar: add button `data-tab="us"`, heart SVG icon (outline heart: `<path d="M12 21C7 16.5 3 13.3 3 9.3 3 6.4 5.2 4.5 7.7 4.5c1.7 0 3.2.9 4.3 2.4 1.1-1.5 2.6-2.4 4.3-2.4 2.5 0 4.7 1.9 4.7 4.8 0 4-4 7.2-9 11.7z"/>`), label swaps `Us` / show-mode `Confessional` (add to `TAB_LABELS`).
- New `<section id="view-us" class="view">` with hero (title "Us", show-mode subtitle "the parts the cameras were really for") and container `#us-content`.
- `renderUs()` called from the tab handler like the others. Sections in order: Love Note, Rose Ceremony, Confessional, Scrapbook, Badges. Each an `info-card` with a `pill` header.

### 3.3 Love notes 💌
- New file `js/lovenotes.js` (CORE_ASSETS + script tag): `const LOVE_NOTES = {1:"<base64>", …11:"<base64>"};` plus helper `generate_notes.mjs` that reads a local (gitignored) `notes.private.txt` — 11 notes separated by lines containing only `---` — and rewrites js/lovenotes.js. Add `notes.private.txt` to a new `.gitignore`.
- Ship with 11 placeholder notes (Appendix C) so the feature is testable; **Tanner replaces them before Aug 1** (task reminder at end).
- UI card "💌 A text has arrived": for each day 1–11 a row; locked if `localISODate() < day.calendarDate` → "🔒 Unlocks Aug N — no peeking, islander." Unlocked → tap opens modal (reuse title-card overlay pattern, class `note-modal`): envelope 💌 flips open (CSS rotateX), decoded note text in Playfair italic, heart-burst on open. Today's note row glows (`box-shadow` rose).
- Decode: `atob(LOVE_NOTES[n])` wrapped in try/catch → fallback "(this note is shy)".

### 3.4 Rose Ceremony 🌹 (nightly during Aug 5–15, teaser before)
Card "🌹 The Rose Ceremony — tonight": two halves labeled "Tanner → Chloe" and "Chloe → Tanner". Each: five 🌹 buttons (tap n = give n roses, filled state), one-line input (`placeholder="one sentence, from the heart"`), Save button. Save → `Store.put('roses', {date: today, ...})` (merge partner halves), heart-burst, toast "Roses given. The islanders remain coupled." Below: collapsed `<details>` "Past ceremonies" listing history (date, 🌹×n + lines).
Before Aug 5 the card shows: "The first ceremony airs the night of Aug 5."

### 3.5 The Confessional 🎤 (2 prompts/day, Appendix A has all 22)
Card "🎤 The Confessional — Day N" (during trip; pre-trip shows Day 1 as preview labeled "sneak peek"). For the current trip day: 2 prompts; under each, two textareas labeled T and C. Whoever answers first alternates: odd day = Tanner first, even = Chloe (display "T answers first tonight" chip; purely ceremonial). Autosave on blur → `Store.put('confessional', {date, answers})`, toast "Confessional saved 🎬". `<details>` archive of previous days below.

### 3.6 Scrapbook 📸
Card "📸 Scrapbook": day selector (horizontal scroll chips EP1–EP11, default today/nearest), then: caption textarea (journal store, autosave on blur) + photo grid (thumbs via `URL.createObjectURL`) + "＋ Add photos" (`<input type="file" accept="image/*" multiple hidden>` → compressImage → Store). Tap photo = lightbox overlay (full image, date, 🗑 delete with confirm). Also append the same "＋ add a memory" button at the bottom of every day-detail page (wired to that day).
Object URLs: revoke on re-render to avoid leaks.

### 3.7 Heart burst ❤ (shared utility in app.js)
```js
function heartBurst(x, y) { /* spawn 14 absolutely-positioned span.heart (❤/💗/💞 random),
  each with CSS vars --dx (−90..90px) --dy (−140..−40px) --rot, animation heartFly 900ms ease-out forwards, then remove */ }
```
Wire: double-tap (two touchend/click <300ms apart) on scrapbook lightbox image + day-detail hero; auto on rose save + note open. CSS keyframe `heartFly` translate/rotate/fade. Reduced-motion: skip.

### 3.8 Badges 🏆 (definitions Appendix B)
Card "🏆 Couple Achievements": grid (4 cols) of circular badges: emoji + name below. Locked = grayscale/40% opacity. Tap locked → confirm sheet "Award 'First Whale'?" → `Store.put('badges',{id, earnedDate: today})` + confetti heart-burst. Tap earned → shows earned date + "Un-award?" confirm (removes).

### 3.9 P2 wrap
SW: add `js/store.js`, `js/lovenotes.js` to CORE_ASSETS; **bump v6**; deploy checklist; verify: clean-slate → add photo, give roses, save confessional, open note, award badge → reload → all persist; airplane-mode (devtools offline) → everything still renders & saves.

---

## 4. PHASE 3 — SMART TRIP LAYER (SW v7)

### 4.1 Now/Next strip (Days tab, only when `localISODate()` is a trip day, show always regardless of ShowMode)
Sticky glass strip (`position:sticky; top:0; z-index:5`) under the Days hero: `NOW 1:30 PM Best of Juneau ▸ NEXT 8:15 PM Excursion returns`. Logic: today's `day.schedule`; parse times with the existing `/^(\d{1,2}):(\d{2})\s*(AM|PM)/` regex into minutes; NOW = last stop ≤ now (else "first up"), NEXT = first stop > now (else "that's a wrap"). Tap → `openDayDetail(todayId)` and scroll to `#stop-row-N` (add `id="stop-row-"+index` to timeline rows). Refresh via `setInterval(renderNowNext, 30000)` + on visibilitychange.

### 4.2 "I'VE GOT A TEXT!" 💬 (show-mode only, once per session, trip days only)
On boot, if NEXT stop starts within 90 min: fixed top banner (class `text-alert`, slides down, shake keyframe ×2): bold "I'VE GOT A TEXT! 💬" → tap reveals line 2 "Islanders, please gather at: {title} — {time}" → second tap opens the day. Dismiss ✕. Guard `sessionStorage.hm_text_alert`.

### 4.3 Live weather (open-meteo, keyless, free)
- `js/data.js`: add `WEATHER_POINTS = { seattle:{lat:47.61,lng:-122.33,label:"Seattle"}, forks:{47.95,-124.39}, juneau:{58.30,-134.42}, skagway:{59.46,-135.31}, glacier:{58.67,-136.90}, ketchikan:{55.34,-131.65}, victoria:{48.43,-123.37} }` and per-day mapping `DAY_WEATHER = {1:'seattle',2:'forks',3:'forks',4:'seattle',5:null,6:'juneau',7:'skagway',8:'glacier',9:'ketchikan',10:'victoria',11:'seattle'}`.
- On load when online & within 16 days of trip: one fetch per point: `https://api.open-meteo.com/v1/forecast?latitude=..&longitude=..&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&temperature_unit=fahrenheit&timezone=auto&start_date=2026-08-05&end_date=2026-08-15` → `localStorage.hm_wx = {fetchedAt, byPoint}`. Throttle: skip if fetchedAt < 3h old.
- Display: (a) Trip tab weather cards get appended line "📡 Latest: High 63° · Low 48° · 40% rain (updated 2h ago)" when data exists for that leg; (b) day-detail hero gets a small chip `63° / 48° · 🌧40%` for that day's point. Weathercode→emoji map: 0-1☀️ 2-3⛅ 45-48🌫 51-67🌧 71-77🌨 80-82🌧 95+⛈.
- Offline/no data: silently omit (static climate bullets remain).

### 4.4 Route lines on maps
In `renderDayMap`, before markers: if ≥2 distinct points, `L.polyline(pts, {color: DAY_ACCENTS[day.id], weight:3, opacity:.75, dashArray:"6 8"}).addTo(map)`.

### 4.5 "We're here" shift (today's episode only)
Each timed row shows a tiny `⌁` pill (class `here-pill`). Tap → `shiftAnchor = {index, deltaMin: now - scheduled}`; re-render timeline: rows after anchor show `~8:22 PM (plan 7:45)` in accent; banner atop timeline "running {+37 min} — breathe, it's vacation" with reset ✕. In-memory only (module var), resets on reload. Never mutates TripData.

### 4.6 Pre-trip countdown ticker
Before Aug 5, under hero status line: `<div class="countdown">23d 14h 09m</div>` (tabular-nums, gold, 1-min interval; no seconds — battery). Below, next milestone from hardcoded list `[{date:'2026-07-22',label:'Two weeks out — book the dinners'},{date:'2026-07-24',label:'Airbnb balance auto-pays'},{date:'2026-07-29',label:'One week out — cards, meds, printing'},{date:'2026-08-04',label:'Check-in opens 5:30 AM — pack the carry-ons'}]`: "Next: Jul 29 — one week out…". During/after trip: hidden.

### 4.7 P3 wrap — SW **v7**, deploy checklist, tests: fake dates via devtools clock? No — temporarily call internals with injected date args (all new fns take `now = new Date()` param for testability); verify strip/banner logic with `renderNowNext(new Date('2026-08-11T13:05:00'))` etc. in console.

---

## 5. PHASE 4 — KEEPSAKE (SW v8)

### 5.1 Season Finale reel ▶
- Entry: after Aug 15 the Days hero shows glowing button "▶ The Season Finale". For testing/preview: long-press (800ms) the hero script-line opens it any time (undocumented).
- Full-screen overlay (`finale-stage`, z-index 1300): slide sequence, 5s auto-advance (progress bar top, Love-Island style), tap right half = next, left = back, ✕ exits.
  1. Title: "THE HONEYMOON" / script "season one" / "Tanner ♥ Chloe · Aug 2026"
  2×11. Per day: bg = first scrapbook photo (IDB) else `DAY_PHOTOS[id]`, dark wash, EP number + title, journal caption line (if any), roses row: "🌹×3 'you held my hand on the SeaWalk'" (both directions if present)
  13. Badges earned wall (earned only, with dates)
  14. Closing: aurora bg, script "renewed forever", heart-rain (heartBurst loop ×5, reduced-motion: static hearts).
- All CSS animations; images via object URLs, revoked on exit.

### 5.2 Backup & restore (Pre-Prod tab, bottom card "🗄 Production Archive")
- "Download backup" → JSON `{version:1, exported, journal[], roses[], confessional[], badges[], settings:{showMode}}` (photos excluded — note in UI "photos stay on this phone") → Blob download `honeymoon-backup-YYYYMMDD.json`.
- "Restore" → file input → validate `version===1` → merge-put all records (confirm overwrite prompt).

### 5.3 Recoupling easter egg
5 taps on hero script-line within 3s → modal: pill "RECOUPLING CEREMONY", text "Tanner and Chloe have decided to recouple." / muted "(they were never really at risk)" / button "obviously ❤" → heart-burst storm (×3 bursts). Session-unlimited, harmless.

### 5.4 P4 wrap — SW **v8**, deploy, verify finale on desktop + phone, backup file round-trips.

---

## 6. PHASE 5 — QA & CONTENT LOCK (SW v9 only if files changed)

1. **Airplane-mode drill** (the release gate): clean install online → toggle offline (devtools + a real phone in airplane mode) → verify: all 11 days open w/ maps; calendar .ics tap serves from cache; Us tab fully functional (write+read all stores); no console errors; reload offline works (app shell from SW).
2. **Real iPhone checklist (Tanner):** Add to Home Screen fresh; title card plays; 📅 button opens Apple Calendar sheet with correct event/time; 🍎 Maps buttons open Apple Maps; photo add from camera roll works; airplane-mode pass; app icon/name/splash look right; status bar not overlapped (safe-area).
3. **Perf sanity:** first online load < ~4s on throttled Fast 4G (devtools); `caches` total < 25MB (`(await Promise.all((await caches.keys()).map(async k=>{const c=await caches.open(k);return (await c.keys()).length})))`); no long tasks from countdown/now-next intervals (30s/60s cadence only).
4. **Content lock (before Aug 1):** Tanner's 11 real love notes via `notes.private.txt` + `node generate_notes.mjs`; confirm episode titles/copy with Chloe kept unspoiled 😄; any schedule edits → `node generate_ics.mjs`.
5. Tag release: `git tag -a v2.0-season-1 -m "Season 1 complete" && git push origin v2.0-season-1`.
6. Update memory + vault notes (project_honeymoon_pwa.md → status shipped-v2; vault doc SW version + new files list).

---

## APPENDIX A — Confessional prompts (2/day; index = (dayN-1)*2, (dayN-1)*2+1)
```js
const CONFESSIONAL_PROMPTS = [
 /*d1*/ "First impressions of married travel so far?", "What did they do today that nobody else would have noticed?",
 /*d2*/ "Describe today's drive in three words each.", "Which fictional vampire would your partner survive longest against, and why?",
 /*d3*/ "What smelled better: the rainforest, or them?", "Confess one thing you packed that you already regret.",
 /*d4*/ "Rate the villa (the ship) out of ten — be honest, producers are listening.", "What are you most excited to do together at sea?",
 /*d5*/ "A full day with nowhere to be: how did it feel?", "What's one thing about them you learned only by being trapped on a boat together?",
 /*d6*/ "The whales: overrated or underrated? Defend yourselves.", "What moment today felt most like a movie?",
 /*d7*/ "Train ride verdict: scenic masterpiece or nap with a view?", "What would your partner's Love Island intro line be?",
 /*d8*/ "Describe the glacier without using the word 'blue'.", "Who kept whom warm today, really?",
 /*d9*/ "Salmon count: how many did you actually see?", "What tiny thing today are you going to remember in ten years?",
 /*d10*/ "A pub in Canada at 10 PM as a married couple: how do we feel?", "What's one thing from this trip you want to do again someday?",
 /*d11*/ "Season 1 is wrapping: what was the episode of the trip?", "Write one sentence to the couple who lands in Cedar Rapids tonight."
];
```

## APPENDIX B — Badges
```js
const BADGES = [
 {id:"first-whale", emoji:"🐋", name:"First Whale"},
 {id:"glacier-cuddle", emoji:"🧊", name:"Glacier Cuddle"},
 {id:"twilight-pilgrims", emoji:"🌙", name:"Twilight Pilgrims"},
 {id:"ferry-survivors", emoji:"⛴️", name:"Ferry Line Survivors"},
 {id:"casa-amor-loyal", emoji:"🌿", name:"Casa Amor: Loyal"},
 {id:"formal-stunners", emoji:"🥂", name:"Formal Night Stunners"},
 {id:"sea-legs", emoji:"🌊", name:"Sea Legs"},
 {id:"salmon-witness", emoji:"🐟", name:"Salmon Witnesses"},
 {id:"summit-sippers", emoji:"🚂", name:"Summit Sippers"},
 {id:"harbour-lights", emoji:"🌃", name:"Harbour Lights"},
 {id:"chowder-champs", emoji:"🍲", name:"Chowder Champions"},
 {id:"early-risers", emoji:"🌅", name:"Sunrise Beach Club"},
 {id:"sanctuary-sloths", emoji:"🛋️", name:"Sanctuary Sloths"},
 {id:"spreadsheet-respecter", emoji:"📋", name:"Followed The Itinerary (One Full Day)"},
 {id:"recoupled", emoji:"💍", name:"Recoupled (Obviously)"}
];
```

## APPENDIX C — Placeholder love notes (Tanner replaces via notes.private.txt)
Eleven short placeholders, one per day, each ending with "— T". Tone: plain, warm,
specific-to-the-day (e.g. d8: "Today is the cold one. My whole job today is your
hands. — T"). Executor: write all 11, keep each under 40 words, no rhymes, no
"my queen" energy. These must read fine if Tanner forgets to replace them — but
add a `<!-- TODO: Tanner, replace via notes.private.txt before Aug 1 -->` marker.

## APPENDIX D — Copy quick-reference
- Text alert: "I'VE GOT A TEXT! 💬" / "Islanders, please gather at: {stop} — {time}"
- Rose save toast: "Roses given. The islanders remain coupled."
- Confessional toast: "Confessional saved 🎬"
- Locked note: "🔒 Unlocks Aug {N} — no peeking, islander."
- Shift banner: "running +{m} min — breathe, it's vacation"
- Recoupling: "Tanner and Chloe have decided to recouple." / "(they were never really at risk)" / "obviously ❤"
- Us tab show-mode subtitle: "the parts the cameras were really for"
