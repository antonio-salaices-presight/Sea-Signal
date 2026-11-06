import React from "react";
import { PriorityTag } from "../components/CaseDetail.jsx";

export default function Briefing({ cases, onOpen }) {
  const live = cases.filter((c) => c.status !== "closed");
  const groups = [
    ["high", "Needs action", live.filter((c) => c.priority === "high")],
    ["medium", "Watching", live.filter((c) => c.priority === "medium")],
    ["low", "Likely explained", live.filter((c) => c.priority === "low")],
  ];
  const pending = live.reduce((n, c) => n + Object.values(c.actionState).filter((s) => s === "proposed").length, 0);
  const lead = live.length
    ? live.length + " open case" + (live.length > 1 ? "s" : "") + ", " + groups[0][2].length + " high priority. " +
      (groups[0][2][0] ? groups[0][2][0].title + ". " : "") +
      pending + " suggested action" + (pending === 1 ? " is" : "s are") + " waiting for approval."
    : "No open cases. The queue is clear.";
  return (
    <>
      <div className="card lead">
        <p className="h">Example, fictional · Shift briefing, 08:00</p>
        <p className="leadtext">{lead}</p>
      </div>
      <div className="three">
        {groups.map(([p, label, list]) => (
          <div key={p} className="card">
            <p className="h">{label}</p>
            {list.length ? (
              list.map((c) => (
                <button key={c.id} className="brief-item" onClick={() => onOpen(c.id)}>
                  <PriorityTag priority={c.priority} />
                  <span className="qtitle">{c.title}</span>
                  <span className="meta">{c.actions[0].title}</span>
                </button>
              ))
            ) : (
              <p className="note">Nothing here.</p>
            )}
          </div>
        ))}
      </div>
      <div className="card">
        <p className="h">Context</p>
        <ul className="plainlist">
          <li>Last radar pass 14:52. Next expected 19:20.</li>
          <li>Optical imagery is not usable after dark.</li>
          <li>Coastal AIS coverage fades toward the east edge of the demo area.</li>
        </ul>
      </div>
    </>
  );
}
