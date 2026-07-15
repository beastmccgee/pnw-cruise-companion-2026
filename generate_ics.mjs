// Generates one static .ics file per timed itinerary stop, plus a manifest the
// service worker uses to pre-cache them for offline use.
//
// Why static files instead of data:text/calendar URIs: iOS Safari blocks top-frame
// navigation to data: URIs, so the old approach silently did nothing on iPhone.
// A real https .ics URL opens Apple Calendar's native "Add Event" preview.
//
// Run after any TripData schedule change:  node generate_ics.mjs
import { readFileSync, mkdirSync, writeFileSync, rmSync } from "fs";

const src = readFileSync("js/data.js", "utf8");
const TripData = new Function(src + "; return TripData;")();

const TIMED = /^(\d{1,2}):(\d{2})\s*(AM|PM)/;
const pad = n => String(n).padStart(2, "0");
const esc = s => (s || "")
  .replace(/\\/g, "\\\\")
  .replace(/([,;])/g, "\\$1")
  .replace(/\r?\n/g, "\\n");

// RFC 5545 lines must be ≤75 octets; fold with CRLF + space
function fold(line) {
  const out = [];
  let cur = line;
  while (cur.length > 73) { out.push(cur.slice(0, 73)); cur = " " + cur.slice(73); }
  out.push(cur);
  return out.join("\r\n");
}

rmSync("calendar", { recursive: true, force: true });
mkdirSync("calendar", { recursive: true });

const files = [];
for (const day of TripData.days) {
  day.schedule.forEach((stop, i) => {
    const m = TIMED.exec(stop.time);
    if (!m) return;
    let hour = parseInt(m[1], 10);
    const minute = parseInt(m[2], 10);
    if (m[3] === "PM" && hour !== 12) hour += 12;
    if (m[3] === "AM" && hour === 12) hour = 0;

    const [y, mo, d] = day.calendarDate.split("-").map(Number);
    // Floating local time (no Z/TZID) on purpose: the phone will be in trip-local
    // time (PT/AKDT) when these fire, matching the printed itinerary times.
    const start = `${y}${pad(mo)}${pad(d)}T${pad(hour)}${pad(minute)}00`;
    let eh = hour + 1, ed = d, emo = mo;
    if (eh > 23) { eh = 23; } // clamp: no stop needs to roll past midnight
    const end = `${y}${pad(emo)}${pad(ed)}T${pad(eh)}${pad(minute)}00`;

    const name = `d${day.id}-s${i + 1}.ics`;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//T&C Honeymoon Companion//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:d${day.id}-s${i + 1}@tc-honeymoon-2026`,
      "DTSTAMP:20260715T000000Z",
      `DTSTART:${start}`,
      `DTEND:${end}`,
      fold(`SUMMARY:${esc(stop.title)}`),
      fold(`DESCRIPTION:${esc(stop.desc || day.title)}`),
      fold(`LOCATION:${esc(stop.address)}`),
      "END:VEVENT",
      "END:VCALENDAR",
      ""
    ].join("\r\n");
    writeFileSync(`calendar/${name}`, ics);
    files.push(name);
  });
}

writeFileSync("calendar/manifest.json", JSON.stringify(files, null, 0));
console.log(`Wrote ${files.length} .ics files + manifest.json`);
