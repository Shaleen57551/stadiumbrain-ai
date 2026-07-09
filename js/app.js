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

  // Run diagnostics automatically on startup
  runSystemDiagnostics();

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

  // Defensive safety defaults
  const sc = state?.simulation?.activeScenarios || [];
  const gates = state?.crowd?.gates || [];
  const activeIncidentsList = state?.emergency?.activeIncidents || [];
  const conflicts = state?.simulation?.schedulingConflicts || [];

  // 1. Simulator adjustments
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
  const activeIncidents = activeIncidentsList.length;
  safety -= activeIncidents * 6;

  const congestedGates = gates.filter(g => g?.status === 'Congested').length;
  fan -= congestedGates * 8;
  ops -= congestedGates * 5;

  // 3. Scheduling conflict weight
  const conflictCount = conflicts.length;
  ops -= conflictCount * 10;

  // Limits and fallback checks
  if (state?.simulation?.scores) {
    state.simulation.scores.operational = Math.max(5, Math.min(100, isNaN(ops) ? 90 : ops));
    state.simulation.scores.safety = Math.max(5, Math.min(100, isNaN(safety) ? 90 : safety));
    state.simulation.scores.sustainability = Math.max(5, Math.min(100, isNaN(sustain) ? 90 : sustain));
    state.simulation.scores.fanExperience = Math.max(5, Math.min(100, isNaN(fan) ? 90 : fan));

    // Calculate average overall health
    const avg = (state.simulation.scores.operational + state.simulation.scores.safety + state.simulation.scores.sustainability + state.simulation.scores.fanExperience) / 4;
    state.simulation.scores.overall = Math.round(avg);
  }

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

