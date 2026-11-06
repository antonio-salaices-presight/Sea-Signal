import React from "react";

export default function Settings({ cfg, setCfg, audit, onReset }) {
  return (
    <div className="two">
      <div className="col">
        <div className="card">
          <p className="h">Detection</p>
          <div className="field">
            <div className="line"><label htmlFor="th-conf">Minimum confidence</label><span className="mono">{cfg.minConfidence}%</span></div>
            <input id="th-conf" type="range" min="0" max="90" step="1" value={cfg.minConfidence} onChange={(e) => setCfg({ ...cfg, minConfidence: +e.target.value })} />
          </div>
          <div className="field top-gap">
            <div className="line"><label htmlFor="th-dur">Minimum gap or stop</label><span className="mono">{cfg.minDuration} min</span></div>
            <input id="th-dur" type="range" min="0" max="90" step="5" value={cfg.minDuration} onChange={(e) => setCfg({ ...cfg, minDuration: +e.target.value })} />
          </div>
          <p className="note top-gap">Cases below these levels are hidden from the map, the queue and the briefing. Position mismatches have no duration and ignore the second setting.</p>
        </div>
        <div className="card">
          <p className="h">Governance</p>
          <div className="line">
            <div>
              <div className="lab">Analyst approval for every action</div>
              <div className="note">Always on. The agent suggests, people approve.</div>
            </div>
            <button className="switch" role="switch" aria-checked="true" aria-label="Analyst approval for every action" disabled />
          </div>
        </div>
        <div className="card">
          <p className="h">Demo</p>
          <button className="btn" onClick={onReset}>Reset demo data</button>
        </div>
      </div>
      <div className="card alignstart">
        <div className="h line"><span>Audit log</span><span>this session</span></div>
        {audit.map((a, i) => (
          <div className="logrow" key={i}>
            <span className="src mono">{a.t}</span>
            <div>
              <p>{a.what}</p>
              <span className="meta">{a.who}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
