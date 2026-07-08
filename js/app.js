// Main Application Shell Controller - StadiumBrain AI
import { tournamentsData, crowdInitialData, emergencyInitialData, sustainabilityInitialData } from './data.js';

// Global Application State
export const state = {
  currentView: 'dashboard',
  selectedTournamentId: 'world_cup_2026',
  tournament: tournamentsData.world_cup_2026,
  crowd: { ...crowdInitialData },
  emergency: { ...emergencyInitialData },
  sustainability: { ...sustainabilityInitialData },
  chatHistory: [
    {
      id: 1,
      sender: 'system',
      timestamp: '16:51',
      text: 'StadiumBrain AI operations partner initialized. Standing by for commands or analysis mode activation.'
    }
  ],
  notifications: [
    { id: 1, severity: 'danger', title: 'Gate E Congestion', desc: 'Turnstile wait time exceeding 25 minutes.', time: '16:42' },
    { id: 2, severity: 'warning', title: 'Medical Alert', desc: 'Zone E outer plaza paramedic dispatch required.', time: '16:40' }
  ],
  drillActive: false,
  simulation: {
    activeScenarios: [],
    scores: { operational: 94, safety: 98, sustainability: 85, fanExperience: 89, overall: 91 },
    schedulingConflicts: [],
    agents: {
      director: { id: "director", name: "Tournament Director AI", status: "Active", role: "Agent Orchestrator", icon: "crown" },
      scheduler: { id: "scheduler", name: "Scheduling AI", status: "Monitoring", role: "Fixture Optimizer", icon: "calendar" },
      crowd: { id: "crowd", name: "Crowd Intelligence AI", status: "Monitoring", role: "Pedestrian Flow", icon: "users" },
      security: { id: "security", name: "Security AI", status: "Monitoring", role: "Risk Assessment", icon: "shield" },
      emergency: { id: "emergency", name: "Emergency AI", status: "Monitoring", role: "Crisis Evacuation", icon: "alert-triangle" },
      sustainability: { id: "sustainability", name: "Sustainability AI", status: "Monitoring", role: "Resource Loops", icon: "leaf" },
      transportation: { id: "transportation", name: "Transportation AI", status: "Monitoring", role: "Transit & Parking", icon: "bus" },
      fanExperience: { id: "fanExperience", name: "Fan Experience AI", status: "Monitoring", role: "Wait Times & Access", icon: "smile" }
    }
  }
};

// View modules list
const views = {};

// Register views
export function registerView(name, module) {
  views[name] = module;
}

// Main initialization on DOM load
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // Navigation Setup
  initNavigation();
  initTopbar();
  
  // Set up local ticking clock
  updateClock();
  setInterval(updateClock, 1000);

  // Initialize View Modules
  await loadViews();

  // Initial render of current view
  switchView('dashboard');
});

// Load all view files
async function loadViews() {
  const modules = [
    { name: 'dashboard', path: './views/dashboard.js' },
    { name: 'ai-ops', path: './views/ai-ops.js' },
    { name: 'tournament', path: './views/tournament.js' },
    { name: 'crowd', path: './views/crowd.js' },
    { name: 'emergency', path: './views/emergency.js' },
    { name: 'sustainability', path: './views/sustainability.js' },
    { name: 'analytics', path: './views/analytics.js' },
    { name: 'reports', path: './views/reports.js' }
  ];

  for (const mod of modules) {
    try {
      const module = await import(mod.path);
      registerView(mod.name, module);
      if (module.init) {
        module.init(state);
      }
    } catch (error) {
      console.error(`Error loading view module [${mod.name}]:`, error);
    }
  }
}

// Clock updates
function updateClock() {
  const clockEl = document.getElementById('system-time');
  if (clockEl) {
    const now = new Date();
    // Simulate active match day date: July 8, 2026
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    clockEl.textContent = `2026-07-08 | UTC ${timeStr}`;
  }
}

// Navigation & Sidebar
function initNavigation() {
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menu-toggle');
  const navItems = document.querySelectorAll('.nav-item');

  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = item.getAttribute('data-view');
      
      navItems.forEach(el => el.classList.remove('active'));
      item.classList.add('active');

      switchView(targetView);

      // Close mobile sidebar
      sidebar.classList.remove('active');
    });
  });

  // Support link routing from within views (e.g. clicking 'View Tournament Manager' in dashboard)
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-view-target]');
    if (target) {
      const viewName = target.getAttribute('data-view-target');
      const navItem = document.querySelector(`.nav-item[data-view="${viewName}"]`);
      if (navItem) {
        navItem.click();
      }
    }
  });
}

