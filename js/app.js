// ---------- Small DOM helpers ----------
function el(tag, attrs = {}, children = []) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") e.className = v;
    else if (k === "html") e.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  (Array.isArray(children) ? children : [children]).forEach(c => {
    if (c == null) return;
    e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return e;
}

function bulletList(items) {
  return el("ul", { class: "bullet-list" }, items.map(t => el("li", {}, t)));
}

function pill(text) { return el("span", { class: "pill" }, text); }
function muted(text) { return el("p", { class: "muted", style: "margin:4px 0;" }, text); }

// ---------- Show mode ("Documentary Crew") ----------
const ShowMode = {
  get on() { return localStorage.getItem("hm_show_mode") !== "0"; },
  toggle() { localStorage.setItem("hm_show_mode", this.on ? "0" : "1"); applyShowMode(); }
};

let toastTimer = null;
function toast(msg) {
  let t = document.querySelector(".toast");
  if (!t) { t = el("div", { class: "toast" }); document.body.appendChild(t); }
  t.textContent = msg;
  requestAnimationFrame(() => t.classList.add("show"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

// ---------- Heart burst ❤ (shared celebratory flourish) ----------
const _reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function heartBurst(x, y) {
  if (_reduceMotion()) return;
  const glyphs = ["❤", "💗", "💞"];
  for (let i = 0; i < 14; i++) {
    const h = el("span", { class: "heart" }, glyphs[Math.floor(Math.random() * glyphs.length)]);
    const dx = (Math.random() * 180 - 90).toFixed(0);
    const dy = (Math.random() * -100 - 40).toFixed(0);
    const rot = (Math.random() * 120 - 60).toFixed(0);
    h.style.cssText =
      `left:${x}px; top:${y}px; --dx:${dx}px; --dy:${dy}px; --rot:${rot}deg;` +
      `animation-delay:${(Math.random() * 90).toFixed(0)}ms;`;
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1050);
  }
}
// Fire a burst centered on an element (or an event's location).
function heartBurstAt(target) {
  const r = (target.getBoundingClientRect ? target : target.currentTarget).getBoundingClientRect();
  heartBurst(r.left + r.width / 2, r.top + r.height / 2);
}
// Attach a double-tap/double-click handler (two taps < 300ms) to an element.
function onDoubleTap(node, handler) {
  let last = 0;
  node.addEventListener("click", e => {
    const now = e.timeStamp || Date.now();
    if (now - last < 300) { handler(e); last = 0; } else { last = now; }
  });
}

// NOTE: document.startViewTransition ghost-doubles against the fixed SVG
// backdrop + mix-blend grain layer (seen on desktop Chromium, user-reported).
// Navigation is instant on purpose; episode title cards are the cinematic moment.
function withTransition(fn) { fn(); }

const TAB_LABELS = {
  days:      { normal: "Days",     show: "Episodes" },
  prep:      { normal: "Prep",     show: "Pre-Prod" },
  trip:      { normal: "Trip",     show: "Trip" },
  confirms:  { normal: "Confirms", show: "Binder" },
  us:        { normal: "Us",       show: "Confessional" }
};

function applyShowMode() {
  const on = ShowMode.on;
  document.querySelectorAll(".tab-btn").forEach(b => {
    b.lastChild.textContent = TAB_LABELS[b.dataset.tab][on ? "show" : "normal"];
  });
  document.getElementById("hero-eyebrow").textContent =
    on ? "THE HONEYMOON · SEASON 1" : "T & C · HONEYMOON COMPANION";
  document.getElementById("hero-cast").style.display = on ? "" : "none";
  document.getElementById("crew-toggle").classList.toggle("off", !on);
  // Producer's note on the Prep tab
  const prepHero = document.querySelector("#view-prep .hero");
  let note = document.querySelector("#view-prep .producer-note");
  if (on && !note) {
    note = el("div", { class: "producer-note" }, "produced with loving, forensic precision by Tanner");
    prepHero.after(note);
  } else if (!on && note) note.remove();
  const usSub = document.getElementById("us-subtitle");
  if (usSub) usSub.style.display = on ? "" : "none";
  renderDaysList();
}

// ---------- Episode title card ----------
function playTitleCard(day, onDone) {
  if (!ShowMode.on || sessionStorage.getItem("tc_seen_" + day.id)) { onDone(); return; }
  sessionStorage.setItem("tc_seen_" + day.id, "1"); // once per session per day
  const card = el("div", {
    class: "title-card",
    style: `background-image:url('${DAY_PHOTOS[day.id]}'); --tc-accent:${DAY_ACCENTS[day.id]}66;`
  }, [
    el("div", { class: "tc-inner" }, [
      el("div", { class: "tc-ep" }, `EPISODE ${day.id}`),
      el("div", { class: "tc-title" }, EPISODE_TITLES[day.id]),
      el("div", { class: "tc-sig" }, "Tanner ♥ Chloe")
    ])
  ]);
  const dismiss = () => {
    if (card.classList.contains("leaving")) return;
    card.classList.add("leaving");
    setTimeout(() => card.remove(), 460);
  };
  card.addEventListener("click", dismiss);
  document.body.appendChild(card);
  onDone(); // build the page underneath while the card plays
  setTimeout(dismiss, 1700);
}

// ---------- External actions ----------
function openMaps(address) {
  window.open("https://maps.apple.com/?q=" + encodeURIComponent(address), "_blank");
}
function openWebsite(url) { window.open(url, "_blank"); }
function openSearch(q) { window.open("https://www.google.com/search?q=" + encodeURIComponent(q), "_blank"); }
function openCall(phone) { window.location.href = "tel:" + phone; }
// Pre-generated static .ics files (see generate_ics.mjs). iOS Safari blocks data: URI
// navigation, so a real https .ics URL is the only reliable way to reach Apple Calendar.
// The files are pre-cached by the service worker, so this works offline at sea too.
function openCalendar(dayId, stopIndex) {
  window.open(`calendar/d${dayId}-s${stopIndex}.ics`, "_blank");
}

function linkBtn(label, onClick) {
  return el("button", { class: "link-btn", onclick: onClick }, label);
}

// ---------- Days tab ----------
// Local YYYY-MM-DD (not toISOString, which is UTC and rolls the date after 5 PM PT)
function localISODate(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function renderDaysList() {
  const container = document.getElementById("days-list");
  container.innerHTML = "";
  const today = localISODate();
  const show = ShowMode.on;
  TripData.days.forEach(day => {
    const isToday = day.calendarDate === today;
    const card = el("div", {
      class: "day-card" + (isToday ? " today" : ""),
      style: `--day-accent:${DAY_ACCENTS[day.id]};`,
      onclick: () => openDayDetail(day.id)
    }, [
      el("div", {
        class: "photo",
        style: `background-image:url('${DAY_PHOTOS[day.id]}')`
      }, [
        show ? el("div", { class: "ep-chip" }, `EP ${day.id}`) : el("div", { class: "badge" }, String(day.id)),
        isToday ? el("div", { class: "today-tag" }, "❤ TODAY") : null,
        day.twilightTheme && !isToday ? el("div", { class: "twilight-tag" }, "🌙 TWILIGHT") : null
      ]),
      el("div", { class: "body" }, [
        el("div", { class: "date" }, day.date.toUpperCase()),
        show ? el("div", { class: "ep-title" }, `“${EPISODE_TITLES[day.id]}”`) : null,
        el("div", { class: "title heading-font" }, day.title),
        el("p", { class: "subtitle" }, day.subtitle),
        el("div", { class: "footer-row" }, [
          el("span", { class: "stops-count" }, `${day.schedule.length} stop${day.schedule.length === 1 ? "" : "s"} planned`),
          el("span", { style: "color:var(--primary);" }, "›")
        ])
      ])
    ]);
    container.appendChild(card);
  });

  renderHeroStatus(today);
  renderFinaleEntry(today);
  // During the trip, bring today's card into view on open
  const todayCard = container.querySelector(".day-card.today");
  if (todayCard) setTimeout(() => todayCard.scrollIntoView({ behavior: "smooth", block: "center" }), 600);
}

// One warm line under the hero dates: countdown before, day counter during, memory after.
function renderHeroStatus(today) {
  const hero = document.querySelector("#view-days .hero");
  let line = hero.querySelector(".trip-status");
  if (!line) {
    line = el("div", { class: "trip-status" });
    hero.insertBefore(line, document.getElementById("hero-cast"));
  }
  const MS_DAY = 86400000;
  const start = new Date("2026-08-05T00:00:00");
  const end = new Date("2026-08-15T00:00:00");
  const now = new Date(today + "T00:00:00");
  const show = ShowMode.on;
  if (now < start) {
    const days = Math.round((start - now) / MS_DAY);
    line.textContent = (days === 1 ? "1 day" : `${days} days`) + (show ? " until the season premiere ✈" : " to go ✈");
  } else if (now <= end) {
    const n = Math.round((now - start) / MS_DAY) + 1;
    line.textContent = show ? `Episode ${n} of 11 — now airing` : `Day ${n} of 11 — enjoy every minute`;
  } else {
    line.textContent = show ? "Season 1 complete — renewed forever ❤" : "Married, home, and full of memories ❤";
  }
}

// ---------- Map math (shared by the live map and the offline tile prefetcher) ----------
// Web-mercator pixel projection at zoom z (256px tiles), same as Leaflet's internals.
const TILE_SUBDOMAINS = "abc";
function projX(lng, z) { return (lng + 180) / 360 * 256 * Math.pow(2, z); }
function projY(lat, z) {
  const s = Math.sin(lat * Math.PI / 180);
  return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * 256 * Math.pow(2, z);
}

function mapViewportSize() {
  return { w: Math.min(window.innerWidth, 560) - 40, h: 220 };
}

// Deterministic center+zoom for a day's map. Used for rendering AND for computing
// which tiles to prefetch, so the offline cache always matches what gets displayed.
function dayMapView(day) {
  const pts = day.schedule.map(s => s.point);
  const lats = pts.map(p => p.lat), lngs = pts.map(p => p.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const center = [(minLat + maxLat) / 2, (minLng + maxLng) / 2];
  if (minLat === maxLat && minLng === maxLng) return { center, zoom: 10 };
  const { w, h } = mapViewportSize();
  const availW = w - 48, availH = h - 48;
  for (let z = 14; z >= 3; z--) {
    const pw = projX(maxLng, z) - projX(minLng, z);
    const ph = projY(minLat, z) - projY(maxLat, z);
    if (pw <= availW && ph <= availH) return { center, zoom: z };
  }
  return { center, zoom: 3 };
}

// Every tile the day map shows (plus a half-tile pan margin), as concrete URLs.
function dayTileUrls(day) {
  const { center, zoom } = dayMapView(day);
  const { w, h } = mapViewportSize();
  const cx = projX(center[1], zoom), cy = projY(center[0], zoom);
  const x0 = Math.floor((cx - w / 2 - 128) / 256), x1 = Math.floor((cx + w / 2 + 128) / 256);
  const y0 = Math.floor((cy - h / 2 - 128) / 256), y1 = Math.floor((cy + h / 2 + 128) / 256);
  const n = Math.pow(2, zoom), urls = [];
  for (let x = x0; x <= x1; x++) {
    for (let y = y0; y <= y1; y++) {
      if (y < 0 || y >= n) continue;
      const wx = ((x % n) + n) % n;
      const sub = TILE_SUBDOMAINS[Math.abs(x + y) % TILE_SUBDOMAINS.length];
      urls.push(`https://${sub}.tile.openstreetmap.org/${zoom}/${wx}/${y}.png`);
    }
  }
  return urls;
}

// Quietly warm the tile cache for all 11 days so every map works offline even if a
// day was never opened at home. The service worker stores each tile permanently;
// re-runs are served from cache, so this costs the network exactly once.
async function prefetchAllMapTiles() {
  if (!navigator.onLine) return;
  const urls = [...new Set(TripData.days.flatMap(dayTileUrls))];
  let i = 0;
  const worker = async () => {
    while (i < urls.length) {
      const u = urls[i++];
      try { await fetch(u, { mode: "no-cors" }); } catch (e) { /* offline mid-run: fine */ }
    }
  };
  await Promise.all([0, 1, 2, 3].map(worker));
}

// ---------- Day detail ----------
let currentMap = null;

function openDayDetail(dayId) {
  const day = TripData.days.find(d => d.id === dayId);
  if (!day) return;
  playTitleCard(day, () => buildDayDetail(day));
}

function buildDayDetail(day) {
  const root = document.getElementById("day-detail-content");
  root.innerHTML = "";
  root.classList.toggle("twilight", !!day.twilightTheme);
  root.style.setProperty("--day-accent", DAY_ACCENTS[day.id]);
  const show = ShowMode.on;
  _shiftAnchor = null; // fresh page, drop any running-late shift

  // Live-weather chip for this day's point, if we have cached data
  const wxKey = DAY_WEATHER[day.id];
  const wx = wxKey ? wxFor(wxKey, day.calendarDate) : null;

  const hero = el("div", {
    class: "day-detail-hero",
    style: `background-image:url('${DAY_PHOTOS[day.id]}')`
  }, [
    el("button", { class: "back-btn", onclick: () => withTransition(() => showView("days")) }, "‹"),
    el("div", { class: "hero-text" }, [
      day.twilightTheme ? el("div", { class: "twilight-chip" }, "🌙 TWILIGHT SAGA DETOUR") : null,
      el("div", { class: "date-label" }, (show ? `EPISODE ${day.id} · ` : "") + day.date.toUpperCase()),
      el("div", { class: "title-label heading-font" }, show ? `“${EPISODE_TITLES[day.id]}”` : day.title),
      wx ? el("div", { class: "wx-chip" }, `${wx.high}° / ${wx.low}° · ${wxCodeEmoji(wx.code)}${wx.precip != null ? wx.precip + "%" : ""}`) : null
    ])
  ]);
  root.appendChild(hero);

  const body = el("div", { class: "day-body" });
  body.appendChild(muted(day.subtitle));
  const mapDiv = el("div", { class: "day-map", id: "day-map-" + day.id });
  body.appendChild(mapDiv);

  const timelineWrap = el("div", { class: "timeline-wrap" });
  const isToday = day.calendarDate === localISODate();
  renderTimelineInto(timelineWrap, day, isToday);
  body.appendChild(timelineWrap);

  // Jump straight to this day's scrapbook from the day page
  body.appendChild(el("button", {
    class: "scrap-add day-memory", onclick: () => {
      _scrapDay = day.id;
      withTransition(() => { showView("us"); renderUs(); });
    }
  }, "＋ add a memory"));
  root.appendChild(body);

  // Double-tap the hero to send up a little burst of hearts
  onDoubleTap(hero, () => heartBurstAt(hero));

  showView("day-detail");
  setTimeout(() => renderDayMap(mapDiv.id, day), 0);
}

function renderDayMap(elementId, day) {
  if (currentMap) { currentMap.remove(); currentMap = null; }
  const view = dayMapView(day);
  const map = L.map(elementId, { zoomControl: false, attributionControl: false }).setView(view.center, view.zoom);
  // OSM's tile policy requires visible attribution
  L.control.attribution({ prefix: false }).addAttribution("© OpenStreetMap").addTo(map);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, subdomains: TILE_SUBDOMAINS }).addTo(map);
  // Dashed route line through the day's stops (only if there's more than one place)
  const pts = day.schedule.map(s => [s.point.lat, s.point.lng]);
  if (new Set(pts.map(p => p.join(","))).size >= 2) {
    L.polyline(pts, { color: DAY_ACCENTS[day.id], weight: 3, opacity: .75, dashArray: "6 8" }).addTo(map);
  }
  day.schedule.forEach((s, i) => {
    const color = s.isDispensary ? "#2E7D32" : "#B23A55";
    const icon = L.divIcon({
      className: "",
      html: `<div style="background:${color};width:24px;height:24px;border-radius:50%;border:2px solid #fff;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;">${i + 1}</div>`,
      iconSize: [24, 24], iconAnchor: [12, 12]
    });
    L.marker([s.point.lat, s.point.lng], { icon }).addTo(map);
  });
  currentMap = map;
}

function renderTimelineRow(stop, index, isLast, day, isToday, rowIndex, wrap) {
  const sched = parseStopMinutes(stop.time);
  let timeText = `${stop.time} · Stop ${index}`, shifted = false;
  if (_shiftAnchor && sched != null && rowIndex > _shiftAnchor.index) {
    timeText = `~${minutesToTime(sched + _shiftAnchor.deltaMin)} (plan ${stop.time})`;
    shifted = true;
  }
  // On today's page, timed rows get a ⌁ "we're here now" pill that re-times
  // everything after it — in memory only, never touches TripData.
  const herePill = (isToday && sched != null) ? el("button", {
    class: "here-pill", title: "we're here now",
    onclick: e => {
      e.stopPropagation();
      _shiftAnchor = { index: rowIndex, deltaMin: nowMinutes(new Date()) - sched };
      renderTimelineInto(wrap, day, isToday);
    }
  }, "⌁") : null;
  const row = el("div", { class: "timeline-row", id: "stop-row-" + index }, [
    el("div", { class: "timeline-rail" }, [
      el("div", { class: "timeline-dot" + (stop.isDispensary ? " dispensary" : "") }),
      isLast ? null : el("div", { class: "timeline-line" })
    ]),
    el("div", { class: "timeline-content" }, [
      el("div", { class: "time-row" }, [ el("div", { class: "time" + (shifted ? " shifted" : "") }, timeText), herePill ]),
      el("div", { class: "title" }, stop.title),
      stop.isDispensary ? el("div", { class: "dispensary-tag" }, ShowMode.on ? "🌿 CASA AMOR" : "🌿 DISPENSARY") : null,
      stop.desc ? muted(stop.desc) : null,
      renderStopLinks(stop, day, index)
    ])
  ]);
  return row;
}

function renderStopLinks(stop, day, stopIndex) {
  const row = el("div", { class: "link-row" });
  row.appendChild(linkBtn("🍎 Maps", () => openMaps(stop.address)));

  if (stop.isRestaurant) {
    if (stop.restaurantOptions && stop.restaurantOptions.length) {
      const menuBtn = linkBtn("🍽️ Menu ▾", () => toggleMenuOptions(menuBtn, stop, day));
      row.appendChild(menuBtn);
    } else if (stop.website) {
      row.appendChild(linkBtn("🍽️ Menu", () => openWebsite(stop.website)));
    } else {
      row.appendChild(linkBtn("🍽️ Menu", () => openSearch(`${stop.locName} ${day.title} menu`)));
    }
  } else if (stop.website) {
    row.appendChild(linkBtn("🌐 Site", () => openWebsite(stop.website)));
  }

  if (stop.phone) row.appendChild(linkBtn("📞 Call", () => openCall(stop.phone)));

  if (/^\d{1,2}:\d{2}\s*(AM|PM)/.test(stop.time)) {
    row.appendChild(linkBtn("📅 Calendar", () => openCalendar(day.id, stopIndex)));
  }
  return row;
}

function toggleMenuOptions(anchorBtn, stop, day) {
  const existing = anchorBtn.parentElement.querySelector(".menu-popup");
  if (existing) { existing.remove(); return; }
  const popup = el("div", {
    class: "menu-popup",
    style: "position:absolute;background:var(--surface-solid);border:1px solid var(--outline);border-radius:12px;padding:6px;box-shadow:0 12px 28px rgba(0,0,0,.5);z-index:5;margin-top:4px;"
  });
  stop.restaurantOptions.forEach(opt => {
    popup.appendChild(el("div", {
      style: "padding:8px 12px;font-size:13px;cursor:pointer;white-space:nowrap;",
      onclick: () => { opt.website ? openWebsite(opt.website) : openSearch(`${opt.name} ${day.title} menu`); popup.remove(); }
    }, opt.name));
  });
  anchorBtn.parentElement.style.position = "relative";
  anchorBtn.parentElement.appendChild(popup);
}

// ---------- Prep tab ----------
function renderPrep() {
  renderChecklistGroups("packing-groups", ChecklistStore.getPacking(), groups => ChecklistStore.savePacking(groups));
  renderChecklistGroups("prep-groups", ChecklistStore.getPrep(), groups => ChecklistStore.savePrep(groups));
  renderArchiveCard();
}

// Backup / restore of the device-local keepsakes (photos excluded — too big,
// and they never leave the phone anyway).
function renderArchiveCard() {
  const view = document.getElementById("view-prep");
  if (view.querySelector(".archive-card")) return;
  view.appendChild(el("h2", { class: "section-heading" }, "Backup"));
  const restoreInput = el("input", { type: "file", accept: "application/json,.json", hidden: "" });
  restoreInput.addEventListener("change", () => { if (restoreInput.files[0]) restoreBackup(restoreInput.files[0]); restoreInput.value = ""; });
  const card = el("div", { class: "info-card archive-card" }, [
    pill("🗄 Production Archive"),
    muted("Save your notes, roses, confessionals and badges to a file — or restore them onto another phone. Photos stay on this phone."),
    el("div", { class: "link-row", style: "margin-top:10px;" }, [
      el("button", { class: "rose-save", onclick: downloadBackup }, "Download backup"),
      el("button", { class: "rose-save", style: "background:var(--surface-variant);color:var(--primary);", onclick: () => restoreInput.click() }, "Restore"),
      restoreInput
    ])
  ]);
  view.appendChild(card);
}

function renderChecklistGroups(containerId, groups, onSave) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  groups.forEach((group, gi) => {
    const card = el("div", { class: "info-card" });
    card.appendChild(pill(group.heading));
    const list = el("div", { style: "margin-top:8px;" });
    group.items.forEach(item => {
      list.appendChild(el("div", { class: "checklist-row" }, [
        el("div", {
          class: "checkbox" + (item.checked ? " checked" : ""),
          onclick: () => { item.checked = !item.checked; onSave(groups); renderChecklistGroups(containerId, groups, onSave); }
        }, item.checked ? "✓" : ""),
        el("div", { class: "text" + (item.checked ? " checked" : "") }, item.text),
        el("button", {
          class: "del-btn",
          onclick: () => { group.items = group.items.filter(i => i.id !== item.id); onSave(groups); renderChecklistGroups(containerId, groups, onSave); }
        }, "✕")
      ]));
    });
    card.appendChild(list);
    card.appendChild(el("button", {
      class: "add-link",
      onclick: () => showAddItemInput(card, group, groups, containerId, onSave)
    }, "+ Add item"));
    container.appendChild(card);
  });
}

function showAddItemInput(card, group, groups, containerId, onSave) {
  if (card.querySelector(".add-item-row")) return;
  const input = el("input", { placeholder: "New item…", type: "text" });
  const commit = () => {
    const text = input.value.trim();
    if (text) {
      group.items.push({ id: ChecklistStore.newId(), text, checked: false });
      onSave(groups);
      renderChecklistGroups(containerId, groups, onSave);
    }
  };
  input.addEventListener("keydown", e => { if (e.key === "Enter") commit(); });
  const row = el("div", { class: "add-item-row" }, [
    input,
    el("button", { class: "add-item-btn", onclick: commit }, "+")
  ]);
  card.appendChild(row);
  input.focus();
}

// ---------- Trip tab ----------
function renderTrip() {
  const c = document.getElementById("trip-content");
  c.innerHTML = "";

  c.appendChild(el("h2", { class: "section-heading" }, "What the skies will offer"));
  TripData.weatherLegs.forEach(w => {
    const leg = LEG_WX[w.name];
    const wx = leg ? wxFor(leg.point, leg.date) : null;
    c.appendChild(el("div", { class: "info-card" }, [
      el("div", { style: "font-size:18px;font-weight:600;color:var(--primary);" }, w.name),
      muted(w.whenText),
      el("div", { style: "font-size:15px;font-weight:600;margin:4px 0;" }, `High ${w.high} · Low ${w.low}`),
      bulletList(w.bullets),
      wx ? el("div", { class: "wx-latest" },
        `📡 Latest: High ${wx.high}° · Low ${wx.low}° · ${wx.precip != null ? wx.precip + "% rain" : wxCodeEmoji(wx.code)} (updated ${wxAgoText(wx.fetchedAt, new Date())})`
      ) : null
    ]));
  });

  c.appendChild(el("h2", { class: "section-heading" }, "Pit-stops along the way"));
  TripData.dispensaries.forEach(d => {
    c.appendChild(el("div", { class: "info-card" }, [
      pill(d.city),
      muted(d.whenText),
      el("div", { style: "font-size:15px;font-weight:600;margin:6px 0 4px;" }, d.primary),
      d.backup ? muted("Backup: " + d.backup) : null,
      bulletList(d.notes),
      el("div", { class: "link-row" }, [linkBtn("📍 Open in Maps", () => openMaps(d.address))])
    ]));
  });
  c.appendChild(el("div", { class: "info-card" }, [bulletList(TripData.dispensaryFooter)]));

  c.appendChild(el("h2", { class: "section-heading" }, "Our floating home"));
  const cruiseCard = el("div", { class: "info-card" });
  cruiseCard.appendChild(el("div", { style: "font-size:18px;font-weight:600;color:var(--primary);" }, `${TripData.cruiseShip} · ${TripData.cruiseLine}`));
  cruiseCard.appendChild(muted(TripData.cruiseBlurb));
  cruiseCard.appendChild(el("div", { style: "font-weight:600;margin-top:10px;" }, "Port schedule"));
  TripData.cruiseStops.forEach(s => {
    cruiseCard.appendChild(el("div", { class: "row-between" }, [muted(s.day), el("span", { style: "font-size:14px;font-weight:600;" }, `${s.place} · ${s.time}`)]));
  });
  cruiseCard.appendChild(el("div", { style: "font-weight:600;margin-top:10px;" }, "Onboard"));
  TripData.cruiseHighlights.forEach(h => {
    cruiseCard.appendChild(el("div", { style: "font-size:14px;font-weight:600;margin-top:6px;" }, h.name));
    cruiseCard.appendChild(muted(h.desc));
  });
  cruiseCard.appendChild(muted(TripData.cruiseDressCode));
  cruiseCard.appendChild(muted("💡 " + TripData.cruiseHoneymoonTip));
  cruiseCard.appendChild(muted("🧊 " + TripData.cruiseGlacierBayTip));
  c.appendChild(cruiseCard);

  c.appendChild(el("h2", { class: "section-heading" }, "Adventures in Alaska"));
  TripData.excursions.forEach(ex => {
    c.appendChild(el("div", { class: "info-card" }, [
      pill(ex.status),
      el("div", { style: "font-size:18px;font-weight:600;color:var(--primary);margin-top:6px;" }, ex.title),
      muted(ex.whenText),
      el("div", { style: "font-weight:600;margin-top:4px;" }, ex.price),
      muted(ex.names)
    ]));
  });
  c.appendChild(muted(TripData.excursionsTotal));

  c.appendChild(el("h2", { class: "section-heading" }, "A free day — Ketchikan"));
  TripData.ketchikanOptions.forEach(k => {
    c.appendChild(el("div", { class: "info-card" }, [
      k.tag ? pill(k.tag) : null,
      el("div", { style: "font-size:17px;margin-top:6px;" }, k.name),
      muted(k.meta),
      muted(k.desc)
    ]));
  });

  c.appendChild(el("h2", { class: "section-heading" }, "A late night in Victoria, BC"));
  const vic = el("div", { class: "info-card" });
  vic.appendChild(muted(TripData.victoriaWhen));
  vic.appendChild(muted(TripData.victoriaIntro));
  TripData.victoriaSteps.forEach(s => {
    vic.appendChild(el("div", { style: "font-size:12px;font-weight:600;color:var(--secondary);margin-top:8px;" }, s.time));
    vic.appendChild(muted(s.text));
  });
  vic.appendChild(muted("⚠️ " + TripData.victoriaHeadsUp));
  vic.appendChild(muted(TripData.victoriaSkipOption));
  c.appendChild(vic);
}

// ---------- Confirms tab ----------
function renderConfirms() {
  const c = document.getElementById("confirms-content");
  c.innerHTML = "";

  c.appendChild(el("h2", { class: "section-heading" }, "Flights"));
  [TripData.flightOutbound, TripData.flightReturn].forEach(block => {
    const card = el("div", { class: "info-card" });
    card.appendChild(pill(block.label));
    block.legs.forEach(leg => {
      card.appendChild(el("div", { class: "row-between" }, [
        el("span", { style: "font-size:14px;font-weight:600;" }, leg.time),
        el("span", { style: "font-size:14px;color:var(--on-surface-variant);" }, leg.code + (leg.note ? " · " + leg.note : ""))
      ]));
    });
    card.appendChild(muted(block.refs));
    c.appendChild(card);
  });

  c.appendChild(el("h2", { class: "section-heading" }, "Hotels & cabin"));
  TripData.lodging.forEach(l => {
    const card = el("div", { class: "info-card" }, [
      pill(l.type),
      el("div", { style: "font-size:18px;font-weight:600;color:var(--primary);margin-top:6px;" }, l.name),
      el("div", { class: "row-between" }, [muted("Check-in"), el("span", { style: "font-size:14px;font-weight:600;" }, l.checkin)]),
      el("div", { class: "row-between" }, [muted("Check-out"), el("span", { style: "font-size:14px;font-weight:600;" }, l.checkout)]),
      bulletList(l.details)
    ]);
    const links = el("div", { class: "link-row" }, [linkBtn("📍 Open in Maps", () => openMaps(l.address))]);
    if (l.phone) links.appendChild(linkBtn("📞 Call", () => openCall(l.phone)));
    card.appendChild(links);
    c.appendChild(card);
  });

  c.appendChild(el("h2", { class: "section-heading" }, "Rental car"));
  const rc = TripData.rentalCar;
  c.appendChild(el("div", { class: "info-card" }, [
    pill(rc.vendor),
    el("div", { style: "font-size:18px;font-weight:600;color:var(--primary);margin-top:6px;" }, rc.name),
    el("div", { class: "row-between" }, [muted("Pickup"), el("span", { style: "font-size:14px;font-weight:600;" }, rc.pickup)]),
    el("div", { class: "row-between" }, [muted("Return"), el("span", { style: "font-size:14px;font-weight:600;" }, rc.ret)]),
    muted(rc.location),
    bulletList(rc.details),
    el("div", { class: "link-row" }, [linkBtn("📍 Open in Maps", () => openMaps(rc.location))])
  ]));

  c.appendChild(el("h2", { class: "section-heading" }, "Cruise ports"));
  const cruiseCard = el("div", { class: "info-card" });
  TripData.cruiseStops.forEach(s => {
    cruiseCard.appendChild(el("div", { class: "row-between" }, [muted(s.day), el("span", { style: "font-size:14px;" }, `${s.place} · ${s.time}`)]));
  });
  c.appendChild(cruiseCard);

  c.appendChild(el("p", {
    class: "heading-font",
    style: "text-align:center;color:var(--primary);font-size:20px;padding:24px 20px;"
  }, "❤ Here's to the first of many trips, Mr. & Mrs. Purdum ❤"));
}

// ============================================================
//  Us tab — Rituals & Memory (all device-local, IndexedDB)
// ============================================================
const TRIP_START = "2026-08-05";
const TRIP_END   = "2026-08-15";

function tripDayForDate(iso) { return TripData.days.find(d => d.calendarDate === iso) || null; }
function augDayNum(iso) { return parseInt(iso.slice(8, 10), 10); }
// Decode base64 that holds UTF-8 bytes (atob alone mangles the em-dashes).
function b64ToUtf8(b64) {
  return new TextDecoder().decode(Uint8Array.from(atob(b64), c => c.charCodeAt(0)));
}

async function renderUs() {
  const c = document.getElementById("us-content");
  c.innerHTML = "";
  const today = localISODate();
  // Build the five cards in order; each fills itself (async IDB reads inside).
  const loveCard    = el("div", { class: "info-card" });
  const roseCard    = el("div", { class: "info-card" });
  const confessCard = el("div", { class: "info-card" });
  const scrapCard   = el("div", { class: "info-card" });
  const badgeCard   = el("div", { class: "info-card" });
  c.append(loveCard, roseCard, confessCard, scrapCard, badgeCard);
  renderLoveNotesCard(loveCard, today);
  renderRoseCard(roseCard, today);
  renderConfessionalCard(confessCard, today);
  renderScrapbookCard(scrapCard, today);
  renderBadgesCard(badgeCard, today);
}

// ---------- 💌 Love notes ----------
function renderLoveNotesCard(card, today) {
  card.innerHTML = "";
  card.appendChild(pill("💌 A text has arrived"));
  const list = el("div", { style: "margin-top:10px;" });
  TripData.days.forEach(day => {
    const locked = today < day.calendarDate;
    const isToday = today === day.calendarDate;
    const row = el("div", {
      class: "note-row" + (locked ? " locked" : "") + (isToday ? " today" : ""),
      onclick: locked ? null : () => openNoteModal(day)
    }, [
      el("span", { class: "note-day" }, `Day ${day.id}`),
      locked
        ? el("span", { class: "note-status locked" }, `🔒 Unlocks Aug ${augDayNum(day.calendarDate)} — no peeking, islander.`)
        : el("span", { class: "note-status" }, (isToday ? "💗 Today's note — tap to open" : "💌 Tap to reopen"))
    ]);
    list.appendChild(row);
  });
  card.appendChild(list);
}

function openNoteModal(day) {
  let text = "(this note is shy)";
  try { text = b64ToUtf8(LOVE_NOTES[day.id]); } catch (e) { /* fallback stands */ }
  const overlay = el("div", { class: "note-modal" }, [
    el("div", { class: "note-card", onclick: e => e.stopPropagation() }, [
      el("div", { class: "note-flap" }, "💌"),
      el("div", { class: "note-eyebrow" }, `Day ${day.id} · Aug ${augDayNum(day.calendarDate)}`),
      el("div", { class: "note-body heading-font" }, text),
      el("button", { class: "note-close", onclick: () => overlay.remove() }, "close")
    ])
  ]);
  overlay.addEventListener("click", () => overlay.remove());
  document.body.appendChild(overlay);
  requestAnimationFrame(() => heartBurst(window.innerWidth / 2, window.innerHeight / 2));
}

// ---------- 🌹 Rose Ceremony ----------
async function renderRoseCard(card, today) {
  card.innerHTML = "";
  card.appendChild(pill("🌹 The Rose Ceremony"));
  if (today < TRIP_START) {
    card.appendChild(muted("The first ceremony airs the night of Aug 5."));
    return;
  }
  card.appendChild(el("div", { class: "rose-tonight" }, "— tonight"));
  const rec = (await Store.get("roses", today)) || { date: today, tRoses: 0, tLine: "", cRoses: 0, cLine: "" };

  card.appendChild(roseHalf("Tanner → Chloe", rec, "t", today));
  card.appendChild(roseHalf("Chloe → Tanner", rec, "c", today));

  const all = (await Store.all("roses")).filter(r => r.date !== today && (r.tRoses || r.cRoses || r.tLine || r.cLine));
  if (all.length) {
    all.sort((a, b) => b.date.localeCompare(a.date));
    const det = el("details", { class: "past-ceremonies" }, [ el("summary", {}, "Past ceremonies") ]);
    all.forEach(r => {
      det.appendChild(el("div", { class: "past-row" }, [
        el("div", { class: "past-date" }, `Aug ${augDayNum(r.date)}`),
        r.tRoses || r.tLine ? muted(`🌹×${r.tRoses} T→C${r.tLine ? " · “" + r.tLine + "”" : ""}`) : null,
        r.cRoses || r.cLine ? muted(`🌹×${r.cRoses} C→T${r.cLine ? " · “" + r.cLine + "”" : ""}`) : null
      ]));
    });
    card.appendChild(det);
  }
}

function roseHalf(label, rec, who, today) {
  const rosesKey = who + "Roses", lineKey = who + "Line";
  const state = { n: rec[rosesKey] || 0 };
  const buttons = [];
  const roseRow = el("div", { class: "rose-row" });
  for (let i = 1; i <= 5; i++) {
    const b = el("button", {
      class: "rose-btn" + (i <= state.n ? " on" : ""),
      onclick: () => {
        state.n = (state.n === i) ? i - 1 : i; // tapping the current count clears back one
        buttons.forEach((btn, idx) => btn.classList.toggle("on", idx < state.n));
      }
    }, "🌹");
    buttons.push(b);
    roseRow.appendChild(b);
  }
  const input = el("input", {
    class: "rose-line", type: "text", maxlength: "120",
    placeholder: "one sentence, from the heart", value: rec[lineKey] || ""
  });
  const saveBtn = el("button", { class: "rose-save" }, "Save");
  saveBtn.addEventListener("click", async () => {
    const fresh = (await Store.get("roses", today)) || { date: today, tRoses: 0, tLine: "", cRoses: 0, cLine: "" };
    fresh[rosesKey] = state.n;
    fresh[lineKey] = input.value.trim();
    await Store.put("roses", fresh);
    heartBurstAt(saveBtn);
    toast("Roses given. The islanders remain coupled.");
  });
  return el("div", { class: "rose-half" }, [
    el("div", { class: "rose-half-label" }, label),
    roseRow, input, saveBtn
  ]);
}

// ---------- 🎤 The Confessional ----------
async function renderConfessionalCard(card, today) {
  card.innerHTML = "";
  const tripDay = tripDayForDate(today);
  let dayN, preview = false;
  if (tripDay) dayN = tripDay.id;
  else if (today < TRIP_START) { dayN = 1; preview = true; }
  else dayN = 11;
  const dayObj = TripData.days.find(d => d.id === dayN);
  const recDate = dayObj.calendarDate;

  card.appendChild(pill(`🎤 The Confessional — Day ${dayN}${preview ? " (sneak peek)" : ""}`));
  const firstT = dayN % 2 === 1; // odd day: Tanner first
  card.appendChild(el("div", { class: "confess-chip" }, `${firstT ? "T" : "C"} answers first tonight`));

  const rec = (await Store.get("confessional", recDate)) || { date: recDate, answers: {} };
  const idxs = [(dayN - 1) * 2, (dayN - 1) * 2 + 1];
  idxs.forEach(idx => {
    rec.answers[idx] = rec.answers[idx] || { t: "", c: "" };
    card.appendChild(el("div", { class: "confess-prompt" }, CONFESSIONAL_PROMPTS[idx]));
    ["t", "c"].forEach(who => {
      const ta = el("textarea", {
        class: "confess-input", rows: "2",
        placeholder: who === "t" ? "Tanner…" : "Chloe…"
      });
      ta.value = rec.answers[idx][who];
      ta.addEventListener("blur", async () => {
        rec.answers[idx][who] = ta.value;
        await Store.put("confessional", rec);
        toast("Confessional saved 🎬");
      });
      card.appendChild(ta);
    });
  });

  const all = (await Store.all("confessional")).filter(r => r.date !== recDate);
  if (all.length) {
    all.sort((a, b) => b.date.localeCompare(a.date));
    const det = el("details", { class: "confess-archive" }, [ el("summary", {}, "Earlier confessionals") ]);
    all.forEach(r => {
      const dObj = tripDayForDate(r.date);
      const dN = dObj ? dObj.id : augDayNum(r.date);
      Object.entries(r.answers).forEach(([idx, ans]) => {
        if (!ans.t && !ans.c) return;
        det.appendChild(el("div", { class: "past-row" }, [
          el("div", { class: "past-date" }, `Day ${dN}`),
          el("div", { class: "confess-q" }, CONFESSIONAL_PROMPTS[idx] || ""),
          ans.t ? muted("T: " + ans.t) : null,
          ans.c ? muted("C: " + ans.c) : null
        ]));
      });
    });
    card.appendChild(det);
  }
}

// ---------- 📸 Scrapbook ----------
let _scrapDay = null;        // selected day id
let _scrapUrls = [];         // object URLs to revoke on re-render
function revokeScrapUrls() { _scrapUrls.forEach(u => URL.revokeObjectURL(u)); _scrapUrls = []; }
function nearestDayId(today) {
  const t = new Date(today + "T00:00:00").getTime();
  let best = TripData.days[0].id, bestDiff = Infinity;
  TripData.days.forEach(d => {
    const diff = Math.abs(new Date(d.calendarDate + "T00:00:00").getTime() - t);
    if (diff < bestDiff) { bestDiff = diff; best = d.id; }
  });
  return best;
}

async function renderScrapbookCard(card, today) {
  card.innerHTML = "";
  revokeScrapUrls();
  if (_scrapDay == null) _scrapDay = nearestDayId(today);
  card.appendChild(pill("📸 Scrapbook"));

  const chips = el("div", { class: "scrap-chips" });
  TripData.days.forEach(d => {
    chips.appendChild(el("button", {
      class: "scrap-chip" + (d.id === _scrapDay ? " on" : ""),
      onclick: () => { _scrapDay = d.id; renderScrapbookCard(card, today); }
    }, `EP${d.id}`));
  });
  card.appendChild(chips);

  const day = TripData.days.find(d => d.id === _scrapDay);
  card.appendChild(el("div", { class: "scrap-daylabel" }, day.date + " · " + day.title));

  // Caption (journal store, autosave on blur)
  const journal = (await Store.get("journal", day.calendarDate)) || { date: day.calendarDate, text: "" };
  const caption = el("textarea", { class: "scrap-caption", rows: "2", placeholder: "a line about this day…" });
  caption.value = journal.text;
  caption.addEventListener("blur", async () => {
    journal.text = caption.value;
    await Store.put("journal", journal);
    toast("Saved 📝");
  });
  card.appendChild(caption);

  // Photo grid
  const grid = el("div", { class: "scrap-grid" });
  const photos = (await Store.all("photos")).filter(p => p.date === day.calendarDate).sort((a, b) => a.ts - b.ts);
  photos.forEach(p => {
    const url = URL.createObjectURL(p.blob);
    _scrapUrls.push(url);
    grid.appendChild(el("div", {
      class: "scrap-thumb", style: `background-image:url('${url}')`,
      onclick: () => openLightbox(p, () => renderScrapbookCard(card, today))
    }));
  });
  card.appendChild(grid);

  // Add photos
  const fileInput = el("input", { type: "file", accept: "image/*", multiple: "", hidden: "" });
  fileInput.addEventListener("change", async () => {
    for (const file of fileInput.files) {
      try {
        const blob = await compressImage(file);
        const id = `${day.calendarDate}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        await Store.put("photos", { id, date: day.calendarDate, blob, ts: Date.now() });
      } catch (e) { /* skip an image that won't decode */ }
    }
    renderScrapbookCard(card, today);
  });
  const addBtn = el("button", { class: "scrap-add", onclick: () => fileInput.click() }, "＋ Add photos");
  card.append(addBtn, fileInput);
}

function openLightbox(photo, onDelete) {
  const url = URL.createObjectURL(photo.blob);
  const img = el("div", { class: "lb-img", style: `background-image:url('${url}')` });
  const overlay = el("div", { class: "lightbox" }, [
    img,
    el("div", { class: "lb-meta" }, `Aug ${augDayNum(photo.date)}`),
    el("button", { class: "lb-del", onclick: async e => {
      e.stopPropagation();
      if (confirm("Delete this photo?")) {
        await Store.del("photos", photo.id);
        close(); onDelete && onDelete();
      }
    } }, "🗑 Delete"),
    el("button", { class: "lb-close", onclick: e => { e.stopPropagation(); close(); } }, "✕")
  ]);
  function close() { URL.revokeObjectURL(url); overlay.remove(); }
  overlay.addEventListener("click", close);
  onDoubleTap(img, e => { e.stopPropagation(); heartBurstAt(img); });
  document.body.appendChild(overlay);
}

// ---------- 🏆 Badges ----------
async function renderBadgesCard(card, today) {
  card.innerHTML = "";
  card.appendChild(pill("🏆 Couple Achievements"));
  const earned = {};
  (await Store.all("badges")).forEach(b => { earned[b.id] = b.earnedDate; });
  const grid = el("div", { class: "badge-grid" });
  BADGES.forEach(def => {
    const isEarned = !!earned[def.id];
    const cell = el("button", { class: "badge-cell" + (isEarned ? " earned" : "") }, [
      el("div", { class: "badge-emoji" }, def.emoji),
      el("div", { class: "badge-name" }, def.name)
    ]);
    cell.addEventListener("click", async e => {
      if (isEarned) {
        if (confirm(`“${def.name}” — earned Aug ${augDayNum(earned[def.id])}. Un-award?`)) {
          await Store.del("badges", def.id);
          renderBadgesCard(card, today);
        }
      } else {
        if (confirm(`Award “${def.name}”?`)) {
          await Store.put("badges", { id: def.id, earnedDate: today });
          heartBurstAt(cell);
          renderBadgesCard(card, today);
        }
      }
    });
    grid.appendChild(cell);
  });
  card.appendChild(grid);
}

// ============================================================
//  Phase 3 — Smart trip layer
//  (every fn takes now = new Date() so logic is testable from console)
// ============================================================

// "1:30 PM" → minutes since midnight (null if the time isn't a real clock time).
function parseStopMinutes(timeStr) {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)/i.exec(timeStr);
  if (!m) return null;
  let h = (+m[1]) % 12;
  if (/PM/i.test(m[3])) h += 12;
  return h * 60 + (+m[2]);
}
function nowMinutes(now) { return now.getHours() * 60 + now.getMinutes(); }
function minutesToTime(min) {
  min = ((min % 1440) + 1440) % 1440;
  let h = Math.floor(min / 60); const m = min % 60;
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12; if (h === 0) h = 12;
  return `${h}:${String(m).padStart(2, "0")} ${ap}`;
}

// ---------- Now / Next strip (Days tab, trip days only, both modes) ----------
function renderNowNext(now = new Date()) {
  const view = document.getElementById("view-days");
  let strip = document.getElementById("now-next");
  const day = tripDayForDate(localISODate(now));
  if (!day) { if (strip) strip.remove(); return; }
  const nowMin = nowMinutes(now);
  const timed = day.schedule.map((s, i) => ({ s, i, min: parseStopMinutes(s.time) })).filter(x => x.min != null);
  let nowStop = null;
  timed.forEach(x => { if (x.min <= nowMin) nowStop = x; });
  const nextStop = timed.find(x => x.min > nowMin) || null;
  if (!strip) {
    strip = el("div", { id: "now-next", class: "now-next" });
    view.querySelector(".hero").after(strip);
  }
  strip.innerHTML = "";
  strip.onclick = () => {
    openDayDetail(day.id);
    const target = nextStop || nowStop;
    if (target) setTimeout(() => {
      const r = document.getElementById("stop-row-" + (target.i + 1));
      if (r) r.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 420);
  };
  strip.append(
    el("div", { class: "nn-part" }, [
      el("span", { class: "nn-tag now" }, "NOW"),
      el("span", { class: "nn-txt" }, nowStop ? `${nowStop.s.time} ${nowStop.s.title}` : "first up")
    ]),
    el("span", { class: "nn-sep" }, "▸"),
    el("div", { class: "nn-part" }, [
      el("span", { class: "nn-tag next" }, "NEXT"),
      el("span", { class: "nn-txt" }, nextStop ? `${nextStop.s.time} ${nextStop.s.title}` : "that's a wrap")
    ])
  );
}

// ---------- "I've got a text!" banner (show mode, trip days, once/session) ----------
function maybeTextAlert(now = new Date()) {
  if (!ShowMode.on) return;
  if (sessionStorage.getItem("hm_text_alert")) return;
  const day = tripDayForDate(localISODate(now));
  if (!day) return;
  const nowMin = nowMinutes(now);
  const timed = day.schedule.map(s => ({ s, min: parseStopMinutes(s.time) })).filter(x => x.min != null);
  const next = timed.find(x => x.min > nowMin);
  if (!next || (next.min - nowMin) > 90) return;
  sessionStorage.setItem("hm_text_alert", "1");
  const banner = el("div", { class: "text-alert" }, [ el("div", { class: "ta-line1" }, "I'VE GOT A TEXT! 💬") ]);
  let stage = 0;
  banner.addEventListener("click", e => {
    if (e.target.classList.contains("ta-close")) return;
    if (stage === 0) {
      stage = 1;
      banner.appendChild(el("div", { class: "ta-line2" }, `Islanders, please gather at: ${next.s.title} — ${next.s.time}`));
    } else { banner.remove(); openDayDetail(day.id); }
  });
  banner.appendChild(el("button", { class: "ta-close", onclick: e => { e.stopPropagation(); banner.remove(); } }, "✕"));
  document.body.appendChild(banner);
}

// ---------- Live weather (open-meteo, keyless) ----------
const WX_TTL = 3 * 60 * 60 * 1000; // 3h
function wxCodeEmoji(code) {
  if (code <= 1) return "☀️"; if (code <= 3) return "⛅"; if (code <= 48) return "🌫";
  if (code <= 67) return "🌧"; if (code <= 77) return "🌨"; if (code <= 82) return "🌧"; return "⛈";
}
function wxAgoText(fetchedAt, now) {
  const mins = Math.max(0, Math.round((now.getTime() - fetchedAt) / 60000));
  return mins < 60 ? `${mins}m ago` : `${Math.round(mins / 60)}h ago`;
}
async function fetchWeather(now = new Date()) {
  if (!navigator.onLine) return;
  const start = new Date(TRIP_START + "T00:00:00"), end = new Date(TRIP_END + "T00:00:00");
  if (now > end) return;                                  // trip's over
  if ((start - now) > 16 * 86400000) return;              // more than 16 days out
  let cache = {};
  try { cache = JSON.parse(localStorage.getItem("hm_wx") || "{}"); } catch (e) { /* ignore */ }
  if (cache.fetchedAt && (now.getTime() - cache.fetchedAt) < WX_TTL) return; // still fresh
  const byPoint = {};
  for (const [key, p] of Object.entries(WEATHER_POINTS)) {
    try {
      const u = `https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lng}` +
        `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode` +
        `&temperature_unit=fahrenheit&timezone=auto&start_date=${TRIP_START}&end_date=${TRIP_END}`;
      const res = await fetch(u);
      if (res.ok) byPoint[key] = (await res.json()).daily;
    } catch (e) { /* offline mid-run: keep what we got */ }
  }
  if (Object.keys(byPoint).length) {
    localStorage.setItem("hm_wx", JSON.stringify({ fetchedAt: now.getTime(), byPoint }));
    if (document.getElementById("view-trip").classList.contains("active")) renderTrip();
  }
}
// Forecast for a point on a date, or null if we have no cached data for it.
function wxFor(pointKey, dateISO) {
  let cache; try { cache = JSON.parse(localStorage.getItem("hm_wx") || "{}"); } catch (e) { return null; }
  const daily = cache.byPoint && cache.byPoint[pointKey];
  if (!daily || !daily.time) return null;
  const idx = daily.time.indexOf(dateISO);
  if (idx < 0) return null;
  return {
    high: Math.round(daily.temperature_2m_max[idx]),
    low: Math.round(daily.temperature_2m_min[idx]),
    precip: daily.precipitation_probability_max[idx],
    code: daily.weathercode[idx],
    fetchedAt: cache.fetchedAt
  };
}
// Map the Trip-tab weather legs to a representative point + date.
const LEG_WX = {
  "Seattle": { point: "seattle", date: "2026-08-08" },
  "Forks & Olympic Peninsula": { point: "forks", date: "2026-08-06" },
  "Alaska Inside Passage": { point: "juneau", date: "2026-08-10" }
};

// ---------- Pre-trip countdown + milestone ----------
const MILESTONES = [
  { date: "2026-07-22", label: "Two weeks out — book the dinners" },
  { date: "2026-07-24", label: "Airbnb balance auto-pays" },
  { date: "2026-07-29", label: "One week out — cards, meds, printing" },
  { date: "2026-08-04", label: "Check-in opens 5:30 AM — pack the carry-ons" }
];
function renderCountdown(now = new Date()) {
  const hero = document.querySelector("#view-days .hero");
  let box = hero.querySelector(".countdown-box");
  const start = new Date(TRIP_START + "T00:00:00");
  if (now >= start) { if (box) box.remove(); return; } // during/after trip: hidden
  if (!box) {
    box = el("div", { class: "countdown-box" });
    const status = hero.querySelector(".trip-status");
    if (status) status.after(box); else hero.appendChild(box);
  }
  const diff = start - now;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  box.innerHTML = "";
  box.appendChild(el("div", { class: "countdown" }, `${d}d ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m`));
  const next = MILESTONES.find(ms => new Date(ms.date + "T00:00:00") >= now);
  if (next) {
    const label = new Date(next.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
    box.appendChild(el("div", { class: "next-milestone" }, `Next: ${label} — ${next.label}`));
  }
}

// Refresh the live Days-tab widgets (called on boot, on interval, on focus).
function refreshTripWidgets(now = new Date()) { renderNowNext(now); renderCountdown(now); }

// ---------- "We're here" running-late shift (today's day detail only) ----------
let _shiftAnchor = null; // {index, deltaMin} — in-memory, resets on reload
function renderTimelineInto(wrap, day, isToday) {
  wrap.innerHTML = "";
  if (_shiftAnchor) {
    const sign = _shiftAnchor.deltaMin >= 0 ? "+" : "";
    wrap.appendChild(el("div", { class: "shift-banner" }, [
      el("span", {}, `running ${sign}${_shiftAnchor.deltaMin} min — breathe, it's vacation`),
      el("button", { class: "shift-reset", onclick: () => { _shiftAnchor = null; renderTimelineInto(wrap, day, isToday); } }, "✕")
    ]));
  }
  const timeline = el("div", { class: "timeline" });
  day.schedule.forEach((stop, i) => {
    timeline.appendChild(renderTimelineRow(stop, i + 1, i === day.schedule.length - 1, day, isToday, i, wrap));
  });
  wrap.appendChild(timeline);
}

// ============================================================
//  Phase 4 — Keepsake (finale reel, backup/restore, easter egg)
// ============================================================

// ---------- ▶ Season Finale reel ----------
async function openFinale() {
  if (document.querySelector(".finale-stage")) return;
  const [photos, journals, roses, badges] = await Promise.all([
    Store.all("photos"), Store.all("journal"), Store.all("roses"), Store.all("badges")
  ]);
  const firstPhoto = {};
  photos.slice().sort((a, b) => a.ts - b.ts).forEach(p => { if (!firstPhoto[p.date]) firstPhoto[p.date] = p.blob; });
  const journalBy = {}; journals.forEach(j => { journalBy[j.date] = j.text; });
  const rosesBy = {};   roses.forEach(r => { rosesBy[r.date] = r; });
  const earned = badges.slice().sort((a, b) => a.earnedDate.localeCompare(b.earnedDate));
  const urls = [];

  const slides = [];
  // 1 — title
  slides.push(el("div", { class: "finale-slide finale-title" }, [
    el("div", { class: "ft-eyebrow" }, "THE HONEYMOON"),
    el("div", { class: "ft-script script-font" }, "season one"),
    el("div", { class: "ft-sig" }, "Tanner ♥ Chloe · Aug 2026")
  ]));
  // 2..12 — per day
  TripData.days.forEach(day => {
    let bg = DAY_PHOTOS[day.id];
    if (firstPhoto[day.calendarDate]) { const u = URL.createObjectURL(firstPhoto[day.calendarDate]); urls.push(u); bg = u; }
    const r = rosesBy[day.calendarDate];
    const roseLines = [];
    if (r && (r.tRoses || r.tLine)) roseLines.push(`🌹×${r.tRoses} T→C${r.tLine ? " “" + r.tLine + "”" : ""}`);
    if (r && (r.cRoses || r.cLine)) roseLines.push(`🌹×${r.cRoses} C→T${r.cLine ? " “" + r.cLine + "”" : ""}`);
    slides.push(el("div", { class: "finale-slide finale-day", style: `background-image:url('${bg}')` }, [
      el("div", { class: "fd-wash" }),
      el("div", { class: "fd-inner" }, [
        el("div", { class: "fd-ep" }, `EPISODE ${day.id}`),
        el("div", { class: "fd-title heading-font" }, EPISODE_TITLES[day.id]),
        journalBy[day.calendarDate] ? el("div", { class: "fd-caption" }, journalBy[day.calendarDate]) : null,
        roseLines.length ? el("div", { class: "fd-roses" }, roseLines.map(t => el("div", {}, t))) : null
      ])
    ]));
  });
  // 13 — badge wall
  slides.push(el("div", { class: "finale-slide finale-badges" }, [
    el("div", { class: "fd-inner" }, [
      el("div", { class: "fd-ep" }, "COUPLE ACHIEVEMENTS"),
      earned.length
        ? el("div", { class: "fb-grid" }, earned.map(b => {
            const def = BADGES.find(x => x.id === b.id) || { emoji: "🏅", name: b.id };
            return el("div", { class: "fb-cell" }, [
              el("div", { class: "fb-emoji" }, def.emoji),
              el("div", { class: "fb-name" }, def.name),
              el("div", { class: "fb-date" }, `Aug ${augDayNum(b.earnedDate)}`)
            ]);
          }))
        : el("div", { class: "fd-caption" }, "The whole season, and not one badge awarded. Very mysterious.")
    ])
  ]));
  // 14 — closing
  slides.push(el("div", { class: "finale-slide finale-ending" }, [
    el("div", { class: "fc-hearts" }, "❤ 💗 💞 ❤ 💗"), // static hearts (also for reduced-motion)
    el("div", { class: "fc-script script-font" }, "renewed forever"),
    el("div", { class: "ft-sig" }, "Tanner ♥ Chloe")
  ]));

  const stage = el("div", { class: "finale-stage" });
  const bar = el("div", { class: "finale-bar" });
  const segs = slides.map(() => { const fill = el("div", { class: "finale-seg-fill" }); bar.appendChild(el("div", { class: "finale-seg" }, fill)); return fill; });
  stage.appendChild(bar);
  stage.appendChild(el("button", { class: "finale-close", onclick: e => { e.stopPropagation(); exit(); } }, "✕"));
  const holder = el("div", { class: "finale-slides" });
  slides.forEach(s => holder.appendChild(s));
  stage.appendChild(holder);

  let idx = 0, timer = null;
  const AUTO = 5000;
  function paint() {
    slides.forEach((s, i) => s.classList.toggle("active", i === idx));
    segs.forEach((f, i) => { f.style.transition = "none"; f.style.width = i < idx ? "100%" : "0%"; });
    // start the current segment's fill animation on the next frame
    requestAnimationFrame(() => {
      const f = segs[idx];
      if (!f) return;
      if (_reduceMotion()) { f.style.width = "100%"; return; }
      f.style.transition = `width ${AUTO}ms linear`;
      f.style.width = "100%";
    });
    if (slides[idx].classList.contains("finale-ending")) heartRain();
  }
  function schedule() { clearTimeout(timer); timer = setTimeout(() => go(1), AUTO); }
  function go(dir) {
    const n = idx + dir;
    if (n < 0) { idx = 0; }
    else if (n >= slides.length) { exit(); return; }
    else idx = n;
    paint(); schedule();
  }
  function heartRain() {
    if (_reduceMotion()) return;
    [0, 300, 600, 900, 1200].forEach(d => setTimeout(() => heartBurst(window.innerWidth * (.2 + Math.random() * .6), window.innerHeight * .4), d));
  }
  function exit() { clearTimeout(timer); urls.forEach(u => URL.revokeObjectURL(u)); stage.remove(); }

  holder.addEventListener("click", e => {
    const rect = holder.getBoundingClientRect();
    (e.clientX - rect.left > rect.width / 2) ? go(1) : go(-1);
  });
  document.body.appendChild(stage);
  paint(); schedule();
}

// Days-hero entry: a glowing finale button once the trip is over.
function renderFinaleEntry(today) {
  const hero = document.querySelector("#view-days .hero");
  let btn = hero.querySelector(".finale-entry");
  if (today > TRIP_END) {
    if (!btn) {
      btn = el("button", { class: "finale-entry", onclick: openFinale }, "▶ The Season Finale");
      hero.appendChild(btn);
    }
  } else if (btn) btn.remove();
}

// ---------- 🗄 Backup & restore ----------
async function downloadBackup() {
  const [journal, roses, confessional, badges] = await Promise.all([
    Store.all("journal"), Store.all("roses"), Store.all("confessional"), Store.all("badges")
  ]);
  const data = { version: 1, exported: new Date().toISOString(), journal, roses, confessional, badges, settings: { showMode: ShowMode.on } };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = el("a", { href: url, download: `honeymoon-backup-${localISODate().replace(/-/g, "")}.json` });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("Backup downloaded 🗄");
}
function restoreBackup(file) {
  const reader = new FileReader();
  reader.onload = async () => {
    let data; try { data = JSON.parse(reader.result); } catch (e) { toast("That isn't a valid backup file"); return; }
    if (data.version !== 1) { toast("Unsupported backup version"); return; }
    if (!confirm("Restore this backup? Notes, roses, confessionals and badges will be overwritten where they overlap. (Photos are never in a backup.)")) return;
    for (const j of data.journal || []) await Store.put("journal", j);
    for (const r of data.roses || []) await Store.put("roses", r);
    for (const cf of data.confessional || []) await Store.put("confessional", cf);
    for (const b of data.badges || []) await Store.put("badges", b);
    if (data.settings && typeof data.settings.showMode === "boolean") localStorage.setItem("hm_show_mode", data.settings.showMode ? "1" : "0");
    toast("Backup restored ❤");
    applyShowMode();
  };
  reader.readAsText(file);
}

// ---------- 💍 Recoupling easter egg ----------
function openRecoupling() {
  const overlay = el("div", { class: "note-modal recouple" }, [
    el("div", { class: "note-card", onclick: e => e.stopPropagation() }, [
      pill("RECOUPLING CEREMONY"),
      el("div", { class: "recouple-text heading-font" }, "Tanner and Chloe have decided to recouple."),
      el("div", { class: "muted", style: "text-align:center;margin:6px 0 16px;" }, "(they were never really at risk)"),
      el("button", { class: "note-close", onclick: () => overlay.remove() }, "obviously ❤")
    ])
  ]);
  overlay.addEventListener("click", () => overlay.remove());
  document.body.appendChild(overlay);
  [0, 250, 500].forEach(d => setTimeout(() => heartBurst(window.innerWidth / 2, window.innerHeight * .6), d));
}

// Both gestures live on the hero script-line: long-press (800ms) previews the
// finale any time; five quick taps within 3s triggers the recoupling ceremony.
function wireHeroGestures() {
  const line = document.querySelector("#view-days .script-line");
  if (!line || line.dataset.wired) return;
  line.dataset.wired = "1";
  let pressTimer = null, longFired = false, taps = [];
  line.addEventListener("pointerdown", () => {
    longFired = false;
    pressTimer = setTimeout(() => { longFired = true; openFinale(); }, 800);
  });
  const clear = () => clearTimeout(pressTimer);
  line.addEventListener("pointerup", () => {
    clear();
    if (longFired) return; // long-press already handled
    const now = Date.now();
    taps = taps.filter(t => now - t < 3000);
    taps.push(now);
    if (taps.length >= 5) { taps = []; openRecoupling(); }
  });
  line.addEventListener("pointerleave", clear);
  line.addEventListener("pointercancel", clear);
}

// ---------- Tab navigation ----------
function showView(name) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-" + name).classList.add("active");
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  const map = { days: "days", "day-detail": "days", prep: "prep", trip: "trip", confirms: "confirms", us: "us" };
  const tabName = map[name];
  const btn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
  if (btn) btn.classList.add("active");
  window.scrollTo(0, 0);
}

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;
    withTransition(() => {
      showView(tab);
      if (tab === "prep") renderPrep();
      if (tab === "trip") renderTrip();
      if (tab === "confirms") renderConfirms();
      if (tab === "us") renderUs();
    });
  });
});

