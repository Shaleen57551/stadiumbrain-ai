# StadiumBrain AI — Autonomous Multi-Agent Tournament Operations Platform

StadiumBrain AI is an autonomous, multi-agent AI Tournament Operations and Decision-Support Platform designed for managing international sporting events, stadiums, emergency responses, and spectator transit flows before, during, and after matchdays.

---

## 🏟 Problem Statement

Managing modern international sports tournaments and mega-stadium operations involves coordinating highly volatile, independent variables:
* **Crowd Backlogs**: Localized turnstile bottlenecks that can lead to stampedes or access delays.
* **Scheduling Overlaps**: Overbooked stadiums, referee conflicts, or team travel fatigue (back-to-back match blocks).
* **Emergency Dispatch Bottlenecks**: Medical crises and security altercations requiring coordinated dispatches without blocking transit routes.
* **Sustainability Ratios**: Balancing solar generation, battery grid arbitrage, and water circularity to meet net-zero event requirements.

Operations teams historically rely on disconnected monitors and static spreadsheets. A single event stressor (e.g. flash flood or highway accident) can create cascade failures across transit, safety, and operational scores.

---

## 💡 The Solution

StadiumBrain AI bridges these gaps by serving as an **Intelligent Decision-Support Platform**. The application acts as a central **Command Center** driven by 8 collaborating AI agents that pass state vectors to resolve operational crises dynamically:
1. **Explainable AI (XAI)**: Recommends concrete actions alongside an explicit "Why this recommendation?" section detailing operational rationale.
2. **Confidence Scores**: Displays precision confidence level indicators (e.g., `96% Confidence`) for all forecasts and simulated telemetry.
3. **What-If Digital Twin Simulator**: Enables operations directors to pre-event stress-test scenarios (Heavy Rain, Full Capacity, Medical Crisis, Grid Failure, VIP Arrival, Security Threat, Transit Delay) to predict metric outcomes.
4. **Logic Test Suite**: Runs diagnostic checks inside the reports dashboard to verify scheduler algorithms, queue limits, and triage safety constraints.

---

## 🏗 System Architecture

StadiumBrain AI is designed as a modular, responsive **Single Page Application (SPA)** utilizing ES Modules for state isolation and route coordination:

```
                  ┌─────────────────────────────────┐
                  │          index.html             │
                  │   (Single Page App Shell UI)    │
                  └────────────────┬────────────────┘
                                   │
                  ┌────────────────▼────────────────┐
                  │            js/app.js            │
                  │   (Central Router & State Engine)│
                  └────────┬───────────────┬────────┘
                           │               │
      ┌────────────────────▼────┐     ┌────▼────────────────────┐
      │        js/data.js       │     │     js/views/*.js       │
      │ (Seeds database, state) │     │ (View Module Controller)│
      └─────────────────────────┘     └─────────────────────────┘
```

* **Dynamic State Manager**: The central state object in `js/app.js` manages active simulation tags. Modifying simulation attributes triggers a score recalculation that dynamically redraws the SVG circular gauges.
* **Isolated View Controllers**: Every section (Dashboard, AI Ops, Tournament, Crowd, Emergency, Sustainability, Analytics, Reports) operates as a separate ES module to maintain a clean separation of concerns.

---

## 🤖 Collaborating AI Agents

The platform uses a Multi-Agent architecture where models work in parallel:
* **Tournament Director AI**: Coordinates all agents, aggregates telemetry assessments, and outputs consolidated executive summaries.
* **Scheduling AI**: Scans fixture datasets, resolves referee overbookings, and shifts game slots.
* **Crowd Intelligence AI**: Monitors turnstile queue sizes, calculates wait forecasts, and recommends gate rerouting.
* **Security AI**: Assesses stands sector densities and manages safety squads.
* **Emergency AI**: Triage incidents and constructs safe assembly evacuation blueprints.
* **Sustainability AI**: Manages waste loops, water recycling rates, and energy battery diversion.
* **Transportation AI**: Tracks parking lot occupancy and schedules bus transit supports.
* **Fan Experience AI**: Oversees accessibility pathways, captioning, and FM audio descriptions.

---

## 🚀 Key Features

