import React from "react";
import { PRIORITY } from "../data.js";

const STATUS = { new: "New", reviewing: "In review", escalated: "Escalated", closed: "Closed" };
const ACTION_LABEL = { proposed: "Needs approval", approved: "Approved", dismissed: "Dismissed" };

export function PriorityTag({ priority }) {
  return <span className={"tag " + priority}>{PRIORITY[priority]}</span>;
}

export function CaseStatus({ status }) {
  return <span className="status">{STATUS[status]}</span>;
}

export default function CaseDetail({ c, onStatus, onAction, onExport }) {
  return (
    <div className="card detail">
      <div className="line wrap">
        <div className="titleblock">
          <div className="row-gap">
            <PriorityTag priority={c.priority} />
            <span className="tag plain">{c.id}</span>
            <CaseStatus status={c.status} />
          </div>
          <h2>{c.title}</h2>
          <p className="meta">Detector: {c.detector} · confidence {c.confidence}%</p>
        </div>
        <div className="actions">
          <button className="btn p" disabled={c.status === "reviewing" || c.status === "closed"} onClick={() => onStatus(c, "reviewing")}>Start review</button>
          <button className="btn" disabled={c.status === "escalated" || c.status === "closed"} onClick={() => onStatus(c, "escalated")}>Escalate</button>
          <button className="btn" disabled={c.status === "closed"} onClick={() => onStatus(c, "closed")}>Close as explained</button>
          <button className="btn" onClick={() => onExport(c)}>Export report</button>
        </div>
      </div>

      <div className="detail-grid">
        <section>
          <h3 className="h">What the data shows</h3>
          <dl className="facts">
            {c.facts.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <h3 className="h warn">Could be innocent</h3>
          <ul className="plainlist">
            {c.innocent.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </section>

        <section>
          <h3 className="h">Evidence attached</h3>
          <ul className="plainlist">
            {c.evidence.map((t) => <li key={t}>{t}</li>)}
          </ul>
          <p className="note">Illustrative case. Fictional vessels and times.</p>
        </section>
      </div>

      <section>
        <div className="line">
          <h3 className="h">Suggested actions, ranked</h3>
          <span className="note">Nothing is sent or tasked automatically.</span>
        </div>
        <div className="actionlist">
          {c.actions.map((a, i) => {
            const st = c.actionState[a.id];
            return (
              <div key={a.id} className={"action " + st}>
                <span className="num">{i + 1}</span>
                <div className="grow">
                  <p className="atitle">{a.title}</p>
                  <p className="meta">Why: {a.why}</p>
                </div>
                <div className="actionctl">
                  <span className={"pillstate " + st}>{ACTION_LABEL[st]}</span>
                  {st === "proposed" && (
                    <>
                      <button className="btn p small" onClick={() => onAction(c, a, "approved")}>Approve</button>
                      <button className="btn small" onClick={() => onAction(c, a, "dismissed")}>Dismiss</button>
                    </>
                  )}
                  {st !== "proposed" && (
                    <button className="btn small" onClick={() => onAction(c, a, "proposed")}>Undo</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
