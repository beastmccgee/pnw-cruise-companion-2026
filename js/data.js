// Trip content — ported 1:1 from the Android/iOS TripData source of truth.
const TripData = {
  weatherLegs: [
    { name: "Seattle", whenText: "Aug 5–8 & 15", high: "77°F", low: "56°F", bullets: [
      "Only a 12% chance of rain — the driest month",
      "8–10 hours of sunshine a day",
      "Light layer for cool evenings on the water"
    ]},
    { name: "Forks & Olympic Peninsula", whenText: "Aug 6–7", high: "70°F", low: "53°F", bullets: [
      "13% rain chance, but very humid (~84%)",
      "Morning ocean fog is common",
      "Rainforest interior runs 5–10°F cooler than town"
    ]},
    { name: "Alaska Inside Passage", whenText: "Aug 9–14", high: "low 60s°F", low: "high 40s°F", bullets: [
      "Weather flips hourly — sunny, rain, sunny again",
      "Juneau is cloudy ~280 days/yr · Skagway is the driest port",
      "Glacier Bay (Aug 12) is 10–15°F colder — your coldest day",
      "Ketchikan is the rainiest port — bring the shell off the ship"
    ]}
  ],

  dispensaries: [
    { city: "Seattle", whenText: "Wed, Aug 5 · stock for 3 days",
      primary: "Have a Heart — Belltown · 115 Blanchard St · 8 AM–11:45 PM daily",
      address: "115 Blanchard St, Seattle, WA", backup: null,
      notes: [
        "~0.7 mi south of the Moxy, on the walking line between Pike Place and the waterfront",
        "Buy enough for Aug 5 (Moxy), Aug 6 (Olson Cabin), Aug 7 (Hyatt) only",
        "Edibles & vapes travel best between rooms",
        "Olympic National Park is federal land — keep it in the car/cabin, not on trails"
      ], point: { lat: 47.6141, lng: -122.3439 } },
    { city: "Skagway", whenText: "Tue, Aug 11 · morning window",
      primary: "Remedy Shoppe · 371 3rd Ave · 9:30 AM–7 PM daily (summer)",
      address: "371 3rd Ave, Skagway, AK", backup: "BoomTown Buds · 200 4th Ave",
      notes: [
        "Both a 5–10 min walk from the dock — hit before the 2 PM White Pass excursion",
        "Consume in port only — anything left over gets tossed before reboarding"
      ], point: { lat: 59.4592, lng: -135.3140 } },
    { city: "Ketchikan", whenText: "Thu, Aug 13 · the easiest Alaska stop",
      primary: "The Stoney Moose · 127 Stedman St · 9 AM–9 PM Mon–Sat · 2-min walk from dock",
      address: "127 Stedman St, Ketchikan, AK", backup: null,
      notes: [
        "Ship in port 7 AM–1:15 PM; opens at 9, so ~3.5 unhurried hours",
        "Right next to Creek Street — pair with the salmon-falls walk and a fresh-salmon lunch"
      ], point: { lat: 55.3414, lng: -131.6461 } },
    { city: "Victoria", whenText: "Fri, Aug 14 · honestly, skip",
      primary: "Original Farm · 1402 Douglas St · closes 10 PM",
      address: "1402 Douglas St, Victoria, BC", backup: null,
      notes: [
        "You dock at 9 PM, shuttle downtown ~9:20 — a 40-min window trading the harbour walk for it",
        "Bigger issue: ship returns to a US port next morning — carrying Canadian cannabis aboard or across the border is a federal offense",
        "Better plan: enjoy the lit-up harbour and a pub, save dispensary curiosity for a future Vancouver trip"
      ], point: { lat: 48.4260, lng: -123.3656 } }
  ],
  dispensaryFooter: [
    "21+ in WA & AK · 19+ in BC · passport or driver's license works everywhere",
    "Most US dispensaries are cash-only or charge a card fee · ATM onsite at all four",
    "The big rule: nothing on the ship · nothing across the border · nothing on the plane home"
  ],

  flightOutbound: { label: "Outbound · Wed, Aug 5, 2026", refs: "Airline ref NXP2HK · Agency ref WKEQFL · Confirmed", legs: [
    { time: "5:30 AM", code: "CID", note: "Cedar Rapids" },
    { time: "6:54 AM", code: "DEN", note: "Denver · 1h 7m layover" },
    { time: "8:01 AM", code: "DEN", note: "Denver" },
    { time: "10:00 AM", code: "SEA", note: "Seattle" }
  ]},
  flightReturn: { label: "Return · Sat, Aug 15, 2026", refs: "Airline ref NXQCD4 · Agency ref WJYXGB · Confirmed", legs: [
    { time: "2:26 PM", code: "SEA", note: "Seattle" },
    { time: "6:17 PM", code: "DEN", note: "Denver · 2h 18m layover" },
    { time: "8:35 PM", code: "DEN", note: "Denver" },
    { time: "11:36 PM", code: "CID", note: "Cedar Rapids" }
  ]},

  lodging: [
    { name: "Moxy Seattle Downtown", type: "Hotel · South Lake Union",
      checkin: "Wed, Aug 5, 2026 · 3:00 PM", checkout: "Thu, Aug 6, 2026 · 12:00 PM",
      address: "1016 Republican Street, Seattle WA 98109", point: { lat: 47.6238, lng: -122.3382 },
      details: [
        "Room, 1 King Bed · 2 guests · Primary guest: Chloe Walker",
        "Stay confirmation 2457435612 · Chase trip ID 1017385602",
        "Total $320.88 · 26,449 pts redeemed · $56.39 to Visa ⋯8908",
        "Non-refundable · present a card at check-in for incidentals · min. check-in age 21"
      ], phone: null },
    { name: "Olson Cabin #1", type: "Airbnb · Forks, Olympic Peninsula",
      checkin: "Thu, Aug 6, 2026 · after 4:00 PM", checkout: "Fri, Aug 7, 2026 · by 10:00 AM",
      address: "2423 Mora Rd, Forks, WA 98331", point: { lat: 47.9336, lng: -124.6280 },
      details: [
        "For Tanner & Chloe · 2 adults · Host Rachel · +1 702-743-2921",
        "Confirmation HM8R9XRTDP",
        "Balance due $319.87 · Google Pay, scheduled Jul 24, 2026",
        "Free cancellation until 4:00 PM Aug 1, then non-refundable · self check-in with keypad"
      ], phone: "+17027432921" },
    { name: "Hyatt Regency Seattle", type: "Hotel · Seattle",
      checkin: "Fri, Aug 7, 2026 · 4:00 PM", checkout: "Sat, Aug 8, 2026 · 11:00 AM",
      address: "808 Howell St, Seattle WA 98101", point: { lat: 47.6127, lng: -122.3336 },
      details: [
        "Standard Room · 1 King Bed · Guest: Tanner Purdum",
        "Stay confirmation 2466994553 · Chase trip ID 1017949880",
        "Total $383.50 · 24,517 pts redeemed (1.4× Points Boost) · $6.04 to Visa ⋯2159",
        "Resort fee $34.22/night, due at property · non-refundable"
      ], phone: null }
  ],

  rentalCar: { name: "Toyota RAV4", vendor: "Sixt Rental",
    pickup: "Thu, Aug 6, 2026 · 8:00 AM", ret: "Fri, Aug 7, 2026 · 4:00 PM",
    location: "Seattle / Hyatt Regency · 808 Howell St, Seattle WA 98101", point: { lat: 47.6127, lng: -122.3336 },
    details: [
      "Main driver: Tanner Purdum",
      "Reservation 9734439990 · group IFAR · Intermediate SUV",
      "Included: Cover The Car · 24/7 roadside · unlimited miles · no deductible",
      "Paid $267.56 in advance · $200 deposit held at pickup"
    ]},

  cruiseShip: "Royal Princess",
  cruiseLine: "Princess Cruises",
  cruiseBlurb: "A Royal-class Princess ship — 3,560 guests, 19 decks. Rated 4.2 on U.S. News, with dining and crew getting the highest marks.",
  cruiseStops: [
    { day: "Sat · Aug 8", place: "Seattle, Washington", sub: "Embarkation", time: "depart 3:00 PM" },
    { day: "Sun · Aug 9", place: "At Sea", sub: "Day to wander the ship together", time: "all day" },
    { day: "Mon · Aug 10", place: "Juneau, Alaska", sub: "Whales, glacier & a taste of Alaska", time: "1:00 PM – 9:15 PM" },
    { day: "Tue · Aug 11", place: "Skagway, Alaska", sub: "White Pass rail & the Red Onion", time: "6:00 AM – 8:15 PM" },
    { day: "Wed · Aug 12", place: "Glacier Bay National Park", sub: "Scenic cruising", time: "6:00 AM – 2:30 PM" },
    { day: "Thu · Aug 13", place: "Ketchikan, Alaska", sub: "", time: "7:00 AM – 1:15 PM" },
    { day: "Fri · Aug 14", place: "Victoria, Canada", sub: "Evening in port", time: "9:00 PM – 11:59 PM" },
    { day: "Sat · Aug 15", place: "Seattle, Washington", sub: "Disembarkation", time: "arrive 7:00 AM" }
  ],
  cruiseHighlights: [
    { name: "The Sanctuary", desc: "Adults-only retreat, Deck 17 forward. Full-cruise pass ~$30/day. Cabanas from $80 half day. Aim for Aug 9 & Aug 12." },
    { name: "Lotus Spa & Enclave", desc: "Hammam, herbal steam, dry sauna, hydrotherapy pool. Book a couples massage in a Sanctuary villa." },
    { name: "SeaWalk", desc: "Glass-bottomed walkway extending 28 ft over the ocean. Worth it at sunset." },
    { name: "Movies Under the Stars", desc: "Poolside LED screen + blankets + popcorn. Campfire MUTS nights with Alaska-themed films." },
    { name: "Specialty dining", desc: "Crown Grill (steakhouse, ~$39pp) · Sabatini's (Italian) · Chef's Table Lumière · Ocean Terrace sushi" },
    { name: "Casual & quick", desc: "Alfredo's pizzeria · International Café (24 hr) · Horizon Court buffet · Trident Grill poolside" },
    { name: "Entertainment", desc: "Princess Theater shows · Princess Live · Crooners piano bar · Vines wine bar · Wheelhouse Pub" },
    { name: "North to Alaska", desc: "Onboard naturalists, native cultural performances, Iditarod talks, Glacier Bay ranger narration." }
  ],
  cruiseDressCode: "2 formal nights + 5 smart casual nights on the 7-night sailing",
  cruiseHoneymoonTip: "Mention it at check-in and to your room steward — small touches often appear",
  cruiseGlacierBayTip: "Rangers come aboard ~6 AM and narrate from the bridge cam — be on Deck 17 forward early",

  excursions: [
    { title: "Best of Juneau: Whales, Glacier & a Taste of Alaska", status: "Confirmed", price: "$299.95 × 2",
      whenText: "Juneau, Alaska · Mon, Aug 10 · depart 1:30 PM, return 8:15 PM", names: "Mr. Tanner Purdum & Mrs. Chloe Purdum" },
    { title: "Sip & Summit: White Pass Scenic Rail & Red Onion", status: "Confirmed", price: "$239.95 × 2",
      whenText: "Skagway, Alaska · Tue, Aug 11 · depart 2:00 PM, return 7:00 PM", names: "Mr. Tanner Purdum & Mrs. Chloe Purdum" }
  ],
  excursionsTotal: "$1,079.80 · two of you, two unforgettable days",

  ketchikanOptions: [
    { name: "Creek Street", meta: "Free · 5 min from dock", desc: "Historic boardwalk built on pilings over Ketchikan Creek — galleries and quirky shops, no admission.", tag: "Free" },
    { name: "Salmon ladder", meta: "Free", desc: "Watch salmon spawning right at the base of Creek Street — best mid-August.", tag: null },
    { name: "Married Man's Trail", meta: "Free · ~15 min walk", desc: "Waterfront walking trail along the creek — the old back route up from Creek Street's red-light-district days.", tag: null },
    { name: "Thomas Basin", meta: "Free", desc: "Small-boat harbor a few blocks south — fishing boats and floatplanes coming and going.", tag: null },
    { name: "Totem Heritage Center", meta: "$6 pp", desc: "The one paid stop, and a cheap one — an indoor collection of original 19th-century totem poles.", tag: null }
  ],

  victoriaWhen: "Fri · Aug 14 · 9 PM – 11:59 PM",
  victoriaIntro: "Just under 3 hours, in the dark, with Ogden Point 1.5 miles from town. Skip the formal excursion — plan a walk.",
  victoriaSteps: [
    { time: "9:00 PM", text: "Disembark · catch the cruise shuttle bus to Inner Harbour (~CAD $10–15 round trip)" },
    { time: "9:20 PM", text: "Inner Harbour walk — Parliament Building lit with 3,300+ lights, Fairmont Empress glow, harbour views (~30 min loop)" },
    { time: "10:00 PM", text: "Bard & Banker pub on Government St — Canadian beer or Scottish whisky, often live music. Alternatives: Irish Times Pub, Garrick's Head Pub" },
    { time: "11:15 PM", text: "Shuttle back to ship · onboard by 11:30, no stress" }
  ],
  victoriaHeadsUp: "The Pacific Coach Lines ferry only runs until 9 PM — use the cruise shuttle, not the ferry",
  victoriaSkipOption: "Six days of cruising is a lot. Watching the lit-up harbour from the ship deck with a glass of wine is also a completely valid plan.",

  packingList: [
    { heading: "Essentials", items: [
      "Waterproof rain shell with hood (each)", "Binoculars 8×42 — whale watching + Glacier Bay",
      "Hiking shoes or waterproof boots", "Wool/synthetic hiking socks", "Polarized sunglasses (cuts water glare)",
      "Warm beanie + light gloves", "Day backpack for ports", "Passports (Victoria, BC stop)"
    ]},
    { heading: "Layers", items: [
      "2–3 moisture-wicking long-sleeve tees", "Light thermal leggings or long johns", "2 fleece pullovers or quarter-zips",
      "Lightweight puffer (for Glacier Bay)", "Jeans + 2 pairs casual pants", "Hiking pants", "4–5 t-shirts, 2 long-sleeves", "Buff or scarf"
    ]},
    { heading: "Evenings", items: [
      "2 formal night looks (cocktail dress · dark suit)", "5 smart casual outfits each", "Dressy comfortable shoes",
      "Swimsuits + pool cover-up", "Workout clothes (optional)"
    ]},
    { heading: "Little things", items: [
      "Sunscreen + SPF lip balm", "Insect repellent (rainforest)", "Motion sickness meds", "Power bank + extension cube",
      "Sleep mask (Alaska light is long)", "Magnetic hooks for the cabin walls", "Hand warmers (for Glacier Bay deck day)",
      "Reusable water bottle", "A nice surprise for each other"
    ]}
  ],

  prepChecklist: [
    { heading: "This week — top priority", items: [
      "Track passport status (USPS appt was May 22) — both yours and Chloe's. Expect 4–6 weeks; should arrive late June/early July.",
      "Download Princess MedallionClass app and link the booking · order the Medallion shipped home (free)",
      "Confirm travel insurance through Costco Travel (or buy it standalone)",
      "Decide on Princess Plus vs Premier vs no package (drinks + wifi + tips)"
    ]},
    { heading: "~June 29 — Princess pre-booking opens (40 days out)", items: [
      "Online check-in on Princess Cruise Personalizer", "Sanctuary cabana — book Aug 9 (sea day) & Aug 12 (Glacier Bay)",
      "Crown Grill or Sabatini's — book anniversary dinner", "Optional: Lotus Spa couples massage",
      "Pre-pay gratuities if not in package (~$16/pp/day)", "Pick a Ketchikan (Aug 13) excursion if you want one — lumberjack show, totems, floatplane, or just walk"
    ]},
    { heading: "~July 22 — Two weeks out", items: [
      "Book Aug 7 dinner — Maximilien, The Pink Door, or Sushi Kashiba (Pink Door fills up)",
      "Book Aug 5 dinner — Westward on Lake Union", "Buy America the Beautiful pass ($80) or plan for $30 entry at Hoh",
      "Set up cell carrier international day pass for Victoria, BC", "Confirm rental car insurance — check Visa ⋯2159 coverage so you don't double up with Sixt"
    ]},
    { heading: "~July 24 — Airbnb balance", items: ["$319.87 to Olson Cabin host via Google Pay (already scheduled)"] },
    { heading: "~July 29 — One week out", items: [
      "Notify credit cards of travel (US + Canada)", "Refill prescriptions with extra days' supply",
      "Print all confirmations + Princess luggage tags", "USPS mail hold", "Pet / house sitter if needed",
      "Download offline maps for Seattle + Olympic Peninsula", "Plan Aug 6 grocery stop in Aberdeen or Olympia (Forks dinner supplies)"
    ]},
    { heading: "Gear to acquire (do early if needed)", items: [
      "Binoculars (8×42 or 10×42) — bring two pairs", "Waterproof rain shells with hoods (each)", "Hiking shoes or waterproof boots",
      "Day backpacks", "Power bank + extension cube · magnetic hooks · hand warmers · sleep masks"
    ]},
    { heading: "Aug 4 — Day before flying", items: [
      "24-hr United check-in (5:30 AM Aug 4 in app)", "Pack rain shell, base layers, meds, passports in carry-on",
      "Set thermostat · turn off water main · take out trash"
    ]}
  ],

  days: [
    { id: 1, date: "Wed · Aug 5", title: "Wandering Seattle together", calendarDate: "2026-08-05", shortLabel: "Seattle", twilightTheme: false,
      subtitle: "Land at 10 AM, Uber straight to the Moxy in South Lake Union, then take the city at our own pace.",
      schedule: [
        { time: "10:45 AM", title: "Uber to the Moxy", desc: "Straight from SEA, no light rail transfer — ~25–30 min depending on traffic", locName: "Moxy Seattle Downtown", address: "1016 Republican Street, Seattle WA 98109", point: { lat: 47.6238, lng: -122.3382 } },
        { time: "11:15 AM", title: "Bag drop at Moxy", desc: "Coffee at Caffé Vita or Victrola", locName: "Moxy Seattle Downtown", address: "1016 Republican Street, Seattle WA 98109", point: { lat: 47.6238, lng: -122.3382 } },
        { time: "11:45 AM", title: "Have a Heart — Belltown", desc: "The dispensary stop — stock for the next 3 days · cash + ID. Done first thing so it's not competing with the rest of the day", locName: "Have a Heart — Belltown", address: "115 Blanchard St, Seattle, WA", point: { lat: 47.6141, lng: -122.3439 }, isRestaurant: true, website: "https://haveaheartcc.com/store/belltown/", isDispensary: true, phone: "+12065882436" },
        { time: "12:30 PM", title: "Pike Place Market lunch", desc: "Pike Place Chowder · Beecher's grilled cheese · Lowell's window table", locName: "Pike Place Market", address: "Pike Place Market, Seattle, WA", point: { lat: 47.6097, lng: -122.3422 }, isRestaurant: true, restaurantOptions: [
          { name: "Pike Place Chowder", website: "https://www.pikeplacechowder.com/pike-place-market-menu" },
          { name: "Beecher's Handmade Cheese", website: "http://www.beechershandmadecheese.com/Home.aspx" },
          { name: "Lowell's", website: "https://www.eatatlowells.com/" }
        ]},
        { time: "2:00 PM", title: "Wander Pike Place", desc: "Fish throwers, lower-level shops, gum wall. Skip the original Starbucks line — it's just a Starbucks.", locName: "Pike Place Market", address: "Pike Place Market, Seattle, WA", point: { lat: 47.6097, lng: -122.3422 } },
        { time: "3:30 PM", title: "Waterfront walk", desc: "Down to Pier 62, then a short walk to Old Stove Brewing's Pike Place taproom (it's not actually at Pier 62)", locName: "Pier 62", address: "Pier 62, Seattle, WA", point: { lat: 47.6089, lng: -122.3444 }, isRestaurant: true, website: "https://www.oldstove.com/pikeplace" },
        { time: "5:00 PM", title: "Olympic Sculpture Park", desc: "Free, an easy stroll in evening light", locName: "Olympic Sculpture Park", address: "Olympic Sculpture Park, Seattle, WA", point: { lat: 47.6166, lng: -122.3554 } },
        { time: "6:30 PM", title: "Kerry Park sunset", desc: "Best free skyline view in the city — Uber up", locName: "Kerry Park", address: "Kerry Park, Seattle, WA", point: { lat: 47.6295, lng: -122.3599 } },
        { time: "8:00 PM", title: "Dinner near the Moxy", desc: "Westward · Re:Public — Lake Union Café has closed (now an event venue) and Mbar closed permanently in Nov 2025, so both are dropped from the choices", locName: "Westward", address: "Westward, Seattle, WA", point: { lat: 47.6472, lng: -122.3327 }, isRestaurant: true, restaurantOptions: [
          { name: "Westward", website: "https://westwardseattle.com/" },
          { name: "Re:Public", website: "https://republicseattle.com/" }
        ]}
      ]
    },
    { id: 2, date: "Thu · Aug 6", title: "Driving west to the cabin", calendarDate: "2026-08-06", shortLabel: "To Forks", twilightTheme: true,
      subtitle: "Scenic west-coast route via Olympia and Lake Quinault, then a Twilight-saga detour before sunset at Rialto. Long but beautiful — pack a playlist.",
      schedule: [
        { time: "6:30 AM", title: "Lakeside walk", desc: "Lake Union, two blocks from Moxy + coffee to go", locName: "Lake Union", address: "Lake Union, Seattle, WA", point: { lat: 47.6394, lng: -122.3348 } },
        { time: "7:30 AM", title: "Check out", desc: "Uber to Hyatt Regency", locName: "Hyatt Regency Seattle", address: "808 Howell St, Seattle WA 98101", point: { lat: 47.6127, lng: -122.3336 } },
        { time: "8:00 AM", title: "Pick up the RAV4", desc: "Sixt at Hyatt Regency", locName: "Sixt / Hyatt Regency", address: "808 Howell St, Seattle WA 98101", point: { lat: 47.6127, lng: -122.3336 } },
        { time: "9:30 AM", title: "Olympia stop", desc: "Capitol grounds + Olympia Coffee Roasters downtown · ~45 min", locName: "Washington State Capitol", address: "Washington State Capitol, Olympia, WA", point: { lat: 47.0379, lng: -122.9007 }, website: "https://www.olympiacoffee.com/" },
        { time: "12:30 PM", title: "Lunch in Aberdeen", desc: "Rediviva or Billy's Bar — or push on to Lake Quinault Lodge for lakeside", locName: "Aberdeen, WA", address: "Aberdeen, WA", point: { lat: 46.9754, lng: -123.8157 }, isRestaurant: true, restaurantOptions: [
          { name: "Rediviva", website: "https://redivivarestaurant.com/" },
          { name: "Billy's Bar", website: "https://billysaberdeen.com/DinnerMenu.html" },
          { name: "Lake Quinault Lodge", website: "https://www.olympicnationalparks.com/lake-quinault-lodge" }
        ]},
        { time: "1:30 PM", title: "Lake Quinault Rain Forest Loop", desc: "Drive the loop or do the easy 1.5 hr loop trail · world's largest spruce tree", locName: "Lake Quinault", address: "Lake Quinault, WA", point: { lat: 47.4649, lng: -123.8534 } },
        { time: "5:00 PM", title: "Ruby Beach", desc: "Just south of Forks — driftwood + sea stacks", locName: "Ruby Beach", address: "Ruby Beach, WA", point: { lat: 47.7115, lng: -124.4064 } },
        { time: "6:30 PM", title: "Arrive at Olson Cabin", desc: "Drop bags — real sunset isn't until ~8:35 PM tonight, so there's time for the Twilight run before it", locName: "Olson Cabin #1", address: "2423 Mora Rd, Forks, WA 98331", point: { lat: 47.9336, lng: -124.6280 } },
        { time: "6:45 PM", title: "Treaty Line", desc: "A Twilight-themed sign at Three Rivers Resort — the fan-marked edge of the Quileute Reservation, ~5 min from the cabin", locName: "Three Rivers Resort", address: "7764 La Push Rd, Forks, WA 98331", point: { lat: 47.9134, lng: -124.5351 }, website: "https://forkslodging.net/3-rivers-resort/", phone: "+13603745300" },
        { time: "6:55 PM", title: "Jacob Black's House", desc: "Wolf-themed vacation rental on La Push Rd, painted red — it's a bookable cabin, not a private home. Its old site (jacobblackshouse.com) is dead, so search current availability directly. Quick drive-by photo, respect any guests staying there", locName: "Jacob Black's Rental", address: "8320 La Push Rd, Forks, WA 98331", point: { lat: 47.9110, lng: -124.5460 } },
        { time: "7:15 PM", title: "First Beach, La Push", desc: "Quileute Reservation — where Bella first finds Jacob in the books. Public beach, ~25 min · the Quileute welcome visitors, just keep it respectful", locName: "First Beach", address: "La Push, WA 98350", point: { lat: 47.9063, lng: -124.6372 } },
        { time: "7:45 PM", title: "Drive to Rialto Beach", desc: "Back through the La Push Rd/Mora Rd junction, ~20 min", locName: "Rialto Beach", address: "Rialto Beach, La Push, WA", point: { lat: 47.9169, lng: -124.6432 } },
        { time: "8:05 PM", title: "Rialto Beach", desc: "Golden hour over the sea stacks — actual sunset is ~8:35–8:40 PM this week, not 7:30", locName: "Rialto Beach", address: "Rialto Beach, La Push, WA", point: { lat: 47.9169, lng: -124.6432 } }
      ]
    },
    { id: 3, date: "Fri · Aug 7", title: "Rainforest morning, Twilight-town blitz", calendarDate: "2026-08-07", shortLabel: "To Seattle", twilightTheme: true,
      subtitle: "Leave Forks by 11:35 AM to make the 4 PM car return. The north route + ferry is the most scenic way back — with a quick swing through Forks' Twilight sights first.",
      schedule: [
        { time: "6:45 AM", title: "Load the car & check out", desc: "Airbnb checkout is by 10 AM — pack the RAV4 now so there's no rush later in the morning", locName: "Olson Cabin #1", address: "2423 Mora Rd, Forks, WA 98331", point: { lat: 47.9336, lng: -124.6280 } },
        { time: "7:00 AM", title: "Sunrise walk", desc: "Rialto Beach with coffee in hand", locName: "Rialto Beach", address: "Rialto Beach, La Push, WA", point: { lat: 47.9169, lng: -124.6432 } },
        { time: "9:00 AM", title: "Hoh Rainforest", desc: "Hall of Mosses loop (0.8 mi, ~30 min) · get there early to beat the entrance line · it's a 52-min drive from Forks", locName: "Hoh Rainforest Visitor Center", address: "Hoh Rainforest Visitor Center, Forks, WA", point: { lat: 47.8604, lng: -123.9349 } },
        { time: "10:15 AM", title: "Forks Chamber of Commerce", desc: "Bella's two trucks + the \"Welcome to Forks\" sign + the Twilight gift shop, all in one stop", locName: "Forks Chamber of Commerce", address: "1411 S Forks Ave, Forks, WA 98331", point: { lat: 47.9430, lng: -124.3945 }, website: "https://forkswa.com/", phone: "+13603742531" },
        { time: "10:35 AM", title: "Forks Community Hospital", desc: "The real hospital — Dr. Cullen's fictional workplace. It's a working hospital, so exterior photo only", locName: "Forks Community Hospital", address: "530 Bogachiel Way, Forks, WA 98331", point: { lat: 47.9445, lng: -124.3958 }, website: "https://www.forkshospital.org/", phone: "+13603746271" },
        { time: "10:50 AM", title: "Forks Police Station", desc: "Charlie Swan's precinct", locName: "Forks Police Station", address: "500 E Division St, Forks, WA 98331", point: { lat: 47.9508, lng: -124.3895 } },
        { time: "11:00 AM", title: "Forks High School", desc: "Where the story begins", locName: "Forks High School", address: "261 S Spartan Ave, Forks, WA 98331", point: { lat: 47.9470, lng: -124.3980 } },
        { time: "11:10 AM", title: "Swan House", desc: "Fan-identified as Bella & Charlie's house — a private residence, so a respectful photo from the street only, no lingering in the driveway", locName: "Swan House", address: "775 K St, Forks, WA 98331", point: { lat: 47.9520, lng: -124.3910 } },
        { time: "11:20 AM", title: "Miller Tree Inn — \"Cullen House\"", desc: "The B&B that leans into its Cullen-family fame — fine to photograph from the street", locName: "Miller Tree Inn", address: "654 E Division St, Forks, WA 98331", point: { lat: 47.9500, lng: -124.3776 }, website: "https://www.millertreeinn.com/", phone: "+13603746806" },
        { time: "11:35 AM", title: "Drive north on 101", desc: "Toward Lake Crescent — the car's already packed, no need to double back to the cabin", locName: "Forks, WA", address: "Forks, WA 98331", point: { lat: 47.9506, lng: -124.3931 } },
        { time: "12:15 PM", title: "Lake Crescent stop", desc: "Marymere Falls trail if time, or just a photo pull-off", locName: "Lake Crescent", address: "Lake Crescent, WA", point: { lat: 48.0567, lng: -123.7739 } },
        { time: "1:15 PM", title: "Lunch in Port Angeles", desc: "Next Door Gastropub or grab-and-go", locName: "Port Angeles, WA", address: "Port Angeles, WA", point: { lat: 48.1181, lng: -123.4307 }, isRestaurant: true, restaurantOptions: [{ name: "Next Door Gastropub", website: "https://nextdoorgastropub.com/" }] },
        { time: "3:30 PM", title: "Bainbridge → Seattle ferry", desc: "35 min · top deck for the skyline approach", locName: "Bainbridge Island Ferry Terminal", address: "Bainbridge Island Ferry Terminal, WA", point: { lat: 47.6238, lng: -122.5108 } },
        { time: "4:15 PM", title: "Return the car", desc: "Sixt at Hyatt Regency · check in", locName: "Hyatt Regency Seattle", address: "808 Howell St, Seattle WA 98101", point: { lat: 47.6127, lng: -122.3336 } },
        { time: "5:30 PM", title: "Pier 62", desc: "Beer at Old Stove if there's time (short walk to their Pike Place taproom)", locName: "Pier 62", address: "Pier 62, Seattle, WA", point: { lat: 47.6089, lng: -122.3444 }, isRestaurant: true, website: "https://www.oldstove.com/pikeplace" },
        { time: "7:30 PM", title: "Romantic dinner", desc: "Maximilien (French, views) · The Pink Door · Sushi Kashiba · Place Pigalle · Il Bistro — book ahead", locName: "Maximilien", address: "Maximilien, Seattle, WA", point: { lat: 47.6086, lng: -122.3428 }, isRestaurant: true, restaurantOptions: [
          { name: "Maximilien", website: "https://www.maximilienrestaurant.com/" },
          { name: "The Pink Door", website: "https://www.thepinkdoor.net/" },
          { name: "Sushi Kashiba", website: "https://sushikashiba.com/" },
          { name: "Place Pigalle", website: "https://www.placepigalle-seattle.com/" },
          { name: "Il Bistro", website: "https://www.ilbistro.net/" }
        ]}
      ]
    },
    { id: 4, date: "Sat · Aug 8", title: "Boarding the Royal Princess", calendarDate: "2026-08-08", shortLabel: "Embark", twilightTheme: false,
      subtitle: "Pier 91 check-in opens at 11 AM, all-aboard around 1:30, sail away at 3:00 PM. One last morning together in the city.",
      schedule: [
        { time: "7:30 AM", title: "Breakfast", desc: "Le Pichet (French, near Pike Place) or in the hotel", locName: "Le Pichet", address: "Le Pichet, Seattle, WA", point: { lat: 47.6098, lng: -122.3414 }, isRestaurant: true, website: "https://www.lepichetseattle.com/" },
        { time: "9:00 AM", title: "Pike Place Market", desc: "Walk it while it's still quiet", locName: "Pike Place Market", address: "Pike Place Market, Seattle, WA", point: { lat: 47.6097, lng: -122.3422 } },
        { time: "10:30 AM", title: "Pack up, check out", desc: "Finish or toss anything from the dispensary — nothing leaves with you for Pier 91", locName: "Hyatt Regency Seattle", address: "808 Howell St, Seattle WA 98101", point: { lat: 47.6127, lng: -122.3336 } },
        { time: "11:30 AM", title: "Uber to Pier 91", desc: "Smith Cove — about 10 min, $20", locName: "Pier 91 (Smith Cove)", address: "Pier 91, Seattle, WA", point: { lat: 47.6285, lng: -122.3775 } },
        { time: "12:00 PM", title: "Check in, board", desc: "Drop carry-ons in cabin", locName: "Pier 91 (Smith Cove)", address: "Pier 91, Seattle, WA", point: { lat: 47.6285, lng: -122.3775 } },
        { time: "Right away", title: "Sprint to the Sanctuary desk", desc: "Deck 17 forward — book a cabana for Aug 9 & Aug 12. Sells out within the first hour.", locName: "Royal Princess", address: "Pier 91, Seattle, WA", point: { lat: 47.6285, lng: -122.3775 } },
        { time: "Then", title: "Reserve a specialty dinner", desc: "Crown Grill or Sabatini's — for an anniversary night", locName: "Royal Princess", address: "Pier 91, Seattle, WA", point: { lat: 47.6285, lng: -122.3775 } },
        { time: "3:00 PM", title: "Sail away", desc: "From the upper deck. Bring layers.", locName: "Elliott Bay", address: "Elliott Bay, Seattle, WA", point: { lat: 47.6062, lng: -122.3625 } }
      ]
    },
    { id: 5, date: "Sun · Aug 9", title: "At Sea", calendarDate: "2026-08-09", shortLabel: "At Sea", twilightTheme: false,
      subtitle: "A day to wander the ship together. Sanctuary cabana day one.",
      schedule: [
        { time: "All day", title: "Explore Royal Princess", desc: "Sanctuary, Lotus Spa, SeaWalk, pools, Movies Under the Stars", locName: "Inside Passage", address: "Inside Passage, Alaska", point: { lat: 55.5, lng: -133.5 } }
      ]
    },
    { id: 6, date: "Mon · Aug 10", title: "Juneau, Alaska", calendarDate: "2026-08-10", shortLabel: "Juneau", twilightTheme: false,
      subtitle: "Whales, glacier & a taste of Alaska. In port 1:00 PM – 9:15 PM.",
      schedule: [
        { time: "1:00 PM", title: "Dock in Juneau", desc: "", locName: "Juneau, Alaska", address: "Juneau, AK", point: { lat: 58.3019, lng: -134.4197 } },
        { time: "1:30 PM", title: "Best of Juneau excursion", desc: "Whales, Glacier & a Taste of Alaska — confirmed $299.95 × 2", locName: "Juneau, Alaska", address: "Juneau, AK", point: { lat: 58.3019, lng: -134.4197 } },
        { time: "8:15 PM", title: "Excursion returns", desc: "", locName: "Juneau, Alaska", address: "Juneau, AK", point: { lat: 58.3019, lng: -134.4197 } },
        { time: "9:15 PM", title: "Ship departs Juneau", desc: "Note: no realistic window to also visit town — the excursion fills the whole port stop.", locName: "Juneau, Alaska", address: "Juneau, AK", point: { lat: 58.3019, lng: -134.4197 } }
      ]
    },
    { id: 7, date: "Tue · Aug 11", title: "Skagway, Alaska", calendarDate: "2026-08-11", shortLabel: "Skagway", twilightTheme: false,
      subtitle: "White Pass rail & the Red Onion. In port 6:00 AM – 8:15 PM.",
      schedule: [
        { time: "6:00 AM", title: "Dock in Skagway", desc: "", locName: "Skagway, Alaska", address: "Skagway, AK", point: { lat: 59.4583, lng: -135.3139 } },
        { time: "9:30 AM", title: "Remedy Shoppe / BoomTown Buds", desc: "The dispensary stop, done right at opening (Remedy Shoppe opens 9:30, BoomTown 10) so it's out of the way before the 2 PM excursion — 5–10 min walk from dock", locName: "Remedy Shoppe", address: "371 3rd Ave, Skagway, AK", point: { lat: 59.4592, lng: -135.3140 }, isRestaurant: true, restaurantOptions: [
          { name: "Remedy Shoppe", website: "https://remedyshoppe907.com/" },
          { name: "BoomTown Buds", website: "https://www.boomtownbuds.com/" }
        ], isDispensary: true, phone: "+19079833345" },
        { time: "2:00 PM", title: "Sip & Summit excursion", desc: "White Pass Scenic Rail & Red Onion — confirmed $239.95 × 2", locName: "White Pass Summit", address: "White Pass, Skagway, AK", point: { lat: 59.6486, lng: -135.1706 } },
        { time: "7:00 PM", title: "Excursion returns", desc: "", locName: "Skagway, Alaska", address: "Skagway, AK", point: { lat: 59.4583, lng: -135.3139 } },
        { time: "8:15 PM", title: "Ship departs Skagway", desc: "", locName: "Skagway, Alaska", address: "Skagway, AK", point: { lat: 59.4583, lng: -135.3139 } }
      ]
    },
    { id: 8, date: "Wed · Aug 12", title: "Glacier Bay National Park", calendarDate: "2026-08-12", shortLabel: "Glacier Bay", twilightTheme: false,
      subtitle: "Scenic cruising, 6:00 AM – 2:30 PM. Your coldest day — bring the puffer & hand warmers. Sanctuary cabana day two.",
      schedule: [
        { time: "6:00 AM", title: "Rangers board", desc: "They narrate from the bridge cam — be on Deck 17 forward early", locName: "Glacier Bay National Park", address: "Glacier Bay National Park, AK", point: { lat: 58.6658, lng: -136.9002 } },
        { time: "All morning", title: "Scenic cruising", desc: "Glaciers, wildlife, ranger narration — coldest day of the trip", locName: "Glacier Bay National Park", address: "Glacier Bay National Park, AK", point: { lat: 58.6658, lng: -136.9002 } },
        { time: "2:30 PM", title: "Depart Glacier Bay", desc: "", locName: "Glacier Bay National Park", address: "Glacier Bay National Park, AK", point: { lat: 58.6658, lng: -136.9002 } }
      ]
    },
    { id: 9, date: "Thu · Aug 13", title: "Ketchikan, Alaska", calendarDate: "2026-08-13", shortLabel: "Ketchikan", twilightTheme: false,
      subtitle: "A free day wandering the town — no paid excursions, just Creek Street and the waterfront. Six hours in the rainiest port — pack the shell. In port 7:00 AM – 1:15 PM.",
      schedule: [
        { time: "7:00 AM", title: "Dock in Ketchikan", desc: "", locName: "Ketchikan, Alaska", address: "Ketchikan, AK", point: { lat: 55.3422, lng: -131.6461 } },
        { time: "9:00 AM", title: "The Stoney Moose", desc: "The dispensary stop, right at opening (9 AM) and 2-min walk from dock · pair with Creek Street & salmon falls", locName: "The Stoney Moose", address: "127 Stedman St, Ketchikan, AK", point: { lat: 55.3414, lng: -131.6461 }, isRestaurant: true, website: "https://thestoneymoose.com/", isDispensary: true, phone: "+19072209099" },
        { time: "9:30 AM", title: "Creek Street", desc: "Historic boardwalk on pilings above Ketchikan Creek — free to wander, galleries and quirky shops", locName: "Creek Street", address: "Creek Street, Ketchikan, AK", point: { lat: 55.3428, lng: -131.6456 } },
        { time: "10:00 AM", title: "Salmon ladder", desc: "Watch salmon spawning right at the base of Creek Street — free, best mid-August", locName: "Ketchikan Creek Salmon Ladder", address: "Ketchikan Creek, Ketchikan, AK", point: { lat: 55.3432, lng: -131.6459 } },
        { time: "10:30 AM", title: "Married Man's Trail", desc: "Free waterfront walking trail along the creek — the old back route from Creek Street's red-light-district days", locName: "Married Man's Trail", address: "Married Man's Trail, Ketchikan, AK", point: { lat: 55.3448, lng: -131.6469 } },
        { time: "11:15 AM", title: "Thomas Basin", desc: "Free wander past the small-boat harbor — fishing boats and floatplanes coming and going", locName: "Thomas Basin", address: "Thomas Basin, Ketchikan, AK", point: { lat: 55.3408, lng: -131.6448 } },
        { time: "12:00 PM", title: "Alaska Fish House", desc: "Right on Thomas Basin — locally caught salmon, halibut, and smoked salmon chowder, order-at-the-counter casual. Fits perfectly with the walk you're already on", locName: "Alaska Fish House", address: "3 Salmon Landing, Ketchikan, AK 99901", point: { lat: 55.3408, lng: -131.6448 }, isRestaurant: true, website: "https://alaskafishhouse.com/", phone: "+19072474055" },
        { time: "1:15 PM", title: "Ship departs Ketchikan", desc: "", locName: "Ketchikan, Alaska", address: "Ketchikan, AK", point: { lat: 55.3422, lng: -131.6461 } }
      ]
    },
    { id: 10, date: "Fri · Aug 14", title: "Victoria, Canada", calendarDate: "2026-08-14", shortLabel: "Victoria", twilightTheme: false,
      subtitle: "A late night in port, 9:00 PM – 11:59 PM. Just under 3 hours, in the dark.",
      schedule: [
        { time: "9:00 PM", title: "Disembark", desc: "Catch the cruise shuttle bus to Inner Harbour (~CAD $10–15 round trip) — not the Pacific Coach ferry, it stops at 9 PM", locName: "Ogden Point", address: "Ogden Point, Victoria, BC", point: { lat: 48.4133, lng: -123.3891 } },
        { time: "9:20 PM", title: "Inner Harbour walk", desc: "Parliament Building lit with 3,300+ lights, Fairmont Empress glow, harbour views · ~30 min loop", locName: "Inner Harbour", address: "Inner Harbour, Victoria, BC", point: { lat: 48.4237, lng: -123.3705 } },
        { time: "10:00 PM", title: "Bard & Banker pub", desc: "Government St — Canadian beer or Scottish whisky, often live music. Alternatives: Irish Times Pub, Garrick's Head Pub", locName: "Bard & Banker", address: "1022 Government St, Victoria, BC", point: { lat: 48.4271, lng: -123.3654 }, isRestaurant: true, restaurantOptions: [
          { name: "Bard & Banker", website: "https://www.bardandbanker.com/" },
          { name: "Irish Times Pub", website: "https://www.irishtimespub.ca/" },
          { name: "Garrick's Head Pub", website: "https://garrickshead.com/" }
        ]},
        { time: "11:15 PM", title: "Shuttle back to ship", desc: "Onboard by 11:30, no stress", locName: "Ogden Point", address: "Ogden Point, Victoria, BC", point: { lat: 48.4133, lng: -123.3891 } }
      ]
    },
    { id: 11, date: "Sat · Aug 15", title: "Home to Iowa", calendarDate: "2026-08-15", shortLabel: "Home", twilightTheme: false,
      subtitle: "Arrive Seattle 7:00 AM, disembark, fly home. First flight home as husband and wife.",
      schedule: [
        { time: "7:00 AM", title: "Arrive Seattle", desc: "Disembarkation", locName: "Pier 91 (Smith Cove)", address: "Pier 91, Seattle, WA", point: { lat: 47.6285, lng: -122.3775 } },
        { time: "2:26 PM", title: "Depart SEA", desc: "United to Denver", locName: "Seattle-Tacoma International Airport", address: "Seattle-Tacoma International Airport, WA", point: { lat: 47.4502, lng: -122.3088 } },
        { time: "6:17 PM", title: "Arrive Denver", desc: "2h 18m layover", locName: "Denver International Airport", address: "Denver International Airport, CO", point: { lat: 39.8561, lng: -104.6737 } },
        { time: "8:35 PM", title: "Depart Denver", desc: "United to Cedar Rapids", locName: "Denver International Airport", address: "Denver International Airport, CO", point: { lat: 39.8561, lng: -104.6737 } },
        { time: "11:36 PM", title: "Arrive Cedar Rapids", desc: "Home. ❤", locName: "The Eastern Iowa Airport", address: "The Eastern Iowa Airport, Cedar Rapids, IA", point: { lat: 41.8847, lng: -91.7108 } }
      ]
    }
  ]
};