* **Executive Decision Board**: Glassmorphic percentage score dials tracking Operational, Safety, Sustainability, and Fan Experience metrics.
* **Live Agent Collaboration Stream**: Monospace dark console printing sequential agent communications (e.g., `[Crowd AI] -> [Transportation AI]`).
* **Turnstile Heatmaps**: HTML5 Canvas rendering spectator densities at gates.
* **Incident Timeline Stepper**: Chronological timeline mapping incident states from *Awaiting Dispatch* to *Responding* to *Resolved*.
* **Diagnostics Suite**: Automated browser tests validating compiler sanity.

---

## 📸 Screenshots Placeholders

### Executive Dashboard & What-If Simulator
```text
┌────────────────────────────────────────────────────────────────────────┐
│  Executive Decision Board: [ Ops: 94% ] [ Safety: 98% ] [ Sustain: 85% ]│
├──────────────────────────────────────┬─────────────────────────────────┤
│  AI Digital Twin Scenario Library    │  AI Recommendation Engine       │
│  [ Heavy Rain ]  [ Full Capacity ]   │  * Power Grid Failure (95% Conf)│
│  [ Power Loss ]  [ VIP Arrival ]     │    AI recommends solar battery  │
│  [ Security ]    [ Transit Delay ]   │    [ Apply Mitigation Decision ]│
└──────────────────────────────────────┴─────────────────────────────────┘
```

### AI Command Center & Collaboration Stream
```text
┌───────────────────────────┬───────────────────────────┬────────────────┐
│  Prompt Modes             │  Active Chat Workspace     │  AI Roster     │
│  [ Emergency ] [ Crowd ]  │  Tournament Director:     │  Director  [ACT]│
│  [ Schedule ]  [ Sustain ]│  Explainable Rationale    │  Crowd     [MON]│
│                           │  "Why this recommendation"│  Transit   [PRC]│
│  Command History          ├───────────────────────────┼────────────────┤
│  * Crowd Mode Assessment  │  Agent Collaboration:     │  Collab Stream │
│  * Emergency Dispatch Run │  [Crowd] -> [Transit]     │  Active...     │
└───────────────────────────┴───────────────────────────┴────────────────┘
```

---

## 🛠 Technologies Used

* **Structure**: HTML5 Semantic Markup
* **Logic**: JavaScript (ES6+ Modules)
* **Styling**: Vanilla CSS3 (Custom variables, responsive grid, glassmorphic filters)
* **Visuals**: Chart.js (Line, Doughnut, and Bar layouts), HTML5 Canvas
* **Icons**: Lucide Icons CDN
* **Validation**: Node.js parser checks

---

## 📁 Folder Structure

```text
VirtuaslPromptWars/
├── README.md                  # Project Documentation
├── index.html                 # Single Page Application HTML shell
├── css/
│   ├── main.css               # Core variables, sidebar & navigation styles
│   └── views.css              # Custom view sheets (Dials, Heatmaps, Timelines)
└── js/
    ├── app.js                 # Central Router, State recalculator, Diagnostics tests
    ├── data.js                # Seeds database, Teams lists, AI Responses templates
    └── views/
        ├── ai-ops.js          # Multi-Agent hub & Collaboration console controller
        ├── dashboard.js       # Executive score dials & What-if scenario bindings
        ├── tournament.js      # Match planner & Smart Scheduler conflict optimizer
        ├── crowd.js           # Live heatmaps canvas & Turnstile wait time forecaster
        ├── emergency.js       # Triage recommendation logs & chronological stepper timeline
        ├── sustainability.js  # Circular offsets & EV charger tracker
        ├── analytics.js       # Chart.js metrics setup
        └── reports.js         # Report export generators
```

---

## ⚙ Installation & Running Locally

### Prerequisites
* A web browser (Chrome, Firefox, Safari, or Edge).
* A static file server (Node.js `serve` package, Python, or Live Server extension).

### Quick Start
1. Clone or download this project directory:
   ```bash
   cd VirtuaslPromptWars
   ```
2. Serve the directory using any static file server:
   * **Node.js (Recommended)**:
     ```bash
     npx serve .
     ```
   * **Python**:
     ```bash
     python -m http.server 8000
     ```
3. Open your browser and navigate to the local address (e.g. `http://localhost:3000` or `http://localhost:8000`).

---

## 🔮 Future Scope

* **API Telemetry Integrations**: Connect real-time GPS feeds from transit vehicles.
* **3D Twin Rendering**: Implement Three.js models to render physical sensor coordinates inside the stadium.
* **LLM API Endpoints**: Integrate OpenAI or Anthropic endpoints to handle dynamic conversational queries.

---

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.
