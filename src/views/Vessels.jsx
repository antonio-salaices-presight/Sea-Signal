import React, { useState } from "react";
import { VESSELS } from "../data.js";

export default function Vessels({ onOpen }) {
  const [q, setQ] = useState("");
  const [onlyFlagged, setOnlyFlagged] = useState(false);
  const rows = VESSELS.filter((v) => (!onlyFlagged || v.caseId) && (!q || v.id.toLowerCase().includes(q.toLowerCase())));
  return (
    <div className="card">
      <div className="line wrap bottom-gap">
        <div className="chips">
          <button className={"chip" + (!onlyFlagged ? " on" : "")} onClick={() => setOnlyFlagged(false)}>All vessels</button>
          <button className={"chip" + (onlyFlagged ? " on" : "")} onClick={() => setOnlyFlagged(true)}>With a case</button>
        </div>
        <input id="vessel-search" type="search" placeholder="Search vessel ID" aria-label="Search vessel ID" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="tablewrap">
        <table>
          <thead>
            <tr><th>Vessel</th><th>Zone</th><th>AIS status</th><th>Last AIS</th><th>Case</th></tr>
          </thead>
          <tbody>
            {rows.map((v) => (
              <tr key={v.id}>
                <td className="mono">{v.id}</td>
                <td>{v.lane}</td>
                <td><span className={"tag " + (v.status === "Active" ? "lo" : "medium")}>{v.status}</span></td>
                <td className="mono">{v.last}</td>
                <td>{v.caseId ? <button className="linkbtn" onClick={() => onOpen(v.caseId)}>{v.caseId}</button> : "None"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!rows.length && <div className="empty">No vessels match.</div>}
      <p className="note top-gap">Fictional vessels. IDs are invented and do not match real vessels.</p>
    </div>
  );
}
