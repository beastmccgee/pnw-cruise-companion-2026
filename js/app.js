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

// ---------- External actions ----------
function openMaps(address) {
  window.open("https://maps.apple.com/?q=" + encodeURIComponent(address), "_blank");
}
function openWebsite(url) { window.open(url, "_blank"); }
function openSearch(q) { window.open("https://www.google.com/search?q=" + encodeURIComponent(q), "_blank"); }
function openCall(phone) { window.location.href = "tel:" + phone; }
function openCalendar(title, desc, address, isoDate, timeText) {
  const start = parseStopStart(isoDate, timeText);
  if (!start) { alert("This stop doesn't have a fixed time to add to your calendar."); return; }
  const end = new Date(start.getTime() + 60 * 60000);
  const fmt = d => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const url = "https://www.google.com/calendar/render?action=TEMPLATE"
    + "&text=" + encodeURIComponent(title)
    + "&dates=" + fmt(start) + "/" + fmt(end)
    + "&details=" + encodeURIComponent(desc || "")
    + "&location=" + encodeURIComponent(address);
  window.open(url, "_blank");
}
function parseStopStart(isoDate, timeText) {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)/.exec(timeText || "");
  if (!m) return null;
  let hour = parseInt(m[1], 10);
  const minute = parseInt(m[2], 10);
  const ampm = m[3];
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;
  const d = new Date(isoDate + "T00:00:00");
  d.setHours(hour, minute, 0, 0);
  return d;
}

function linkBtn(label, onClick) {
  return el("button", { class: "link-btn", onclick: onClick }, label);
}

// ---------- Days tab ----------
function renderDaysList() {
  const container = document.getElementById("days-list");
  container.innerHTML = "";
  TripData.days.forEach(day => {
    const card = el("div", { class: "day-card", onclick: () => openDayDetail(day.id) }, [
      el("div", {
        class: "photo",
        style: `background-image:url('${DAY_PHOTOS[day.id]}')`
      }, [
        el("div", { class: "badge" }, String(day.id)),
        day.twilightTheme ? el("div", { class: "twilight-tag" }, "🌙 TWILIGHT") : null
      ]),
      el("div", { class: "body" }, [
        el("div", { class: "date" }, day.date.toUpperCase()),
        el("div", { class: "title heading-font" }, day.title),
        el("p", { class: "subtitle" }, day.subtitle),
        el("div", { class: "footer-row" }, [
          el("span", { class: "stops-count" }, `${day.schedule.length} stops planned`),
          el("span", { style: "color:var(--primary);" }, "›")
        ])
      ])
    ]);
    container.appendChild(card);
  });
}

// ---------- Day detail ----------
let currentMap = null;

function openDayDetail(dayId) {
  const day = TripData.days.find(d => d.id === dayId);
  if (!day) return;
  const root = document.getElementById("day-detail-content");
  root.innerHTML = "";
  root.classList.toggle("twilight", !!day.twilightTheme);

  const hero = el("div", {
    class: "day-detail-hero",
    style: `background-image:url('${DAY_PHOTOS[day.id]}')`
  }, [
    el("button", { class: "back-btn", onclick: () => showView("days") }, "‹"),
    el("div", { class: "hero-text" }, [
      day.twilightTheme ? el("div", { class: "twilight-chip" }, "🌙 TWILIGHT SAGA DETOUR") : null,
      el("div", { class: "date-label" }, day.date.toUpperCase()),
      el("div", { class: "title-label heading-font" }, day.title)
    ])
  ]);
  root.appendChild(hero);

  const body = el("div", { class: "day-body" });
  body.appendChild(muted(day.subtitle));
  const mapDiv = el("div", { class: "day-map", id: "day-map-" + day.id });
  body.appendChild(mapDiv);

  const timeline = el("div", { class: "timeline" });
  day.schedule.forEach((stop, i) => {
    timeline.appendChild(renderTimelineRow(stop, i + 1, i === day.schedule.length - 1, day));
  });
  body.appendChild(timeline);
  root.appendChild(body);

  showView("day-detail");
  setTimeout(() => renderDayMap(mapDiv.id, day), 0);
}

function renderDayMap(elementId, day) {
  if (currentMap) { currentMap.remove(); currentMap = null; }
  const pts = day.schedule.map(s => s.point);
  const lats = pts.map(p => p.lat), lngs = pts.map(p => p.lng);
  const center = [(Math.min(...lats) + Math.max(...lats)) / 2, (Math.min(...lngs) + Math.max(...lngs)) / 2];
  const map = L.map(elementId, { zoomControl: false, attributionControl: false }).setView(center, 10);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18 }).addTo(map);
  const bounds = [];
  day.schedule.forEach((s, i) => {
    const color = s.isDispensary ? "#2E7D32" : "#B23A55";
    const icon = L.divIcon({
      className: "",
      html: `<div style="background:${color};width:24px;height:24px;border-radius:50%;border:2px solid #fff;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;">${i + 1}</div>`,
      iconSize: [24, 24], iconAnchor: [12, 12]
    });
    L.marker([s.point.lat, s.point.lng], { icon }).addTo(map);
    bounds.push([s.point.lat, s.point.lng]);
  });
  if (bounds.length > 1) map.fitBounds(bounds, { padding: [24, 24] });
  currentMap = map;
}

function renderTimelineRow(stop, index, isLast, day) {
  const row = el("div", { class: "timeline-row" }, [
    el("div", { class: "timeline-rail" }, [
      el("div", { class: "timeline-dot" + (stop.isDispensary ? " dispensary" : "") }),
      isLast ? null : el("div", { class: "timeline-line" })
    ]),
    el("div", { class: "timeline-content" }, [
      el("div", { class: "time" }, `${stop.time} · Stop ${index}`),
      el("div", { class: "title" }, stop.title),
      stop.isDispensary ? el("div", { class: "dispensary-tag" }, "🌿 DISPENSARY") : null,
      stop.desc ? muted(stop.desc) : null,
      renderStopLinks(stop, day)
    ])
  ]);
  return row;
}

function renderStopLinks(stop, day) {
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
    row.appendChild(linkBtn("📅 Calendar", () => openCalendar(stop.title, stop.desc, stop.address, day.calendarDate, stop.time)));
  }
  return row;
}

function toggleMenuOptions(anchorBtn, stop, day) {
  const existing = anchorBtn.parentElement.querySelector(".menu-popup");
  if (existing) { existing.remove(); return; }
  const popup = el("div", {
    class: "menu-popup",
    style: "position:absolute;background:var(--surface);border:1px solid var(--outline);border-radius:12px;padding:6px;box-shadow:0 8px 20px rgba(0,0,0,.18);z-index:5;margin-top:4px;"
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
    c.appendChild(el("div", { class: "info-card" }, [
      el("div", { style: "font-size:18px;font-weight:600;color:var(--primary);" }, w.name),
      muted(w.whenText),
      el("div", { style: "font-size:15px;font-weight:600;margin:4px 0;" }, `High ${w.high} · Low ${w.low}`),
      bulletList(w.bullets)
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

// ---------- Tab navigation ----------
function showView(name) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-" + name).classList.add("active");
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  const map = { days: "days", "day-detail": "days", prep: "prep", trip: "trip", confirms: "confirms" };
  const tabName = map[name];
  const btn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
  if (btn) btn.classList.add("active");
  window.scrollTo(0, 0);
}

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;
    showView(tab);
    if (tab === "prep") renderPrep();
    if (tab === "trip") renderTrip();
    if (tab === "confirms") renderConfirms();
  });
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

// ---------- Boot ----------
renderDaysList();
