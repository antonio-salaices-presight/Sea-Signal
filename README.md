# SeaSignal

Prototype of an AI-powered maritime domain awareness platform. It cross-checks AIS, satellite detections and map layers, and gives analysts a ranked queue of cases with evidence, innocent explanations and suggested actions from an action agent.

**All data is fictional.** Vessels, positions, times and cases are invented, and nothing connects to AIS, satellite or registry services. The map is a schematic of a strait, not to scale.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

Needs Node 18 or newer.

## What you can do

- **Operations:** see the map and the ranked case queue, select a case, and review its facts, innocent explanations and evidence.
- **Suggested actions:** approve or dismiss each action. Approving sends nothing in this demo.
- **Case status:** start review, escalate, close as explained, or copy a report.
- **Briefing, Vessels, Sources:** a shift summary built from open cases, a vessel table, and the data sources with their limits.
- **Settings:** minimum confidence and minimum gap or stop hide cases below the levels you set. The audit log records every action.

## Structure

```
src/
  data.js              fictional vessels, cases and sources
  components/
    MapView.jsx        schematic strait map (SVG)
    CaseDetail.jsx     case facts, evidence and suggested actions
  views/               one file per screen
  App.jsx              navigation, state and analyst actions
  styles.css           design tokens (dark and light) and layout
```

## Connecting real data

Replace the exports in `src/data.js` with calls to your backend. Use licensed AIS feeds and public or licensed imagery within their terms. The action suggestions here are static examples; a real agent should only use the case evidence, cite it, and leave approval to the analyst.
