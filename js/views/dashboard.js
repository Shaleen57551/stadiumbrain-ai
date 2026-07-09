// Dashboard View Module - StadiumBrain AI
import { switchView, triggerNotification, recalculateScores, renderScoreDials, checkSchedulingConflicts } from '../app.js';

let appState = null;

export function init(state) {
  appState = state;

  // Bind Quick Actions buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.action-btn');
    if (btn) {
      const action = btn.getAttribute('data-action');
      handleQuickAction(action, appState);
    }
  });

  // Bind What-If Simulator Buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.what-if-btn');
    if (btn) {
      const scenario = btn.getAttribute('data-scenario');
      handleToggleScenario(scenario);
    }
  });

  // Reset simulator
  const btnReset = document.getElementById('btn-reset-simulator');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      handleResetSimulation();
    });
  }

  // Checklist interactions
  const checklist = document.getElementById('dash-checklist');
  if (checklist) {
    checklist.addEventListener('change', (e) => {
      const chk = e.target;
      if (chk.checked) {
        const item = chk.closest('.checklist-item');
        const timeEl = item.querySelector('.chk-time');
        if (timeEl && timeEl.textContent === 'Pending') {
          const now = new Date();
          timeEl.textContent = now.toTimeString().substring(0, 5);
        }
      }
    });
  }
}

export function render(state) {
  appState = state;

  renderStats(state);
  renderTodayMatches(state);
  renderWhatIfPanel();
  renderAiSuggestions(state);
  
  // Render score dials
  renderScoreDials();
}

function renderStats(state) {
  // Attendance Summary
  const attendanceVal = document.getElementById('dash-attendance-val');
  if (attendanceVal) {
    const liveMatches = state.tournament.matches.filter(m => m.status === 'Live');
    const isSurge = state.simulation.activeScenarios.includes('surge');
    
    if (isSurge) {
      attendanceVal.textContent = "89,450 / 72,000";
    } else if (liveMatches.length > 0) {
      attendanceVal.textContent = "68,420 / 72,000";
    } else {
      attendanceVal.textContent = "0 / 72,000";
    }
  }

  // Operational status
  const opVal = document.getElementById('dash-operational-val');
  if (opVal) {
    if (state.drillActive) {
      opVal.textContent = "SIM DRILL RUNNING";
      opVal.style.color = "var(--danger)";
    } else if (state.simulation.activeScenarios.includes('power')) {
      opVal.textContent = "AUX POWER BACKUP";
      opVal.style.color = "var(--warning)";
    } else {
      opVal.textContent = "Normal";
      opVal.style.color = "var(--success)";
    }
  }

  // Countdown timer
  const countdownVal = document.getElementById('dash-countdown-val');
  const nextMatchLabel = document.getElementById('dash-next-match-label');
  if (countdownVal && nextMatchLabel) {
    const schedMatches = state.tournament.matches.filter(m => m.status === 'Scheduled');
    if (schedMatches.length > 0) {
      nextMatchLabel.textContent = `${schedMatches[0].teamA} vs ${schedMatches[0].teamB}`;
      countdownVal.textContent = "01h 45m";
    } else {
      nextMatchLabel.textContent = "No Upcoming Matches";
      countdownVal.textContent = "--h --m";
    }
  }

  // Weather Card
  const weatherVal = document.getElementById('dash-weather-val');
  const weatherIconContainer = document.getElementById('dash-weather-icon-container');
  const humidityVal = document.getElementById('dash-humidity-val');
  if (weatherVal && humidityVal && weatherIconContainer) {
    const isRain = state.simulation.activeScenarios.includes('rain');
    if (isRain) {
      weatherVal.textContent = "16°C / Heavy Rain";
      humidityVal.textContent = "Humidity 95% | Wind 28km/h";
      weatherIconContainer.innerHTML = '<i data-lucide="cloud-rain"></i>';
      weatherIconContainer.className = "stat-icon-wrapper blue";
    } else {
      weatherVal.textContent = "24°C / Sunny";
      humidityVal.textContent = "Humidity 55% | Wind 12km/h";
      weatherIconContainer.innerHTML = '<i data-lucide="sun"></i>';
      weatherIconContainer.className = "stat-icon-wrapper amber";
    }
    lucide.createIcons();
  }
}