const DAY_PHOTOS = {
  1: "images/day1_seattle.jpg", 2: "images/day2_lapush.jpg", 3: "images/day3_rialto.jpg",
  4: "images/day4_cruiseship.jpg", 5: "images/day5_insidepassage.jpg", 6: "images/day6_juneauwhale.jpg",
  7: "images/day7_whitepass.jpg", 8: "images/day8_glacierbay.jpg", 9: "images/day9_ketchikan.jpg",
  10: "images/day10_victoria.jpg", 11: "images/day11_airplane.jpg"
};

// Per-day accent colors extracted from the photos (generate_palettes.py), hand-tuned
// where the algorithm got over-excited. Every episode gets its own color grade.
const DAY_ACCENTS = {
  1: "#7288DF", 2: "#F25F5F", 3: "#ABD0DC", 4: "#81B4ED", 5: "#7F9BD2",
  6: "#5FBCF2", 7: "#7FD8D8", 8: "#84A7CD", 9: "#ABABE3", 10: "#8CB7E1", 11: "#769DDA"
};

// Live-weather points (open-meteo, keyless) and per-day mapping. Day 5 is at
// sea with no fixed coordinate, so it maps to null (no chip that day).
const WEATHER_POINTS = {
  seattle:   { lat: 47.61, lng: -122.33, label: "Seattle" },
  forks:     { lat: 47.95, lng: -124.39, label: "Forks" },
  juneau:    { lat: 58.30, lng: -134.42, label: "Juneau" },
  skagway:   { lat: 59.46, lng: -135.31, label: "Skagway" },
  glacier:   { lat: 58.67, lng: -136.90, label: "Glacier Bay" },
  ketchikan: { lat: 55.34, lng: -131.65, label: "Ketchikan" },
  victoria:  { lat: 48.43, lng: -123.37, label: "Victoria" }
};
const DAY_WEATHER = { 1:"seattle", 2:"forks", 3:"forks", 4:"seattle", 5:null, 6:"juneau", 7:"skagway", 8:"glacier", 9:"ketchikan", 10:"victoria", 11:"seattle" };

// Confessional prompts — 2 per trip day. For day N: prompts (N-1)*2 and (N-1)*2+1.
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

// Couple achievement badges — awarded by hand from the Us tab.
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

// Episode titles — the reality-show layer ("Documentary Crew" mode)
const EPISODE_TITLES = {
  1: "The Islanders Arrive",
  2: "Twilight Territory",
  3: "A Mossy Situation",
  4: "The Villa Sets Sail",
  5: "No One Gets Voted Off",
  6: "Whales, Actually",
  7: "Full Steam Ahead",
  8: "Cold Hands, Warm Hearts",
  9: "Salmon Says",
  10: "The Canadian Episode",
  11: "The Season Finale"
};
