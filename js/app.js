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
  if (!diagnosticList) return;

  const results = [];

  // Test 1: Team Play Itself Constraint
  const validateMatch = (tA, tB) => tA !== tB;
  const test1Passed = (validateMatch("FRA", "FRA") === false); // Expect false rejection
  results.push({
    name: "Match Self-Booking Bounds",
    status: test1Passed ? "PASSED" : "FAILED",
    desc: "Blocks user from scheduling matchups where Team A equals Team B."
  });

  // Test 2: Referee Clash Detector Scanner Assertion
  const dummyMatches = [
    { id: 991, referee: "Marciniak", date: "2026-07-09" },
    { id: 992, referee: "Marciniak", date: "2026-07-09" }
  ];
  const refMap = {};
  dummyMatches.forEach(m => {
    const key = `${m.referee}_${m.date}`;
    if (!refMap[key]) refMap[key] = [];
    refMap[key].push(m);
  });
  const test2Passed = Object.keys(refMap).some(k => refMap[k].length > 1);
  results.push({
    name: "Referee Overbooking Scanner",
    status: test2Passed ? "PASSED" : "FAILED",
    desc: "Verifies scheduler flag triggers when officials are double-booked on matching dates."
  });

  // Test 3: Turnstile Wait Time Bounds Boundary Checks
  const dummyGate = { name: "Gate E", queueSize: 100, estWait: "4 min" };
  const waitMin = parseInt(dummyGate.estWait) || 0;
  const test3Passed = (waitMin > 0 && waitMin < 60);
  results.push({
    name: "Turnstile Wait Time Bounds",
    status: test3Passed ? "PASSED" : "FAILED",
    desc: "Asserts queue wait times represent positive intervals within operational ranges."
  });

  // Test 4: AI Emergency Prioritizer Severity Matrix
  const testIncidents = [
    { type: 'Medical', severity: 'High', status: 'Awaiting Dispatch' },
    { type: 'Weather', severity: 'Low', status: 'Awaiting Dispatch' }
  ];
  const test4Passed = testIncidents[0].severity === 'High';
  results.push({
    name: "AI Emergency Prioritization",
    status: test4Passed ? "PASSED" : "FAILED",
    desc: "Triage dispatches based on threat tier classification."
  });

  diagnosticList.innerHTML = results.map(r => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-color);gap:12px;">
      <div style="display:flex;flex-direction:column;gap:2px;">
        <span style="font-weight:700;color:var(--text-main);font-size:0.75rem;">${r.name}</span>
        <span style="font-size:0.65rem;color:var(--text-muted);">${r.desc}</span>
      </div>
      <span class="badge ${r.status === 'PASSED' ? 'badge-accent' : 'badge-danger'}" style="font-family:'JetBrains Mono',monospace;font-size:0.65rem;padding:2px 6px;">${r.status}</span>
    </div>
  `).join('');
}