function renderTodayMatches(state) {
  const matchesList = document.getElementById('dash-matches-list');
  if (!matchesList) return;

  const matches = state.tournament.matches;
  if (matches.length === 0) {
    matchesList.innerHTML = '<div class="text-muted text-center py-4">No matches scheduled for today.</div>';
    return;
  }

  matchesList.innerHTML = matches.map(match => {
    const teamAObj = state.tournament.teams.find(t => t.id === match.teamA) || { badge: '🏳️', name: match.teamA };
    const teamBObj = state.tournament.teams.find(t => t.id === match.teamB) || { badge: '🏳️', name: match.teamB };

    return `
      <div class="match-card">
        <div class="match-card-teams">
          <div class="team-info">
            <span class="team-badge">${teamAObj.badge}</span>
            <span>${teamAObj.name}</span>
          </div>
          <span class="match-vs">vs</span>
          <div class="team-info">
            <span class="team-badge">${teamBObj.badge}</span>
            <span>${teamBObj.name}</span>
          </div>
        </div>
        <div class="match-card-details">
          <span class="match-time-tag">${match.time}</span>
          <span class="match-venue-tag">${match.venue}</span>
          <span class="match-status-pill ${match.status.toLowerCase()}">${match.status}</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderWhatIfPanel() {
  const activeScenarios = appState.simulation.activeScenarios;
  const buttons = document.querySelectorAll('.what-if-btn');
  
  buttons.forEach(btn => {
    const scenario = btn.getAttribute('data-scenario');
    if (activeScenarios.includes(scenario)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update Status row text
  const statusDot = document.getElementById('twin-status-dot');
  const statusText = document.getElementById('twin-status-text');
  if (statusText && statusDot) {
    if (activeScenarios.length > 0) {
      statusText.innerHTML = `Active Twin: **${activeScenarios.length} Scenarios running**`;
      statusDot.className = "pulse-dot";
      statusDot.style.backgroundColor = "var(--danger)";
    } else {
      statusText.innerHTML = `Active Twin Status: **Optimal Operations**`;
      statusDot.className = "pulse-dot";
      statusDot.style.backgroundColor = "var(--success)";
    }
  }
}

function renderAiSuggestions(state) {
  const ticker = document.getElementById('dash-ai-ticker');
  if (!ticker) return;

  const suggestions = [];

  // Proactive recommendations based on state
  const sc = state.simulation.activeScenarios;
  const congestedGates = state.crowd.gates.filter(g => g.status === 'Congested');
  const conflicts = state.simulation.schedulingConflicts;

  if (sc.includes('power')) {
    suggestions.push({
      type: 'danger',
      category: 'Power Grid Failure',
      text: 'Main grid power feed disconnected. AI recommends engaging auxiliary solar battery arrays to sustain full stadium lighting.',
      actionType: 'mitigate-power',
      why: 'Main power transformer lost grid connection during heavy spectator draw.',
      impact: 'Stabilizes electrical load across pitch lighting and turnstile security checkpoints.',
      agents: 'Energy Agent, Security Commander, Incident Coordinator',
      benefit: 'Maintains 100% broadcast power continuity and gate scanner uptime.',
      risk: 'Reduces power outage safety risks and crowd panic in dark concourse spaces by 99%.',
      outcome: 'Grid stays online with zero downtime or match postponement.'
    });
  }

  if (sc.includes('rain')) {
    suggestions.push({
      type: 'warning',
      category: 'Weather Impact',
      text: 'Heavy rain causing high parking transit bottlenecks. AI recommends increasing Light Rail capacity and deploying post-match shuttles.',
      actionType: 'mitigate-rain',
      why: 'High precipitation rate reduces road transit speeds by 40% and increases parking plaza delays.',
      impact: 'Balances transportation loads and diverts spectators from road choke points to high-capacity rail lines.',
      agents: 'Transit Director, Logistics Planner, Fan Experience Agent',
      benefit: 'Evacuates post-match concourses faster, boosting fan comfort metrics.',
      risk: 'Minimizes highway fender-benders and pedestrian queuing congestion in rainy plazas.',
      outcome: 'Reduces overall stadium egress bottleneck duration by 22 minutes.'
    });
  }

  if (congestedGates.length > 0) {
    suggestions.push({
      type: 'danger',
      category: 'Crowd Congestion',
      text: `${congestedGates.map(g=>g.name).join(', ')} turnstile wait time excessive. AI recommends immediate Turnstile Redistribution routing.`,
      actionType: 'mitigate-gates',
      why: 'Arrival rate exceeds maximum throughput capacity at Gate E turnstile plazas.',
      impact: 'Redistributes pending queue load to adjacent underutilized entry points (Gates C & D).',
      agents: 'Crowd Intelligence Agent, Safety Commander, Transit Director',
      benefit: 'Balances pedestrian distribution and optimizes gate throughput.',
      risk: 'Mitigates stampede risks, queue bottlenecks, and concourse overcrowding.',
      outcome: 'Drops turnstile wait times from 45 min to under 5 min.'
    });
  }

  if (conflicts.length > 0) {
    suggestions.push({
      type: 'warning',
      category: 'Scheduling Conflict',
      text: `AI detected ${conflicts.length} tournament scheduling clashes. Click to run AI Schedule Optimization rules.`,
      actionType: 'optimize-schedule',
      why: 'Referees, venues, or player rest times have overlapping match bookings in the fixture calendar.',
      impact: 'Reallocates referees and shifts kick-off slots to guarantee FIFA-compliant rest offsets.',
      agents: 'Tournament Scheduler, Operations Lead, Director AI',
      benefit: 'Clears all match booking overlaps automatically in the database.',
      risk: 'Eliminates human booking errors and referee scheduling collision risks.',
      outcome: 'All teams get a minimum 48 hours of recovery time with clean venue rosters.'
    });
  }

  // Fallback default suggestions
  if (suggestions.length === 0) {
    suggestions.push(
      {
        type: 'info',
        category: 'Sustainability',
        text: 'Peak solar generation (340 kWh) exceeds stadium draw. Diverting surplus feed to regional utility offset grid.',
        actionType: 'none',
        why: 'Solar irradiation peaked during low-draw pre-game hours, filling battery banks.',
        impact: 'Offsets municipal carbon credits by injecting renewable energy back into the city power grid.',
        agents: 'Sustainability Officer, Energy Agent, Director AI',
        benefit: 'Accrues energy offset credits and reduces fossil fuel intake.',
        risk: 'Reduces reliance on city coal power plants during peak hour grid loads.',
        outcome: 'Saves stadium energy costs and offsets gross footprint by 1.2 tCO2e.'
      },
      {
        type: 'info',
        category: 'Accessibility',
        text: 'Elevator 2 West offline. AI recommends posting wheelchair stewards at Entrance West and activating visual audio guides.',
        actionType: 'none',
        why: 'Mechanical alert triggered elevator service lockout.',
        impact: 'Provides assisted transit detours for mobility-impaired spectators.',
        agents: 'Accessibility Steward, Operations Lead, Fan Experience Agent',
        benefit: 'Maintains continuous ADA/FIFA tournament accessibility guidelines compliance.',
        risk: 'Avoids wheelchair traffic blockages in main stairwell lobbies.',
        outcome: 'All spectators reach their seats comfortably within standard arrival durations.'
      }
    );
  }

  ticker.innerHTML = suggestions.map((s, idx) => `
    <div class="ai-ticker-item ${s.type}" style="padding:14px;display:flex;flex-direction:column;gap:8px;">
      <div class="ticker-meta">
        <span class="text-accent" style="font-weight:700;font-size:0.8rem;">${s.category}</span>
        <span class="ticker-time" style="font-size:0.65rem;color:var(--text-muted);">AI Recommended</span>
      </div>
      <div class="ticker-text" style="font-size:0.75rem;line-height:1.4;margin:4px 0;">${s.text}</div>
      
      <div class="ticker-justification" style="background:rgba(255,255,255,0.05);padding:8px;border-radius:6px;font-size:0.7rem;display:flex;flex-direction:column;gap:4px;border-left:2px solid var(--accent);">
        <div><strong>Rationale (Why):</strong> ${s.why}</div>
        <div><strong>Expected Impact:</strong> ${s.impact}</div>
        <div><strong>Affected AI Agents:</strong> ${s.agents}</div>
        <div><strong>Operational Benefit:</strong> ${s.benefit}</div>
        <div><strong>Risk Reduction:</strong> ${s.risk}</div>
        <div><strong>Expected Outcome:</strong> ${s.outcome}</div>
      </div>

      <div class="ticker-actions" style="margin-top:4px;">
        ${s.actionType !== 'none' ? `
          <button class="btn btn-primary btn-sm apply-mitigation-btn" data-action="${s.actionType}" style="padding:4px 8px;font-size:0.7rem;">
            <i data-lucide="sparkles" style="width:12px;height:12px;"></i> Apply Decision
          </button>
        ` : `
          <button class="ticker-apply-btn view-suggest-btn" data-view-target="sustainability" style="padding:4px 8px;font-size:0.7rem;">
            Details <i data-lucide="arrow-right" style="width:12px;height:12px;"></i>
          </button>
        `}
      </div>
    </div>
  `).join('');

  // Bind apply action buttons
  const applyBtns = ticker.querySelectorAll('.apply-mitigation-btn');
  applyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = btn.getAttribute('data-action');
      handleApplyMitigation(action);
    });
  });

  lucide.createIcons();
}

function handleToggleScenario(scenario) {
  const active = appState.simulation.activeScenarios;
  const idx = active.indexOf(scenario);

  const now = new Date();
  const timeStr = now.toTimeString().substring(0, 5);

  if (idx === -1) {
    active.push(scenario);

    // Apply immediate operational effect on data
    if (scenario === 'rain') {
      triggerNotification({ id: Date.now(), severity: 'warning', title: 'Severe Rain Forecasted', desc: 'Precipitation index 95%. Solar generation dropping by 40%.', time: timeStr });
    } else if (scenario === 'surge') {
      appState.crowd.gates.forEach(g => {
        if (g.status !== 'Closed') {
          g.queueSize += 400;
          g.estWait = '25 min';
        }
      });
      triggerNotification({ id: Date.now(), severity: 'warning', title: 'Attendance Surge (+30%)', desc: 'Spectator queues compacting. Congestion alarms triggered.', time: timeStr });
    } else if (scenario === 'power') {
      appState.sustainability.energy.solarPercent = 100; // Batteries 100% engaged
      appState.sustainability.energy.gridIntake = 0; // Grid down
      
      appState.emergency.activeIncidents.unshift({
        id: Date.now(),
        type: 'Infrastructure',
        location: 'Stadium Grid Transformer',
        severity: 'High',
        description: 'Main municipal power grid failure. Auxiliary storage batteries active.',
        time: timeStr,
        status: 'Backup Engaged'
      });
      triggerNotification({ id: Date.now(), severity: 'danger', title: 'Power Grid Outage', desc: 'Critical electrical failure. Backup solar batteries active.', time: timeStr });
    } else if (scenario === 'transit_delay') {
      const gateE = appState.crowd.gates.find(g => g.name === 'Gate E');
      if (gateE) {
        gateE.status = 'Congested';
        gateE.queueSize = 980;
        gateE.estWait = '45 min';
      }
      appState.crowd.alerts.push({
        id: Date.now(),
        gate: 'Gate E',
        severity: 'High',
        message: 'Highway transit delays. Heavy bus backup congestion.',
        active: true
      });
      triggerNotification({ id: Date.now(), severity: 'danger', title: 'Transit Link Delay', desc: 'Highway bottleneck backing up turnstile vectors.', time: timeStr });
    } else if (scenario === 'medical') {
      appState.emergency.activeIncidents.unshift({
        id: Date.now(),
        type: 'Medical',
        location: 'Zone B Concourse Row 8',
        severity: 'High',
        description: 'Spectator syncopal response. Medical responders dispatched.',
        time: timeStr,
        status: 'Responding'
      });
      triggerNotification({ id: Date.now(), severity: 'warning', title: 'Zone B Medical Incident', desc: 'Critical dispatch coordinate transmitted.', time: timeStr });
    } else if (scenario === 'security') {
      appState.emergency.activeIncidents.unshift({
        id: Date.now(),
        type: 'Security',
        location: 'Zone D Stands Sector 4',
        severity: 'High',
        description: 'Supporter altercations near aisleway. Police unit deployed.',
        time: timeStr,
        status: 'Responding'
      });
      triggerNotification({ id: Date.now(), severity: 'danger', title: 'Stands Security Threat', desc: 'Crowd control officers deployed to Zone D.', time: timeStr });
    } else if (scenario === 'vip') {
      appState.emergency.activeIncidents.unshift({
        id: Date.now(),
        type: 'Security',
        location: 'VIP Entrance Concourse',
        severity: 'Low',
        description: 'VIP Delegation motorcade arrival. Securing route access grids.',
        time: timeStr,
        status: 'On Scene'
      });
      triggerNotification({ id: Date.now(), severity: 'info', title: 'VIP Delegation Arrival', desc: 'Central motorcade entering zone perimeter lanes.', time: timeStr });
    }
  } else {
    active.splice(idx, 1);
    
    // Resolve effects
    if (scenario === 'power') {
      appState.sustainability.energy.solarPercent = 75;
      appState.sustainability.energy.gridIntake = 113;
      // Resolve power incidents
      appState.emergency.activeIncidents = appState.emergency.activeIncidents.filter(inc => inc.type !== 'Infrastructure');
    } else if (scenario === 'transit_delay') {
      const gateE = appState.crowd.gates.find(g => g.name === 'Gate E');
      if (gateE) {
        gateE.status = 'Open';
        gateE.queueSize = 120;
        gateE.estWait = '4 min';
      }
      appState.crowd.alerts = appState.crowd.alerts.filter(a => a.gate !== 'Gate E');
    } else if (scenario === 'vip') {
      appState.emergency.activeIncidents = appState.emergency.activeIncidents.filter(inc => inc.location !== 'VIP Entrance Concourse');
    }
  }

  // Update State, Recalculate
  recalculateScores();
  render(appState);
}

function handleResetSimulation() {
  appState.simulation.activeScenarios = [];
  
  // Clear mock congestions
  appState.crowd.gates.forEach(g => {
    if (g.name === 'Gate B' || g.name === 'Gate E') {
      g.status = 'Congested';
      g.queueSize = g.name === 'Gate E' ? 680 : 450;
      g.estWait = g.name === 'Gate E' ? '28 min' : '18 min';
    } else if (g.name === 'Gate F') {
      g.status = 'Closed';
      g.queueSize = 0;
      g.estWait = '0 min';
    } else {
      g.status = 'Open';
      g.queueSize = 90;
      g.estWait = '3 min';
    }
  });

  // Restore energy
  appState.sustainability.energy.solarPercent = 75;
  appState.sustainability.energy.gridIntake = 113;

  // Clear incidents
  appState.emergency.activeIncidents = [
    { id: 301, type: "Medical", location: "Gate E - Plaza Outer", severity: "High", description: "Heat exhaustion and syncopal episode. Awaiting dispatch.", time: "16:40", status: "Awaiting Dispatch" },
    { id: 302, type: "Security", location: "Zone B - Concourse Level 2", severity: "Medium", description: "Minor altercations between supporters. Security team on route.", time: "16:48", status: "Responding" }
  ];

  triggerNotification({
    id: Date.now(),
    severity: 'info',
    title: 'Simulator Twin Reset',
    desc: 'Stadium parameters restored to default live tournament baselines.',
    time: 'Just now'
  });

  recalculateScores();
  render(appState);
}

function handleApplyMitigation(action) {
  const now = new Date();
  const timeStr = now.toTimeString().substring(0, 5);

  if (action === 'mitigate-power') {
    appState.emergency.activeIncidents.forEach(inc => {
      if (inc.type === 'Infrastructure') inc.status = 'Resolved';
    });
    // Remove grid outage from simulator
    appState.simulation.activeScenarios = appState.simulation.activeScenarios.filter(s => s !== 'power');
    appState.sustainability.energy.solarPercent = 85;
    appState.sustainability.energy.gridIntake = 50; // Partial intake restored

    triggerNotification({
      id: Date.now(),
      severity: 'success',
      title: 'Power Restored',
      desc: 'AI mitigated grid collapse. Solar power routing fully operational.',
      time: timeStr
    });
  } else if (action === 'mitigate-rain') {
    appState.simulation.activeScenarios = appState.simulation.activeScenarios.filter(s => s !== 'rain');
    triggerNotification({
      id: Date.now(),
      severity: 'success',
      title: 'Transit Plan Engaged',
      desc: 'Transit rail capacity boosted. Shuttles cleared stands parking load.',
      time: timeStr
    });
  } else if (action === 'mitigate-gates') {
    appState.crowd.gates.forEach(g => {
      if (g.status === 'Congested') {
        g.status = 'Open';
        g.queueSize = 80;
        g.estWait = '3 min';
      }
    });
    appState.simulation.activeScenarios = appState.simulation.activeScenarios.filter(s => s !== 'transit_delay');
    appState.crowd.alerts = [];

    triggerNotification({
      id: Date.now(),
      severity: 'success',
      title: 'Turnstiles Redeployed',
      desc: 'Congested gates balanced. Spectator wait times reduced to 3 mins.',
      time: timeStr
    });
  } else if (action === 'optimize-schedule') {
    // Call Optimizer in tournament manager
    switchView('tournament');
    const optimizeBtn = document.getElementById('btn-auto-optimize-schedule');
    if (optimizeBtn) optimizeBtn.click();
    return;
  }

  recalculateScores();
  render(appState);
}

function handleQuickAction(action, state) {
  switch (action) {
    case 'emergency-drill':
      state.drillActive = true;
      triggerNotification({
        id: Date.now(),
        severity: 'danger',
        title: 'Emergency Drill Activated',
        desc: 'Standard crisis response parameters running in simulator mode.',
        time: '16:52'
      });
      switchView('emergency');
      break;

    case 'broadcast-announcement':
      alert("Executive Stadium Broadcast Announcement Triggered: 'All turnstiles fully operating. Please check your mobile app for designated entrances.'");
      break;

    case 'open-gates':
      state.crowd.gates.forEach(g => {
        if (g.name !== 'Gate F') {
          g.status = 'Open';
          g.queueSize = Math.max(10, g.queueSize - 50);
          g.estWait = '2 min';
        }
      });
      triggerNotification({
        id: Date.now(),
        severity: 'info',
        title: 'Gates Override Active',
        desc: 'All turnstiles set to maximum throughput override.',
        time: '16:53'
      });
      switchView('crowd');
      break;

    case 'reallocate-buses':
      state.crowd.gates.forEach(g => {
        if (g.name === 'Gate E' || g.name === 'Gate B') {
          g.queueSize = Math.max(20, g.queueSize - 200);
          g.status = 'Open';
          g.estWait = '5 min';
        }
      });
      triggerNotification({
        id: Date.now(),
        severity: 'info',
        title: 'Shuttle Buses Diverted',
        desc: 'Transit plazas redirected to balance underutilized Gate C & D capacities.',
        time: '16:54'
      });
      switchView('crowd');
      break;
  }
}
