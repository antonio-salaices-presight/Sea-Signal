import React, { useEffect, useMemo, useRef, useState } from "react";
import Operations from "./views/Operations.jsx";
import Briefing from "./views/Briefing.jsx";
import Vessels from "./views/Vessels.jsx";
import Sources from "./views/Sources.jsx";
import Settings from "./views/Settings.jsx";
import { CASES0, PRIORITY, PRIORITY_RANK, nowTime } from "./data.js";

const NAV = [
  ["operations", "Operations"],
  ["briefing", "Briefing"],
  ["vessels", "Vessels"],
  ["sources", "Sources"],
  ["preferences", "Settings"],
];
const TITLES = {
  operations: "Strait of Hormuz · Operations",
  briefing: "Shift briefing",
  vessels: "Vessels",
  sources: "Sources",
  preferences: "Settings",
};
const DEFAULT_CFG = { minConfidence: 40, minDuration: 15 };
const FIRST_LOG = [{ t: "08:00", what: "Shift briefing generated", who: "System" }];

export default function App() {
  const fromHash = () => {
    const h = window.location.hash.slice(1);
    return NAV.some((n) => n[0] === h) ? h : "operations";
  };
  const [view, setView] = useState(fromHash);
  const [cases, setCases] = useState(CASES0);
  const [selectedId, setSelectedId] = useState("C-0142");
  const [cfg, setCfg] = useState(DEFAULT_CFG);
  const [layers, setLayers] = useState({ ais: true, radar: true, lanes: true, zones: true });
  const [audit, setAudit] = useState(FIRST_LOG);
  const [toast, setToast] = useState(null);
  const timer = useRef();
  const main = useRef();

  useEffect(() => {
    const f = () => setView(fromHash());
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  useEffect(() => {
    if (main.current) main.current.scrollTo(0, 0);
  }, [view]);

  const go = (v) => {
    window.location.hash = v;
    setView(v);
  };
  const say = (m) => {
    setToast(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2400);
  };
  const log = (what) => setAudit((a) => [{ t: nowTime(), what, who: "You (demo)" }, ...a]);

  const visible = useMemo(
    () =>
      cases
        .filter((c) => c.confidence >= cfg.minConfidence && (c.duration == null || c.duration >= cfg.minDuration))
        .sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || b.confidence - a.confidence),
    [cases, cfg]
  );
  const hidden = cases.length - visible.length;

  const patch = (id, p) => setCases((cs) => cs.map((c) => (c.id === id ? { ...c, ...p } : c)));
  const setStatus = (c, status) => {
    patch(c.id, { status });
    const label = { reviewing: "Started review", escalated: "Escalated", closed: "Closed as explained" }[status];
    log(label + ": " + c.id + " " + c.title);
    say(label);
  };
  const setAction = (c, a, state) => {
    patch(c.id, { actionState: { ...c.actionState, [a.id]: state } });
    const label = { approved: "Approved", dismissed: "Dismissed", proposed: "Reopened" }[state];
    log(label + " suggested action: " + a.title + " (" + c.id + ")");
    say(state === "approved" ? "Approved. In this demo nothing is sent." : label);
  };
  const exportCase = (c) => {
    const txt =
      "SeaSignal case report (demo data)\n" + c.id + " · " + c.title + "\nPriority: " + PRIORITY[c.priority] +
      " · Detector: " + c.detector + " · Confidence " + c.confidence + "%\n\n" +
      c.facts.map(([k, v]) => k + ": " + v).join("\n") +
      "\n\nCould be innocent:\n" + c.innocent.map((t) => "- " + t).join("\n") +
      "\n\nSuggested actions:\n" + c.actions.map((a, i) => (i + 1) + ". " + a.title + " (why: " + a.why + ")").join("\n");
    log("Exported report: " + c.id);
    try {
      navigator.clipboard.writeText(txt).then(() => say("Report copied to clipboard"), () => say("Report ready. Copy was blocked by this browser."));
    } catch (e) {
      say("Report ready. Copy was blocked by this browser.");
    }
  };
  const open = (id) => {
    setSelectedId(id);
    go("operations");
  };
  const reset = () => {
    setCases(CASES0);
    setCfg(DEFAULT_CFG);
    setAudit(FIRST_LOG);
    setSelectedId("C-0142");
    say("Demo data reset");
  };

  const highCount = visible.filter((c) => c.priority === "high" && c.status !== "closed").length;

  return (
    <div className="app">
      <nav className="side" aria-label="Main">
        <div className="logo"><i />SeaSignal</div>
        {NAV.map(([k, n]) => (
          <button key={k} className={"nav" + (view === k ? " on" : "")} aria-current={view === k ? "page" : undefined} onClick={() => go(k)}>
            {n}
            {k === "operations" && highCount > 0 && <span className="badge">{highCount}</span>}
          </button>
        ))}
        <div className="sidefoot"><span>Workspace: Hormuz demo</span><span>All data is fictional.</span></div>
      </nav>
      <main className="main" ref={main}>
        <div className="top">
          <h1>{TITLES[view]}</h1>
          <span className="pill">Replay · today 14:52</span>
          <span className="pill demo">ILLUSTRATIVE · FICTIONAL DATA</span>
        </div>
        {view === "operations" && (
          <Operations cases={visible} hidden={hidden} selectedId={selectedId} onSelect={setSelectedId} layers={layers} setLayers={setLayers} onStatus={setStatus} onAction={setAction} onExport={exportCase} />
        )}
        {view === "briefing" && <Briefing cases={visible} onOpen={open} />}
        {view === "vessels" && <Vessels onOpen={open} />}
        {view === "sources" && <Sources />}
        {view === "preferences" && <Settings cfg={cfg} setCfg={setCfg} audit={audit} onReset={reset} />}
      </main>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