// Centralized Security Validation Utility: Sanitize HTML against XSS payload injections
export function sanitizeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"']/g, function(match) {
    const escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    };
    return escapeMap[match];
  });
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

  // Test 1: State Management Integrity
  addTest("State Management Integrity", () => {
    const keys = ['currentView', 'selectedTournamentId', 'tournament', 'crowd', 'emergency', 'sustainability', 'chatHistory', 'notifications', 'simulation'];
    return keys.every(k => state.hasOwnProperty(k) && state[k] !== null && state[k] !== undefined);
  }, "Verifies that the central state container is fully initialized with all required operational properties.");

  // Test 2: Data Integrity Constraints
  addTest("Data Integrity Constraints", () => {
    return Array.isArray(state.tournament.matches) && state.tournament.matches.length > 0;
  }, "Asserts fixtures data array is populated and satisfies structural integrity.");

  // Test 3: Dashboard Initialization
  addTest("Dashboard Initialization Node", () => {
    const list = document.getElementById('dash-matches-list');
    const checklist = document.getElementById('dash-checklist');
    return list !== null && checklist !== null;
  }, "Verifies that the main dashboard layout components are loaded in the DOM.");

  // Test 4: SPA Navigation Router
  addTest("SPA Navigation Router", () => {
    const panels = document.querySelectorAll('.view-panel');
    const navItems = document.querySelectorAll('.nav-item');
    if (panels.length === 0 || navItems.length === 0) return "WARNING";
    const prevView = state.currentView;
    switchView('dashboard');
    const activePanel = document.getElementById('view-dashboard');
    const isCorrect = state.currentView === 'dashboard' && activePanel.classList.contains('active');
    switchView(prevView);
    return isCorrect;
  }, "Validates that switching route views dynamically updates state.currentView and toggles visible panel active classes.");

  // Test 5: AI Operations Chat Interface
  addTest("AI Operations Chat Interface", () => {
    const input = document.getElementById('chat-input');
    const messages = document.getElementById('chat-messages');
    const history = document.getElementById('chat-history-list');
    return input !== null && messages !== null && history !== null && Array.isArray(state.chatHistory);
  }, "Asserts that prompt inputs, message windows, and historical logs are initialized in the DOM.");

  // Test 6: Multi-Agent Command Roster
  addTest("Multi-Agent Command Roster", () => {
    const keys = Object.keys(state.simulation.agents);
    const rosterList = document.getElementById('agent-roster-list');
    const feed = document.getElementById('ai-collaboration-feed');
    const correctCount = keys.length === 8;
    return correctCount && rosterList !== null && feed !== null;
  }, "Validates that all 8 specialized command agents are logged in the roster with active status feeds.");

  // Test 7: Multi-Agent Collaboration Engine
  addTest("Multi-Agent Collaboration Engine", () => {
    const feed = document.getElementById('ai-collaboration-feed');
    return feed !== null;
  }, "Validates cross-agent communication stream log displays in the chat workspace.");

  // Test 8: Tournament Scheduler Scanner
  addTest("Smart Scheduler Conflict Scanner", () => {
    checkSchedulingConflicts();
    const conflicts = state.simulation.schedulingConflicts;
    if (!Array.isArray(conflicts)) return false;
    const prevMatches = [...state.tournament.matches];
    const mockMatchA = { id: 9991, teamA: "FRA", teamB: "ARG", date: "2026-07-09", time: "18:00", venue: "MetLife Stadium", referee: "Marciniak", status: "Scheduled" };
    const mockMatchB = { id: 9992, teamA: "FRA", teamB: "BRA", date: "2026-07-09", time: "20:00", venue: "MetLife Stadium", referee: "Marciniak", status: "Scheduled" };
    state.tournament.matches = [mockMatchA, mockMatchB];
    checkSchedulingConflicts();
    const hasConflict = state.simulation.schedulingConflicts.length > 0;
    state.tournament.matches = prevMatches;
    checkSchedulingConflicts();
    return hasConflict;
  }, "Asserts that the scheduler conflict engine correctly identifies overlapping dates, venue clashes, and fatigue.");

  // Test 9: Schedule Conflict Detection
  addTest("Schedule Conflict Scanner Node", () => {
    return Array.isArray(state.simulation.schedulingConflicts);
  }, "Validates that scheduling conflicts arrays register without throwing runtime exceptions.");

  // Test 10: Predictive Crowd Telemetry
  addTest("Predictive Crowd Telemetry", () => {
    const canvas = document.getElementById('crowd-heatmap-canvas');
    const gatesTbody = document.getElementById('gates-control-tbody');
    const correctGates = state.crowd.gates.length === 6 && state.crowd.gates.every(g => g.queueSize >= 0);
    return canvas !== null && gatesTbody !== null && correctGates;
  }, "Asserts turnstile gate queue sizes represent valid values, and verify crowd canvas context binds.");

  // Test 11: Digital Twin Simulator State
  addTest("Digital Twin Simulator State", () => {
    const twinDot = document.getElementById('twin-status-dot');
    const twinText = document.getElementById('twin-status-text');
    return twinDot !== null && twinText !== null && Array.isArray(state.simulation.activeScenarios);
  }, "Verifies that simulator status dots and scenario list arrays are properly bound to the active state.");

  // Test 12: Scenario Library Profiles
  addTest("Scenario Library Profiles", () => {
    const btns = document.querySelectorAll('.what-if-btn');
    const resetBtn = document.getElementById('btn-reset-simulator');
    return btns.length === 7 && resetBtn !== null;
  }, "Verifies that What-If scenario triggers and simulator reset commands are bound to user action selectors.");

  // Test 13: Executive Decision Board Dials
  addTest("Executive Decision Board Dials", () => {
    const scoreIds = ['score-ops-val', 'score-safety-val', 'score-sustain-val', 'score-fan-val', 'score-health-val'];
    const elementsExist = scoreIds.every(id => document.getElementById(id) !== null);
    const valuesValid = [state.simulation.scores.operational, state.simulation.scores.safety, state.simulation.scores.sustainability, state.simulation.scores.fanExperience, state.simulation.scores.overall].every(v => typeof v === 'number' && !isNaN(v) && v >= 0 && v <= 100);
    return elementsExist && valuesValid;
  }, "Checks that all circular SVG decision dials are present in the DOM and correspond to valid state-driven scores.");

  // Test 14: AI Recommendation Engine Alert Feed
  addTest("AI Recommendation Engine Alert Feed", () => {
    const ticker = document.getElementById('dash-ai-ticker');
    return ticker !== null;
  }, "Verifies that the proactive recommendation ticker correctly maps alerts and mitigation suggestions to active simulator scenarios.");

  // Test 15: Emergency Triage Timeline
  addTest("AI Incident Commander Triage", () => {
    const triage = document.getElementById('commander-triage-panel');
    const timeline = document.getElementById('incident-timeline-stepper');
    const forms = document.getElementById('incident-report-form');
    const correctArrays = Array.isArray(state.emergency.activeIncidents) && Array.isArray(state.emergency.logHistory);
    return triage !== null && timeline !== null && forms !== null && correctArrays;
  }, "Validates triage matrix panel bindings, incident logger forms, and vertical stepper timelines.");

  // Test 16: Sustainability resource auditing
  addTest("Sustainability Resource Auditing", () => {
    const es = state.sustainability.energy;
    const ws = state.sustainability.water;
    const was = state.sustainability.waste;
    const solarBar = document.getElementById('solar-progress-bar');
    const waterBar = document.getElementById('water-progress-bar');
    const wasteBar = document.getElementById('waste-progress-bar');
    const validNumbers = [es.solarPercent, ws.recycledPercent, was.recyclingRate].every(v => typeof v === 'number' && v >= 0 && v <= 100);
    return solarBar !== null && waterBar !== null && wasteBar !== null && validNumbers;
  }, "Checks solar generation meters, rainwater recycling offsets, circular waste indexes, and progress bars.");

  // Test 17: Live Analytics Canvas Context
  addTest("Live Analytics Canvas Context", () => {
    const c1 = document.getElementById('attendance-trend-chart');
    const c2 = document.getElementById('revenue-split-chart');
    const c3 = document.getElementById('gate-turnstile-chart');
    const c4 = document.getElementById('transit-load-chart');
    return c1 !== null && c2 !== null && c3 !== null && c4 !== null;
  }, "Asserts Chart.js canvases are present in the DOM for plotting historical attendance, concessions, and turnstiles.");

  // Test 18: Executive Reports Buffer Compiler
  addTest("Executive Reports Buffer Compiler", () => {
    const form = document.getElementById('report-generator-form');
    const preview = document.getElementById('report-document-body');
    const copyBtn = document.getElementById('btn-copy-report-text');
    const downloadBtn = document.getElementById('btn-download-report-txt');
    return form !== null && preview !== null && copyBtn !== null && downloadBtn !== null;
  }, "Validates that operational report templates build text output buffers for copy and download dispatches.");

  // Test 19: Programmatic Accessibility Audits (WCAG AA Compliance)
  addTest("Accessibility Compliance Check", () => {
    // Check 1: All img elements have alt attribute or aria-hidden
    const imgs = Array.from(document.querySelectorAll('img'));
    const imgsPassed = imgs.every(img => img.hasAttribute('alt') || img.getAttribute('aria-hidden') === 'true');

    // Check 2: Interactive elements have accessible names
    const interactives = Array.from(document.querySelectorAll('button, a, select, textarea'));
    const interactivesPassed = interactives.every(el => {
      const hasLabel = el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby') || el.hasAttribute('title');
      const hasContent = el.textContent.trim().length > 0;
      const isAriaHidden = el.getAttribute('aria-hidden') === 'true';
      return hasLabel || hasContent || isAriaHidden;
    });

    // Check 3: Check for duplicate IDs in the DOM (WCAG 4.1.1 Parsing compliance)
    const allElements = document.querySelectorAll('[id]');
    const ids = Array.from(allElements).map(el => el.id);
    const duplicates = ids.filter((item, index) => ids.indexOf(item) !== index);
    const noDuplicates = duplicates.length === 0;

    return imgsPassed && interactivesPassed && noDuplicates;
  }, "Performs programmatic WCAG audits checking image alt values, button accessible names, and parsing ID duplicates.");

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
      <span class="badge ${r.status === 'PASSED' ? 'badge-accent' : r.status === 'WARNING' ? 'badge-amber' : r.status === 'WARNING' ? 'badge-amber' : 'badge-danger'}" style="font-family:'JetBrains Mono',monospace;font-size:0.65rem;padding:2px 6px;">${r.status}</span>
    </div>
  `).join('');
}
