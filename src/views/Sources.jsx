import React from "react";
import { SOURCES } from "../data.js";

export default function Sources() {
  return (
    <>
      <div className="card">
        <p className="h">Each source, and what it cannot do</p>
        <div className="tablewrap">
          <table>
            <thead>
              <tr><th>Source</th><th>What it gives</th><th>Limit</th><th>Route</th><th>Data age</th></tr>
            </thead>
            <tbody>
              {SOURCES.map((s) => (
                <tr key={s.name}>
                  <td className="strong">{s.name}<span className="meta">{s.note}</span></td>
                  <td>{s.gives}</td>
                  <td>{s.limit}</td>
                  <td>{s.route}</td>
                  <td className="mono">{s.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card">
        <p className="h">Data routes</p>
        <p className="note big">
          The demo uses public radar and optical imagery plus licensed or archived AIS. Commercial high-resolution imagery is a later phase.
          Every source is used within its licence terms, and every case shows how old its data is.
        </p>
      </div>
    </>
  );
}