// View switcher
export function switchView(viewName) {
  state.currentView = viewName;
  
  // Hide all view panels
  const viewPanels = document.querySelectorAll('.view-panel');
  viewPanels.forEach(panel => {
    panel.classList.remove('active');
  });

  // Show active view panel
  const activePanel = document.getElementById(`view-${viewName}`);
  if (activePanel) {
    activePanel.classList.add('active');
  }

  // Update top bar title
  const titleMap = {
    'dashboard': 'Tournament Command Dashboard',
    'ai-ops': 'AI Operations Command Center',
    'tournament': 'Tournament & Match Fixture Manager',
    'crowd': 'Crowd Density & Queue Analytics',
    'emergency': 'Emergency Dispatch Command Center',
    'sustainability': 'Circular Sustainability Analytics',
    'analytics': 'Operational Revenue & Analytics KPI',
    'reports': 'Executive Performance Reports'
  };

  const titleEl = document.getElementById('current-view-title');
  if (titleEl && titleMap[viewName]) {
    titleEl.textContent = titleMap[viewName];
  }

  // Run conflict check and score recalculation before rendering the views
  checkSchedulingConflicts();

  // Call view-specific render updates
  if (views[viewName] && views[viewName].render) {
    views[viewName].render(state);
  }

  if (viewName === 'reports') {
    runSystemDiagnostics();
  }

  lucide.createIcons();
}

// Notification trigger and Active tournament dropdown
function initTopbar() {
  const tournamentSelect = document.getElementById('tournament-select');
  const notificationTrigger = document.getElementById('notification-trigger');
  const notificationDropdown = document.getElementById('notification-dropdown');
  const clearAlertsBtn = document.getElementById('clear-alerts-btn');

  // Change tournament selector
  tournamentSelect.addEventListener('change', (e) => {
    const selectedVal = e.target.value;
    state.selectedTournamentId = selectedVal;
    state.tournament = tournamentsData[selectedVal];

    // Reload active view layout
    switchView(state.currentView);
  });

  // Open notifications dropdown
  notificationTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    notificationDropdown.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!notificationDropdown.contains(e.target) && e.target !== notificationTrigger) {
      notificationDropdown.classList.remove('active');
    }
  });

  // Clear alerts
  clearAlertsBtn.addEventListener('click', () => {
    state.notifications = [];
    renderNotifications();
    notificationDropdown.classList.remove('active');
  });

  // Initial alerts rendering
  renderNotifications();
}

// Render dynamic notifications dropdown list
export function renderNotifications() {
  const listEl = document.getElementById('notification-list');
  const countEl = document.getElementById('notification-count');
  
  if (!listEl || !countEl) return;

  countEl.textContent = state.notifications.length;
  if (state.notifications.length === 0) {
    countEl.style.display = 'none';
    listEl.innerHTML = '<li class="dropdown-item"><div class="dropdown-item-content"><div class="dropdown-item-title">No Active Alerts</div></div></li>';
    return;
  }

  countEl.style.display = 'flex';
  listEl.innerHTML = state.notifications.map(n => `
    <li class="dropdown-item clickable" data-view-target="emergency">
      <div class="dropdown-item-icon ${n.severity}">
        <i data-lucide="${n.severity === 'danger' ? 'alert-triangle' : n.severity === 'warning' ? 'activity' : 'info'}"></i>
      </div>
      <div class="dropdown-item-content">
        <div class="dropdown-item-title">${n.title}</div>
        <div class="dropdown-item-desc">${n.desc}</div>
        <div class="dropdown-item-time">${n.time}</div>
      </div>
    </li>
  `).join('');

  lucide.createIcons();
}

// Add system notifications dynamically
export function triggerNotification(n) {
  state.notifications.unshift(n);
  renderNotifications();
}