// Documentary Crew toggle
document.getElementById("crew-toggle").addEventListener("click", () => {
  ShowMode.toggle();
  toast(ShowMode.on ? "🎬 Cameras rolling — welcome to Season 1" : "Documentary crew sent home 👋");
});

// ---------- Add to Home Screen banner (iOS Safari only, not already standalone) ----------
(function a2hsBanner() {
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = window.navigator.standalone === true || window.matchMedia("(display-mode: standalone)").matches;
  if (!isIOS || isStandalone) return;
  if (localStorage.getItem("hm_a2hs_dismissed") === "1") return;
  const banner = document.getElementById("a2hs-banner");
  banner.style.display = "flex";
  document.getElementById("a2hs-close").addEventListener("click", () => {
    banner.style.display = "none";
    localStorage.setItem("hm_a2hs_dismissed", "1");
  });
})();

// ---------- Service worker (offline support) ----------
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js").catch(() => {}));
}

// Warm the offline map-tile cache once the page is idle (tiles route through the
// service worker's cache-first handler, so repeat runs never re-hit the network).
window.addEventListener("load", () => setTimeout(prefetchAllMapTiles, 2500));
// Pull live weather once online & within 16 days of the trip (throttled 3h).
window.addEventListener("load", () => setTimeout(() => fetchWeather(), 1500));

// ---------- Boot ----------
applyShowMode();            // sets labels + hero + renders the day list
refreshTripWidgets();       // Now/Next strip (trip days) + countdown (pre-trip)
maybeTextAlert();           // "I've got a text!" if a stop is within 90 min
wireHeroGestures();         // long-press → finale preview; 5 taps → recoupling
// Keep the live widgets current without burning battery: 30s Now/Next, and the
// countdown ticks every minute (renderCountdown is a no-op once the trip starts).
setInterval(() => renderNowNext(), 30000);
setInterval(() => renderCountdown(), 60000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) refreshTripWidgets(); });
