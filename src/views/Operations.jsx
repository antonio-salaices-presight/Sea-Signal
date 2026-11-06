import React from "react";
import MapView from "../components/MapView.jsx";
import { VESSELS } from "../data.js";
import CaseDetail, { PriorityTag, CaseStatus } from "../components/CaseDetail.jsx";

const LAYERS = [
  ["ais", "AIS vessels"],
  ["radar", "Radar detections"],
  ["lanes", "Traffic lanes"],
  ["zones", "Zones"],
];

export default function Operations({ cases, hidden, selectedId, onSelect, layers, setLayers, onStatus, onAction, onExport }) {
  const selected = cases.find((c) => c.id === selectedId) || cases[0];
  const open = cases.filter((c) => c.status !== "closed");
  const high = open.filter((c) => c.priority === "high").length;

  return (
    <>
      <div className="kpis">
        <div className="card k"><small>Open cases</small><b>{open.length}</b><span>{high} high priority{hidden > 0 ? " · " + hidden + " hidden by thresholds" : ""}</span></div>
        <div className="card k"><small>Vessels tracked</small><b>{VESSELS.length}</b><span>In the demo area</span></div>
        <div className="card k"><small>Pending approvals</small><b>{cases.reduce((n, c) => n + Object.values(c.actionState).filter((s) => s === "proposed").length, 0)}</b><span>Suggested actions</span></div>
        <div className="card k"><small>Last radar pass</small><b className="mono">14:52</b><span>Next expected 19:20</span></div>
      </div>

      <div className="ops">
        <div className="col">
          <div className="card mapcard">
            <div className="line wrap">
              <div className="chips">
                {LAYERS.map(([k, n]) => (
                  <button key={k} className={"chip" + (layers[k] ? " on" : "")} aria-pressed={layers[k]} onClick={() => setLayers({ ...layers, [k]: !layers[k] })}>{n}</button>
                ))}
              </div>
              <span className="note">Schematic, not to scale · fictional vessels</span>
            </div>
            <MapView cases={cases} selectedId={selected && selected.id} onSelect={onSelect} layers={layers} />
            <div className="legend">
              <span><i className="dot vessel" />Vessel with AIS</span>
              <span><i className="dot lastais" />Last AIS position</span>
              <span><i className="dot radar" />Radar detection</span>
              <span><i className="dot high" />High</span>
              <span><i className="dot medium" />Medium</span>
              <span><i className="dot low" />Low</span>
            </div>
          </div>
          {selected ? (
            <CaseDetail c={selected} onStatus={onStatus} onAction={onAction} onExport={onExport} />
          ) : (
            <div className="card empty">No cases match the current thresholds. Lower them in Settings.</div>
          )}
        </div>

        <div className="card queue">
          <div className="h line"><span>Case queue</span><span>ranked by priority</span></div>
          {cases.map((c, i) => (
            <button key={c.id} className={"qitem" + (selected && c.id === selected.id ? " on" : "")} onClick={() => onSelect(c.id)}>
              <span className={"pin " + c.priority}>{i + 1}</span>
              <span className="qbody">
                <span className="qtop"><PriorityTag priority={c.priority} /><CaseStatus status={c.status} /></span>
                <span className="qtitle">{c.title}</span>
                <span className="meta">{c.detector} · {c.confidence}%</span>
              </span>
            </button>
          ))}
          {!cases.length && <div className="empty">No cases match the current thresholds.</div>}
          {hidden > 0 && <p className="note pad">{hidden} case{hidden > 1 ? "s" : ""} hidden by your thresholds.</p>}
        </div>
      </div>
    </>
  );
}