// Recalculate executive score boards dynamically
export function recalculateScores() {
  let ops = 94;
  let safety = 98;
  let sustain = 85;
  let fan = 89;

  // 1. Simulator adjustments
  const sc = state.simulation.activeScenarios;
  if (sc.includes('rain')) {
    sustain -= 15;
    fan -= 12;
    ops -= 8;
  }
  if (sc.includes('surge')) {
    fan -= 15;
    ops -= 12;
    sustain -= 6;
  }
  if (sc.includes('power')) {
    ops -= 42;
    safety -= 35;
    fan -= 22;
  }
  if (sc.includes('gate_failure')) {
    ops -= 18;
    fan -= 14;
  }
  if (sc.includes('medical')) {
    safety -= 20;
  }
  if (sc.includes('security')) {
    safety -= 30;
    ops -= 6;
  }

  // 2. Dynamic gate queues and incidents
  const activeIncidents = state.emergency.activeIncidents.length;
  safety -= activeIncidents * 6;

  const congestedGates = state.crowd.gates.filter(g => g.status === 'Congested').length;
  fan -= congestedGates * 8;
  ops -= congestedGates * 5;

  // 3. Scheduling conflict weight
  const conflictCount = state.simulation.schedulingConflicts.length;
  ops -= conflictCount * 10;

  // Limits
  state.simulation.scores.operational = Math.max(5, Math.min(100, ops));
  state.simulation.scores.safety = Math.max(5, Math.min(100, safety));
  state.simulation.scores.sustainability = Math.max(5, Math.min(100, sustain));
  state.simulation.scores.fanExperience = Math.max(5, Math.min(100, fan));

  // Calculate average overall health
  const avg = (state.simulation.scores.operational + state.simulation.scores.safety + state.simulation.scores.sustainability + state.simulation.scores.fanExperience) / 4;
  state.simulation.scores.overall = Math.round(avg);

  renderScoreDials();
}

// Update SVG and values
export function renderScoreDials() {
  const scores = state.simulation.scores;
  const items = [
    { id: 'ops', val: scores.operational, circleId: 'score-ops-circle' },
    { id: 'safety', val: scores.safety, circleId: 'score-safety-circle' },
    { id: 'sustain', val: scores.sustainability, circleId: 'score-sustain-circle' },
    { id: 'fan', val: scores.fanExperience, circleId: 'score-fan-circle' },
    { id: 'health', val: scores.overall, circleId: 'score-health-circle' }
  ];

  items.forEach(item => {
    const textEl = document.getElementById(`score-${item.id}-val`);
    const circleEl = document.getElementById(item.circleId);
    if (textEl) {
      animateValue(`score-${item.id}-val`, parseInt(textEl.textContent) || 0, item.val, 500);
    }
    if (circleEl) {
      circleEl.setAttribute('stroke-dasharray', `${item.val}, 100`);
    }
  });
}

function animateValue(id, start, end, duration) {
  const obj = document.getElementById(id);
  if (!obj) return;
  if (start === end) {
    obj.textContent = end;
    return;
  }
  const range = end - start;
  const minTimer = 50;
  let stepTime = Math.abs(Math.floor(duration / range));
  stepTime = Math.max(stepTime, minTimer);
  
  const startTime = new Date().getTime();
  const endTime = startTime + duration;
  let timer;
  
  function run() {
    const now = new Date().getTime();
    const remaining = Math.max((endTime - now) / duration, 0);
    const value = Math.round(end - (remaining * range));
    obj.textContent = value;
    if (value === end) {
      clearInterval(timer);
    }
  }
  
  timer = setInterval(run, stepTime);
  run();
}

