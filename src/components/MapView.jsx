import React from "react";
import { VESSELS } from "../data.js";

const prioClass = { high: "m-high", medium: "m-medium", low: "m-low" };

function CaseGeometry({ c }) {
  const g = c.geom;
  if (g.kind === "gap") {
    return (
      <g>
        <path d={g.track} className="m-track" />
        <line x1={g.last[0]} y1={g.last[1]} x2={g.det[0] - 14} y2={g.det[1] - 2} className="m-gapline" />
        <circle cx={g.last[0]} cy={g.last[1]} r="9" className="m-lastais" />
        <circle cx={g.det[0]} cy={g.det[1]} r="16" className="m-radar" />
      </g>
    );
  }
  if (g.kind === "pair") {
    const cx = (g.a[0] + g.b[0]) / 2;
    const cy = (g.a[1] + g.b[1]) / 2;
    return (
      <g>
        <circle cx={cx} cy={cy} r="40" className="m-ring" />
        <circle cx={g.a[0]} cy={g.a[1]} r="8" className="m-attn" />
        <circle cx={g.b[0]} cy={g.b[1]} r="8" className="m-attn" />
      </g>
    );
  }
  if (g.kind === "mismatch") {
    return (
      <g>
        <line x1={g.rep[0]} y1={g.rep[1]} x2={g.det[0]} y2={g.det[1]} className="m-gapline" />
        <circle cx={g.rep[0]} cy={g.rep[1]} r="9" className="m-lastais" />
        <circle cx={g.det[0]} cy={g.det[1]} r="14" className="m-radar" />
      </g>
    );
  }
  return (
    <g>
      <circle cx={g.last[0]} cy={g.last[1]} r="9" className="m-lastais" />
    </g>
  );
}

export default function MapView({ cases, selectedId, onSelect, layers }) {
  const caseVessels = new Set(VESSELS.filter((v) => v.caseId).map((v) => v.id));
  return (
    <svg
      className="map"
      viewBox="0 0 1000 620"
      role="img"
      aria-label="Schematic map of a strait with two traffic lanes, vessels, and numbered cases that need review"
    >
      <rect width="1000" height="620" className="m-sea" />
      <path d="M0 0 H1000 V90 L820 120 L640 175 L470 160 L300 118 L140 130 L0 120 Z" className="m-land" />
      <path d="M360 620 L470 500 L640 460 L790 470 L900 520 L1000 530 V620 Z" className="m-land" />
      <text x="24" y="40" className="m-label">North coast</text>
      <text x="880" y="590" className="m-label" textAnchor="end">South coast</text>

      {layers.zones && (
        <g>
          <polygon points="60,470 230,470 250,565 70,575" className="m-zone" />
          <text x="86" y="525" className="m-zonelabel">Anchorage</text>
          <polygon points="700,385 900,385 900,445 700,445" className="m-zone m-restricted" />
          <text x="716" y="420" className="m-zonelabel">Restricted area</text>
        </g>
      )}

      {layers.lanes && (
        <g>
          <path d="M0 250 C 300 235 620 262 1000 305" className="m-lane" />
          <path d="M0 310 C 300 295 620 322 1000 365" className="m-lane" />
          <text x="24" y="226" className="m-label">Outbound lane</text>
          <text x="24" y="346" className="m-label">Inbound lane</text>
        </g>
      )}

      {layers.ais && (
        <g>
          <line x1="925" y1="200" x2="925" y2="420" className="m-edge" />
          <text x="920" y="195" className="m-label" textAnchor="end">Coastal AIS coverage ends</text>
          {VESSELS.filter((v) => !caseVessels.has(v.id)).map((v) => (
            <circle key={v.id} cx={v.pos[0]} cy={v.pos[1]} r="6" className="m-vessel" />
          ))}
        </g>
      )}

      {cases.map((c) => (
        <g key={c.id} className={c.id === selectedId ? "m-sel" : ""}>
          {(c.geom.kind !== "gap" || layers.radar || layers.ais) && <CaseGeometry c={c} />}
        </g>
      ))}

      {cases.map((c, i) => {
        const [x, y] = c.geom.marker;
        const sel = c.id === selectedId;
        return (
          <g
            key={c.id + "-pin"}
            className={"m-pin " + prioClass[c.priority] + (sel ? " is-sel" : "")}
            onClick={() => onSelect(c.id)}
            role="button"
            tabIndex={0}
            aria-label={"Case " + (i + 1) + ": " + c.title}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(c.id)}
          >
            {sel && <circle cx={x} cy={y} r="27" className="m-pinhalo" />}
            <circle cx={x} cy={y} r={sel ? 20 : 17} className="m-pindot" />
            <text x={x} y={y + 6} textAnchor="middle" className="m-pintext">{i + 1}</text>
          </g>
        );
      })}
    </svg>
  );
}
