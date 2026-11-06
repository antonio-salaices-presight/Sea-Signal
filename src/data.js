// All data in this file is fictional demo data. Vessels, positions and times are invented.

export const PRIORITY = { high: "High", medium: "Medium", low: "Low" };
export const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

// Map geometry uses a 1000 x 620 schematic of a strait. It is not to scale.
export const OUTBOUND = [[80, 252], [200, 248], [330, 246], [480, 252], [640, 268], [780, 285], [910, 298]];
export const INBOUND = [[120, 312], [250, 308], [560, 318], [700, 338], [830, 352], [950, 362]];

export const VESSELS = [
  ...OUTBOUND.map((p, i) => ({ id: "AIS-" + String(401 + i).padStart(4, "0"), pos: p, lane: "Outbound lane", last: "14:52", status: "Active", caseId: null })),
  ...INBOUND.map((p, i) => ({ id: "AIS-" + String(421 + i).padStart(4, "0"), pos: p, lane: "Inbound lane", last: "14:52", status: "Active", caseId: null })),
  { id: "AIS-0412", pos: [430, 306], lane: "Inbound lane", last: "14:05", status: "Gap", caseId: "C-0142" },
  { id: "AIS-0455", pos: [320, 425], lane: "Open water", last: "14:50", status: "Stopped", caseId: "C-0143" },
  { id: "AIS-0456", pos: [345, 438], lane: "Open water", last: "14:49", status: "Stopped", caseId: "C-0143" },
  { id: "AIS-0463", pos: [600, 378], lane: "Open water", last: "14:41", status: "Active", caseId: "C-0144" },
  { id: "AIS-0471", pos: [905, 300], lane: "Outbound lane", last: "14:31", status: "Gap", caseId: "C-0145" },
];

export const CASES0 = [
  {
    id: "C-0142",
    title: "Inbound vessel stopped transmitting",
    priority: "high",
    detector: "AIS gap + unmatched radar detection",
    confidence: 78,
    duration: 47,
    facts: [
      ["Last AIS signal", "14:05, inbound lane"],
      ["Radar detection", "14:52, near the last position"],
      ["Silent for", "47 minutes"],
      ["Matching AIS message", "None"],
    ],
    innocent: ["Coverage gap in this part of the strait", "Equipment fault", "GNSS interference"],
    evidence: ["AIS track and last message (AIS-0412)", "Radar image, 14:52", "Vessel history", "Map with lanes and zones", "Detector rule and version"],
    actions: [
      { id: "a1", title: "Request a new radar pass over the last position", why: "47 minutes without AIS and one unmatched detection." },
      { id: "a2", title: "Check the vessel's registry data and recent port calls", why: "Confirms identity and shows earlier AIS gaps." },
      { id: "a3", title: "Ask the nearest patrol to verify visually", why: "The only way to confirm the vessel's identity on site." },
    ],
    geom: { kind: "gap", last: [430, 306], det: [505, 324], track: "M150 311 C 250 305 340 304 430 306", marker: [468, 284] },
  },
  {
    id: "C-0143",
    title: "Two vessels stopped together outside an anchorage",
    priority: "medium",
    detector: "Possible ship-to-ship transfer",
    confidence: 66,
    duration: 95,
    facts: [
      ["Stopped together since", "13:20"],
      ["Distance between vessels", "Under 200 m"],
      ["Location", "Open water, outside any anchorage"],
      ["Before stopping", "One vessel had an AIS gap"],
    ],
    innocent: ["Waiting for a pilot or a berth", "Mechanical assistance", "Authorized bunkering or supply"],
    evidence: ["AIS tracks for both vessels (AIS-0455, AIS-0456)", "Radar image showing both vessels", "Anchorage and zone layer", "Detector rule and version"],
    actions: [
      { id: "a1", title: "Request an optical image of the location in daylight", why: "Shows whether the vessels are alongside each other." },
      { id: "a2", title: "Compare with the vessels' declared destinations", why: "A stop away from both routes is harder to explain." },
      { id: "a3", title: "Ask the port authority about transfer permits", why: "Rules out an authorized operation." },
    ],
    geom: { kind: "pair", a: [320, 425], b: [345, 438], marker: [332, 380] },
  },
  {
    id: "C-0144",
    title: "Reported and radar positions differ",
    priority: "medium",
    detector: "Position mismatch",
    confidence: 59,
    duration: null,
    facts: [
      ["Reported AIS position", "14:40"],
      ["Radar position", "14:41"],
      ["Difference", "About 6 km"],
      ["Nearby vessels", "Two others also look offset"],
    ],
    innocent: ["GNSS interference in the area", "Timing offset between AIS and the image", "A different vessel next to the reported one"],
    evidence: ["AIS message at 14:40 (AIS-0463)", "Radar image, 14:41", "Positions of nearby vessels", "Detector rule and version"],
    actions: [
      { id: "a1", title: "Compare with the reported positions of nearby vessels", why: "Several offsets in one area point to interference." },
      { id: "a2", title: "Re-check with the next radar pass", why: "Separates a timing offset from a real mismatch." },
      { id: "a3", title: "Mark the area as possible GNSS interference", why: "Helps analysts discount similar cases here." },
    ],
    geom: { kind: "mismatch", rep: [600, 378], det: [648, 352], marker: [622, 322] },
  },
  {
    id: "C-0145",
    title: "AIS lost at the edge of coastal coverage",
    priority: "low",
    detector: "AIS gap",
    confidence: 41,
    duration: 22,
    facts: [
      ["Last AIS signal", "14:31, outbound lane"],
      ["Location", "Edge of coastal AIS coverage"],
      ["Silent for", "22 minutes"],
      ["Radar detection", "None yet"],
    ],
    innocent: ["The vessel left coastal coverage (most likely)", "Delay in satellite AIS"],
    evidence: ["AIS track (AIS-0471)", "Coverage layer", "Detector rule and version"],
    actions: [
      { id: "a1", title: "Wait for the next satellite AIS update", why: "A short gap here is usually coverage." },
      { id: "a2", title: "Close the case if the vessel reappears", why: "Keeps the queue to cases that need a person." },
    ],
    geom: { kind: "edge", last: [905, 300], marker: [925, 268] },
  },
].map((c) => ({ ...c, status: "new", actionState: Object.fromEntries(c.actions.map((a) => [a.id, "proposed"])) }));

export const SOURCES = [
  { name: "AIS, coastal", gives: "Identity, position, speed", limit: "Can be off or false", route: "Licensed feed (demo)", age: "Updated 14:52", note: "Coverage fades toward the east edge of the demo area." },
  { name: "AIS, satellite", gives: "Offshore coverage", limit: "Delay and gaps", route: "Licensed feed (demo)", age: "Updated 14:30", note: "Positions can be tens of minutes old." },
  { name: "Radar (SAR)", gives: "Vessels day and night, through cloud", limit: "No identity, revisit gaps", route: "Public Sentinel-1 (demo)", age: "Last pass 14:52", note: "Next expected pass: 19:20." },
  { name: "Optical", gives: "Vessel type and detail", limit: "Daylight and clear sky only", route: "Public Sentinel-2 (demo)", age: "Last image 11:05", note: "Not usable after dark." },
  { name: "Map layers", gives: "Lanes, ports, anchorages, restricted areas", limit: "Must be kept current", route: "Public or from the authority", age: "Loaded", note: "Replace with the authority's own zones." },
  { name: "Registries", gives: "Flag, owner, history", limit: "Quality varies", route: "Licensed (demo)", age: "Loaded", note: "Used for identity checks." },
];

export const nowTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