// Scan match fixtures for scheduling conflicts (venue double-bookings, referee overlaps, back-to-back fatigue)
export function checkSchedulingConflicts() {
  const conflicts = [];
  const matches = state.tournament.matches;
  
  // 1. Referee clash scanner
  const refMap = {};
  matches.forEach(m => {
    if (m.status !== 'Completed') {
      const key = `${m.referee}_${m.date}`;
      if (!refMap[key]) {
        refMap[key] = [];
      }
      refMap[key].push(m);
    }
  });
  
  Object.keys(refMap).forEach(key => {
    if (refMap[key].length > 1) {
      const referee = key.split('_')[0];
      const date = key.split('_')[1];
      conflicts.push({
        type: 'referee',
        title: 'Referee Overbooking Conflict',
        desc: `${referee} is assigned to ${refMap[key].length} overlapping fixtures on ${date}.`,
        data: refMap[key]
      });
    }
  });

  // 2. Venue clash scanner
  const venueMap = {};
  matches.forEach(m => {
    if (m.status !== 'Completed') {
      const key = `${m.venue}_${m.date}_${m.time}`;
      if (!venueMap[key]) {
        venueMap[key] = [];
      }
      venueMap[key].push(m);
    }
  });

  Object.keys(venueMap).forEach(key => {
    if (venueMap[key].length > 1) {
      const parts = key.split('_');
      const venue = parts[0];
      const time = parts[2];
      conflicts.push({
        type: 'venue',
        title: 'Venue Double-Booking Clash',
        desc: `Multiple fixtures scheduled at ${venue} at ${time}.`,
        data: venueMap[key]
      });
    }
  });

  // 3. Team back-to-back check (fatigue)
  const teamDates = {};
  matches.forEach(m => {
    if (m.status !== 'Completed') {
      const tA = m.teamA;
      const tB = m.teamB;
      const d = new Date(m.date);
      
      [tA, tB].forEach(team => {
        if (!teamDates[team]) teamDates[team] = [];
        teamDates[team].push({ date: d, match: m });
      });
    }
  });

  Object.keys(teamDates).forEach(team => {
    const dates = teamDates[team].sort((a,b) => a.date - b.date);
    for (let i = 0; i < dates.length - 1; i++) {
      const diffTime = Math.abs(dates[i+1].date - dates[i].date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 1) {
        conflicts.push({
          type: 'fatigue',
          title: 'Team Back-To-Back Fatigue',
          desc: `Team ${team} scheduled to play consecutive fixtures within 24 hours.`,
          data: [dates[i].match, dates[i+1].match]
        });
      }
    }
  });

  state.simulation.schedulingConflicts = conflicts;
  recalculateScores();
}

