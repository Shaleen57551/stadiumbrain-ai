# 🏟 StadiumBrain AI
## AI-Powered Smart Stadium & Tournament Operations Platform

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
![AI Powered](https://img.shields.io/badge/AI--Powered-2563EB?style=for-the-badge&logo=smartthings&logoColor=white)
![MIT License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

🚀 **Live Deployment URL**: [https://virtualp-501812.uc.r.appspot.com](https://virtualp-501812.uc.r.appspot.com)  
💻 **GitHub Repository**: [https://github.com/Shaleen57551/stadiumbrain-ai.git](https://github.com/Shaleen57551/stadiumbrain-ai.git)

---

## 📖 Overview

**StadiumBrain AI** is an autonomous, multi-agent decision-support platform engineered to manage mega-stadium operations during large-scale sports festivals and international tournaments. Acting as a central operations advisor, it integrates real-time telemetry analytics with a Digital Twin scenario simulator, allowing organizers to anticipate bottlenecks, coordinate emergency triage response vectors, optimize matchday schedules, and circularize resources.

---

## 🎯 Challenge Alignment

StadiumBrain AI directly solves the **"Smart Stadiums & Tournament Operations"** challenge by deploying modern AI decision-support algorithms to improve venue safety, sustainability, and administrative efficiency:

*   **Tournament Scheduling**: Automatic scans check matches for referee clashes, venue double-bookings, and team travel fatigue. An optimization solver automatically shifts times and reallocates officials to resolve clashing events.
*   **Crowd Intelligence**: Generates 30-minute predictive queue times for turnstiles and classifies gate loads (Low, Medium, Critical Risk) to prevent perimeter bottlenecks.
*   **Emergency Response**: Integrates a real-time Incident Commander triage matrix that prioritizes dispatcher resources (medical, security, fire) and maps safe evacuation pathways.
*   **Sustainability**: Manages circular resource analytics, tracking EV chargers status, water recycling efficiency, waste circularity, and solar battery energy arbitrage.
*   **Accessibility**: Monitors elevator availability, activates closed-captioning jumbotrons, and deploys wheelchair coordinators along alternate routes.
*   **AI Decision Support**: Combines multi-agent collaboration tickers, explainable rationale blocks, and predictive confidence ratings to help coordinators execute mitigations.
*   **Operational Efficiency**: Keeps data unified and synchronized in a single dashboard, replacing disconnected spreadsheets.

---

## ⭐ Feature Highlights

*   **Multi-Agent AI Architecture**: 8 specialized AI models collaborating to assess stadium conditions.
*   **AI Digital Twin Simulator**: Simulates stressors (weather, crowds, outages) to predict operational impact.
*   **Smart Tournament Scheduler**: Automatic match conflict resolver and scheduler reallocator.
*   **Predictive Crowd Intelligence**: Forecasts turnstile compaction and gate queue risk levels.
*   **AI Incident Commander**: Response triage planner and chronological stepper timeline.
*   **Executive Decision Dashboard**: Dynamic circular gauges tracking Operational, Safety, and Sustainability scores.
*   **Explainable AI**: Reasoning sections explaining the logic behind AI recommendations.
*   **Confidence Scores**: Precision indicators validating predicted metrics.
*   **What-If Simulator**: Scenario library triggers (VIPs, rain, delays) loading stressors in one click.
*   **Sustainability Dashboard**: Carbon footprint offsets and EV grid chargers tracking.
*   **AI Command Center**: Three-column console layout showing live agent communication logs.
*   **Live Analytics**: Interactive Chart.js trend lines, revenue splits, and peak turnstile loads.
*   **Diagnostics Suite**: Built-in logic tests verifying boundary inputs and solver validations.

---

## 🏟 Problem Statement

Mega-stadium management is plagued by fragmented operational systems. During large tournaments, operations teams rely on static plans and disconnected feeds. A single unexpected bottleneck (such as a delayed transit shuttle, a power grid outage, or a localized queue buildup) can create severe cascade failures:
1.  **Safety Vulnerabilities**: Crowd compaction at turnstiles going undetected, resulting in critical evacuation bottlenecks.
2.  **Resource Inefficiencies**: Grid energy wastage and lack of water recovery loop synchronization.
3.  **Scheduling Clashes**: Last-minute referee or stadium double-bookings causing televised delays.
4.  **Operational Blindspots**: Coordinators lack the tools to test crisis scenarios ("What if a turnstile jams?") before they occur.

---

## 💡 Solution

StadiumBrain AI acts as a reactive, intelligent **AI Operations Platform**. Using a Multi-Agent coordination framework, the platform simulates and optimizes stadium states:
*   **Intelligent What-If Simulation**: Directors can load pre-event stress scenarios to see how crowd, safety, and operational scores adjust.
*   **Explainable AI recommendations**: Direct mitigations (e.g., reallocating shuttles) are paired with detailed explanations of *why* the action is recommended and *which* agents generated it.
*   **Diagnostics Unit Testing**: Runs test assertions inside the browser to verify the accuracy of turnstile boundary algorithms, match inputs, and scheduling solvers.

---

## 🤖 Multi-Agent AI Architecture

The platform uses a specialized Multi-Agent grid where individual AI nodes scan parameters and pass telemetry states:

| AI Agent | Responsibility |
| :--- | :--- |
| **Tournament Director AI** | Coordinates the agent grid, aggregates reports, and outputs consolidated recommendations. |
| **Scheduling AI** | Scans fixtures for venue conflicts, referee overlaps, and travel fatigue indicators. |
| **Crowd Intelligence AI** | Monitors turnstiles, forecasts wait times, and reroutes spectator flows. |
| **Security AI** | Analyzes stands sector densities, logs threats, and deploys control officers. |
| **Emergency AI** | Triage incident severities, alerts EMT/Fire dispatches, and generates evacuation routes. |
| **Sustainability AI** | Manages waste loops, water recycling rates, and energy battery diversion. |
| **Transportation AI** | Optimizes parking lot utilization and schedules transit shuttle bus supports. |
| **Fan Experience AI** | Tracks accessibility elevator compliance, audio guides, and wait-time satisfaction. |

---

## 🏗 System Architecture

StadiumBrain AI is engineered as a lightweight, performance-optimized Single Page Application (SPA) driven by native ES6 JavaScript modules:

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

*   **Central State Router (`js/app.js`)**: Coordinates navigation, performs automated conflict checks on data shifts, recalculates metric scores, and triggers isolated view render functions.
*   **Modular Views (`js/views/`)**: Separate view modules isolate script execution for individual tabs (Dashboard, AI Ops, Scheduler, Crowd, Emergency, Sustainability, Analytics, Reports) to prevent memory leaks and minimize DOM redraw latency.

---

## 🚀 Key Features

### 1. AI Command Center
The core conversational hub uses a three-column layout designed for maximum utility:
*   **Prompt Assistant (Left)**: Quick prompt chips triggering focused analysis runs.
*   **Active Chat Workspace (Center)**: Structured response panels detailing Situation Overview, AI Optimizations, and expected impacts, all tagged with agent attributions.
*   **AI Command Roster & Collaboration Stream (Right)**: Shows real-time agent status indicators (Monitoring, Processing, Active) and a monospace log displaying cross-agent messaging.

### 2. Digital Twin What-If Simulator
A scenario stress-testing simulator that updates dashboard metrics dynamically. Organizers can trigger Heavy Rain, Full Capacity, Medical Crisis, Grid Outage, VIP Arrival, Security Threat, or Transit Delays to test the resilience of stadium operations.

### 3. Smart Tournament Scheduler
Monitors the matchday calendar for scheduling conflicts. Features an **Auto-Optimize** script that dynamically resolves overlaps (such as adjusting referee assignments or shifting kickoff hours) and recalculates the Operational Score.

### 4. Predictive Crowd Intelligence
Features an interactive HTML5 Canvas heatmap updating density coordinate points. Predicts 30-minute queue wait-times at gates and triggers turnstile balancing mitigations when lines compact.

### 5. AI Incident Commander
Displays triage priorities based on logged severities. Connects to a vertical stepper timeline mapping active dispatches from *Logged* to *Responding* to *Scene Arrival* to *Resolved*.

---

## 📊 Evaluation Criteria Alignment

| Evaluation Criteria | How StadiumBrain AI Addresses It |
| :--- | :--- |
| **Code Quality** | Standardized ES Modules isolate view scripts. Try-catch blocks inside the views import loop prevent single-module failures from halting the application. |
| **Security** | Prevents cross-site scripting (XSS) via strict text sanitization. Incorporates catch blocks to safeguard clipboard copy navigations. |
| **Efficiency** | Leverages local client-side rendering with target element selectors to minimize unnecessary DOM tree modifications and ensure 60fps animations. |
| **Testing** | Employs a visual Diagnostics Suite verifying validator boundary conditions, match booking rules, and referee overlap scanners. |
| **Accessibility** | AA color contrast compliance, keyboard focus rings (`*:focus-visible`), aria descriptive labels, and screen reader announcements. |
| **Problem Statement Alignment** | Specifically resolves the FIFA/Olympic Smart Stadiums operations challenge, offering automated conflict solvers and triage dashboards. |

---

## 📸 Screenshots

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

| Technology | Role in Project |
| :--- | :--- |
| **HTML5** | Semantic structure, navigation drawers, and canvas tags. |
| **JavaScript (ES6+)** | Modular application logic, router, and state manager. |
| **CSS3** | Glassmorphic visual theme, variables, and animations. |
| **Chart.js** | Interactive analytics graphs. |
| **Lucide Icons** | SVG icon system. |

---

## 📂 Folder Structure

```text
VirtualPromptWars/
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

## ⚙ Installation

1.  Clone or download this project directory to your local drive:
    ```bash
    git clone https://github.com/Shaleen57551/stadiumbrain-ai.git
    cd stadiumbrain-ai
    ```

---

## ▶ Running Locally

StadiumBrain AI operates client-side and requires a local static web server to resolve ES6 import statements:

### Method A: Node.js (Recommended)
```bash
npx serve .
```

### Method B: Python
```bash
python -m http.server 8000
```
Open your browser and navigate to `http://localhost:3000` (Node) or `http://localhost:8000` (Python).

---

## 🔍 Example Workflow

The following pipeline illustrates the reactive decision-support cycle of the platform:

```
[User Selects Scenario] (e.g. VIP Arrival)
          │
          ▼
[AI Agents Collaborate] (Security AI requests escort path; Fan Experience reserves elevator)
          │
          ▼
[Recommendation Generated] (Director AI compiles rationale, attributions, and 97% confidence score)
          │
          ▼
[Dashboard Updated] (Safety score adjusts, alert notification broadcasts, and mitigation logs update)
```

---

## 💼 Why StadiumBrain AI?

Unlike ordinary monitoring dashboards, StadiumBrain AI acts as an **active decision partner**:
*   **Proactive AI**: Predicts crowd compaction and schedule overlaps 30 minutes in advance instead of registering historical failures.
*   **Multi-Agent Collaboration**: Simulates real-time cross-agent checks, ensuring that changes to the tournament schedule automatically update transit and security logistics.
*   **Explainable AI**: Rationale sections explain the logic behind AI recommendations.
*   **Digital Twin Simulation**: Empowers directors to stress-test scenarios before they occur.

---

## 📈 Future Scope

*   **Live Sensor Telemetry**: Connect real-time ticketing scans and transit GPS APIs.
*   **3D WebGL Visualization**: Integrate Three.js views to render physical gate sensors.
*   **LLM API Integrations**: Connect dynamic model APIs to handle complex custom operations prompts.

---

## 📝 Note

StadiumBrain AI currently uses realistic simulated data to demonstrate AI-assisted decision making. The application is designed to be easily extended with live REST APIs, IoT hardware devices, and real-time stadium telemetry feeds.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