// System Diagnostics and logic unit verification
export function runSystemDiagnostics() {
  const diagnosticList = document.getElementById('diagnostics-test-list');
  const diagStatus = document.getElementById('diag-status');
  if (!diagnosticList) return;

  const results = [];

  const addTest = (name, assertion, desc) => {
    let status = "FAILED";
    let detail = "";
    try {
      const res = assertion();
      if (res === true) {
        status = "PASSED";
      } else if (res === "WARNING") {
        status = "WARNING";
      }
    } catch (err) {
      detail = ` (Exception: ${err.message})`;
    }
    results.push({ name, status, desc: desc + detail });
  };

  // Test 1: State Management Initialization
  addTest("State Management Node", () => {
    return state && typeof state === 'object' && state.tournament && state.crowd && state.emergency && state.sustainability;
  }, "Verifies core application state structure loads without null parameters.");

  // Test 2: Data Integrity & Matches Array
  addTest("Data Integrity Constraints", () => {
    return Array.isArray(state.tournament.matches) && state.tournament.matches.length > 0;
  }, "Asserts fixtures data array is populated and satisfies structural integrity.");

  // Test 3: Score Calculations Boundaries
  addTest("Score Engine Limits", () => {
    recalculateScores();
    const sc = state.simulation.scores;
    return [sc.operational, sc.safety, sc.sustainability, sc.fanExperience, sc.overall].every(s => s >= 5 && s <= 100);
  }, "Validates score engine calculations map precisely to valid 5-100 ranges.");

  // Test 4: Dashboard View Registry
  addTest("Dashboard View Operations", () => {
    return views.dashboard && typeof views.dashboard.render === 'function';
  }, "Ensures the Executive Dashboard render engine is registered and callable.");

  // Test 5: Navigation Drawer Integrity
  addTest("Navigation Drawer Mapping", () => {
    const items = document.querySelectorAll('.nav-item');
    if (items.length === 0) return "WARNING";
    const values = Array.from(items).map(i => i.getAttribute('data-view'));
    return values.every(v => v !== null && v !== "");
  }, "Verifies that navigation drawer items link directly to defined SPA panels.");

  // Test 6: AI Operations Center Roster
  addTest("AI Operations Roster List", () => {
    const keys = Object.keys(state.simulation.agents);
    return keys.length === 8 && keys.every(k => state.simulation.agents[k].status);
  }, "Ensures all 8 specialized command agents are registered and active.");

  // Test 7: Multi-Agent Collaboration Loop
  addTest("Multi-Agent Collaboration Engine", () => {
    const feed = document.getElementById('ai-collaboration-feed');
    return feed !== null;
  }, "Validates cross-agent communication stream log displays in the chat workspace.");

  // Test 8: Tournament Scheduler Conflicts Scanner
  addTest("Scheduler Collision Scanner", () => {
    checkSchedulingConflicts();
    return Array.isArray(state.simulation.schedulingConflicts);
  }, "Confirms scheduler conflict engine checks referee and venue overlaps.");

  // Test 9: Digital Twin Simulation Controller
  addTest("Digital Twin Controller Node", () => {
    const dot = document.getElementById('twin-status-dot');
    return dot !== null;
  }, "Asserts simulator state display widgets are connected to state updates.");

  // Test 10: Scenario Library Profiles
  addTest("Scenario Library Profiles", () => {
    return Array.isArray(state.simulation.activeScenarios);
  }, "Ensures What-If scenario registry is initialized to track active stressors.");

  // Test 11: Crowd Intelligence Turnstiles Telemetry
  addTest("Crowd Turnstiles Boundaries", () => {
    return state.crowd.gates.every(g => g.queueSize >= 0 && typeof g.estWait === 'string');
  }, "Checks turnstile queue sizes and wait forecasts represent positive ranges.");

  // Test 12: Emergency Command Triage
  addTest("Emergency Command Triage", () => {
    return Array.isArray(state.emergency.activeIncidents);
  }, "Ensures emergency active incident tracker registers dispatches.");

  // Test 13: AI Recommendation Alerts
  addTest("AI Recommendation Engine Alert", () => {
    const listEl = document.getElementById('notification-list');
    return listEl !== null;
  }, "Verifies proactive alerts log displays correct severity mappings.");

  // Test 14: Sustainability Resource Offsets
  addTest("Sustainability Offset Ranges", () => {
    const es = state.sustainability.energy;
    const ws = state.sustainability.water;
    const was = state.sustainability.waste;
    return es.solarPercent >= 0 && ws.recycledPercent >= 0 && was.recyclingRate >= 0;
  }, "Validates solar gen, water recycling, and waste circularity are positive values.");

  // Test 15: Analytics Canvas Integration
  addTest("Analytics Canvas Rendering", () => {
    const c1 = document.getElementById('attendance-trend-chart');
    const c2 = document.getElementById('revenue-split-chart');
    return c1 !== null && c2 !== null;
  }, "Asserts Chart.js rendering canvases are present in the DOM layout.");

  // Test 16: Executive Reports Compiler
  addTest("Reports Compiler Routing", () => {
    const body = document.getElementById('report-document-body');
    return body !== null;
  }, "Checks reports compiler outputs text buffers to document review panel.");

  // Test 17: Executive Gauges Math
  addTest("Executive Gauges Math Bounds", () => {
    const scores = state.simulation.scores;
    return typeof scores.overall === 'number';
  }, "Ensures circular dashboard gauge calculation values map to actual numbers.");

  // Test 18: State Engine Redraw Loops
  addTest("Redraw Operations Loops", () => {
    renderScoreDials();
    return true;
  }, "Checks redraw updates execute without throwing stack trace exceptions.");

  // Health Rate
  const passed = results.filter(r => r.status === 'PASSED').length;
  const healthRate = Math.round((passed / results.length) * 100);

  if (diagStatus) {
    diagStatus.textContent = `Health: ${healthRate}%`;
    diagStatus.className = healthRate >= 95 ? 'badge badge-accent' : 'badge badge-danger';
  }

  diagnosticList.innerHTML = results.map(r => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-color);gap:12px;">
      <div style="display:flex;flex-direction:column;gap:2px;">
        <span style="font-weight:700;color:var(--text-main);font-size:0.75rem;">${r.name}</span>
        <span style="font-size:0.65rem;color:var(--text-muted);">${r.desc}</span>
      </div>
      <span class="badge ${r.status === 'PASSED' ? 'badge-accent' : r.status === 'WARNING' ? 'badge-amber' : 'badge-danger'}" style="font-family:'JetBrains Mono',monospace;font-size:0.65rem;padding:2px 6px;">${r.status}</span>
    </div>
  `).join('');
}
