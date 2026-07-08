// Emergency Command Center View Module - StadiumBrain AI
import { triggerNotification, recalculateScores } from '../app.js';

let appState = null;

export function init(state) {
  appState = state;

  // Form submit
  const form = document.getElementById('incident-report-form');
  if (form) {
    form.addEventListener('submit', handleLogIncident);
  }

  // Deactivate drill button
  const btnDeactivate = document.getElementById('btn-deactivate-drill');
  if (btnDeactivate) {
    btnDeactivate.addEventListener('click', () => {
      appState.drillActive = false;
      renderActiveDrillBanner();
      recalculateScores();
    });
  }

  // Dispatch Action Button Listener
  const dispatchGrid = document.querySelector('.emergency-dispatch-buttons');
  if (dispatchGrid) {
    dispatchGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.dispatch-btn');
      if (btn) {
        const unit = btn.getAttribute('data-unit');
        handleDispatchUnit(unit);
      }
    });
  }

  // Handle timeline actions (resolve, dispatch progress)
  const timelineStepper = document.getElementById('incident-timeline-stepper');
  if (timelineStepper) {
    timelineStepper.addEventListener('click', (e) => {
      const btn = e.target.closest('.timeline-action-btn');
      if (btn) {
        const incId = parseInt(btn.getAttribute('data-inc-id'));
        const nextStatus = btn.getAttribute('data-next-status');
        handleProgressIncident(incId, nextStatus);
      }
    });
  }
}

export function render(state) {
  appState = state;

  renderActiveDrillBanner();
  renderIncidentTimeline();
  renderTriageMatrix();
  drawEvacMapOutline();
}

function renderActiveDrillBanner() {
  const banner = document.getElementById('active-emergency-banner');
  const navBadge = document.getElementById('emergency-alert-badge');

  if (banner) {
    banner.style.display = appState.drillActive ? 'flex' : 'none';
  }
  if (navBadge) {
    navBadge.style.display = appState.drillActive ? 'inline-block' : 'none';
  }
}

function renderTriageMatrix() {
  const container = document.getElementById('commander-triage-panel');
  if (!container) return;

  const incidents = appState.emergency.activeIncidents;

  if (incidents.length === 0) {
    container.innerHTML = `
      <div class="triage-suggest-card priority-low">
        <div class="triage-header">
          <span>AI Status Check</span>
          <span>No Active Threats</span>
        </div>
        <div class="triage-body">
          Perimeters secure. Sensor telemetry normal. No emergency dispatch recommendations required.
        </div>
      </div>
    `;
    return;
  }

  // Generate automated AI recommendations for each active incident
  container.innerHTML = incidents.map(inc => {
    let recommendation = "";
    let priorityClass = "priority-low";
    
    if (inc.type === 'Medical') {
      priorityClass = "priority-high";
      recommendation = `Deploy paramedical cart from Stand Zone A. Reroute pedestrian crowd at Gate E outer ring to keep evacuation corridors open. [Awaiting EMT dispatch confirmation]`;
    } else if (inc.type === 'Security') {
      priorityClass = "priority-medium";
      recommendation = `Deploy Security Team Sector 4. Activate surveillance feed camera 205. Lock turnstile entries for stand Zone B concourse.`;
    } else if (inc.type === 'Infrastructure') {
      priorityClass = "priority-high";
      recommendation = `Engage smart battery backup array. Force backup transformer circuits. Alert auxiliary field engineers for load assessment.`;
    } else {
      recommendation = `Monitor incident location. Dispatch standard stadium stewards to coordinate crowd flow.`;
    }

    return `
      <div class="triage-suggest-card ${priorityClass}">
        <div class="triage-header">
          <span style="font-weight:800;">${inc.type} Triage Recommendation</span>
          <span class="badge ${inc.severity === 'High' ? 'badge-danger' : 'badge-amber'}">${inc.severity} Priority</span>
        </div>
        <div class="triage-body">
          <strong>Location:</strong> ${inc.location}<br>
          <strong>Assessment:</strong> ${inc.description}<br>
          <strong class="text-accent">AI Decision Mitigation:</strong> ${recommendation}
        </div>
        <div class="triage-actions">
          <button class="btn btn-outline btn-sm timeline-action-btn" data-inc-id="${inc.id}" data-next-status="Responding">
            Dispatch Unit
          </button>
          <button class="btn btn-primary btn-sm timeline-action-btn" data-inc-id="${inc.id}" data-next-status="Resolved">
            Resolve Incident
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function renderIncidentTimeline() {
  const container = document.getElementById('incident-timeline-stepper');
  if (!container) return;

  const active = appState.emergency.activeIncidents;
  const history = appState.emergency.logHistory;
  
  // Combine logs for unified timeline display
  const allIncidents = [...active, ...history].sort((a,b) => {
    // Sort descending by time string
    return b.time.localeCompare(a.time);
  });

  if (allIncidents.length === 0) {
    container.innerHTML = '<div class="text-muted text-center py-4">No logged incidents found.</div>';
    return;
  }

  container.innerHTML = allIncidents.map(inc => {
    let nodeClass = '';
    if (inc.status === 'Resolved') nodeClass = 'success';
    else if (inc.severity === 'High') nodeClass = 'danger active';
    else nodeClass = 'active';

    let actionBtnHtml = '';
    if (inc.status === 'Awaiting Dispatch') {
      actionBtnHtml = `
        <button class="btn btn-outline btn-sm timeline-action-btn" style="margin-top:6px;" data-inc-id="${inc.id}" data-next-status="Responding">
          Dispatch Personnel
        </button>
      `;
    } else if (inc.status === 'Responding') {
      actionBtnHtml = `
        <button class="btn btn-outline btn-sm timeline-action-btn" style="margin-top:6px;" data-inc-id="${inc.id}" data-next-status="On Scene">
          Mark On Scene
        </button>
      `;
    } else if (inc.status === 'On Scene') {
      actionBtnHtml = `
        <button class="btn btn-primary btn-sm timeline-action-btn" style="margin-top:6px;" data-inc-id="${inc.id}" data-next-status="Resolved">
          Clear Incident
        </button>
      `;
    }

    return `
      <div class="timeline-node ${nodeClass}">
        <div class="timeline-bullet"></div>
        <div class="timeline-meta">
          <span>${inc.type} Event</span>
          <span class="timeline-time">${inc.time}</span>
        </div>
        <div class="timeline-title">${inc.location} [${inc.status}]</div>
        <div class="timeline-desc">${inc.description}</div>
        ${actionBtnHtml}
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function sanitizeHtml(str) {
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

function handleLogIncident(e) {
  e.preventDefault();

  const type = sanitizeHtml(document.getElementById('inc-type').value);
  const location = sanitizeHtml(document.getElementById('inc-location').value);
  const severity = sanitizeHtml(document.getElementById('inc-severity').value);
  const description = sanitizeHtml(document.getElementById('inc-details').value);

  const now = new Date();
  const timeStr = now.toTimeString().substring(0, 5);

  const newIncident = {
    id: Date.now(),
    type,
    location,
    severity,
    description,
    time: timeStr,
    status: 'Awaiting Dispatch'
  };

  appState.emergency.activeIncidents.unshift(newIncident);

  triggerNotification({
    id: Date.now(),
    severity: severity === 'High' ? 'danger' : 'warning',
    title: `Emergency Logged: ${type}`,
    desc: `${location}: ${description.substring(0, 40)}...`,
    time: timeStr
  });

  recalculateScores();
  document.getElementById('incident-report-form').reset();
  renderIncidentTimeline();
  renderTriageMatrix();
}

function handleDispatchUnit(unit) {
  const now = new Date();
  const timeStr = now.toTimeString().substring(0, 5);

  const newIncident = {
    id: Date.now(),
    type: unit,
    location: "Command Center Dispatch",
    severity: "High",
    description: `Manual override: Active ${unit} services unit dispatched via stadium central command.`,
    time: timeStr,
    status: "Responding"
  };

  appState.emergency.activeIncidents.unshift(newIncident);

  triggerNotification({
    id: Date.now(),
    severity: 'danger',
    title: `Dispatch Unit: ${unit}`,
    desc: `Emergency crew responding to central coordinator instructions.`,
    time: timeStr
  });

  recalculateScores();
  renderIncidentTimeline();
  renderTriageMatrix();
  alert(`Stadium Emergency Command: manual dispatch call transmitted to ${unit} unit.`);
}

function handleProgressIncident(id, status) {
  let incident = appState.emergency.activeIncidents.find(inc => inc.id === id);
  let isMovingToHistory = false;

  const now = new Date();
  const timeStr = now.toTimeString().substring(0, 5);

  if (incident) {
    if (status === 'Resolved') {
      incident.status = 'Resolved';
      incident.description += ` (Cleared at ${timeStr}).`;
      
      // Move to history
      appState.emergency.activeIncidents = appState.emergency.activeIncidents.filter(inc => inc.id !== id);
      appState.emergency.logHistory.unshift(incident);
      isMovingToHistory = true;

      // If it was a simulator scenario, remove it from activeScenarios
      const incType = incident.type.toLowerCase();
      if (incType === 'medical') {
        appState.simulation.activeScenarios = appState.simulation.activeScenarios.filter(s => s !== 'medical');
      } else if (incType === 'security') {
        appState.simulation.activeScenarios = appState.simulation.activeScenarios.filter(s => s !== 'security');
      } else if (incType === 'infrastructure') {
        appState.simulation.activeScenarios = appState.simulation.activeScenarios.filter(s => s !== 'power');
        // Restore grid values
        appState.sustainability.energy.solarPercent = 75;
        appState.sustainability.energy.gridIntake = 113;
      }
    } else {
      incident.status = status;
      incident.description += ` (Personnel state: ${status} at ${timeStr}).`;
    }

    triggerNotification({
      id: Date.now(),
      severity: status === 'Resolved' ? 'success' : 'info',
      title: `Incident Update: ${incident.type}`,
      desc: `${incident.location} status set to ${status}.`,
      time: 'Just now'
    });

    recalculateScores();
    renderIncidentTimeline();
    renderTriageMatrix();
    
    // Also re-render dashboard statistics if active
    const dashboardPanel = document.getElementById('view-dashboard');
    if (dashboardPanel && dashboardPanel.classList.contains('active')) {
      const activePanel = document.querySelector('.nav-item[data-view="dashboard"]');
      if (activePanel) activePanel.click();
    }
  } else {
    // Check history if somehow resolving something already in history
    incident = appState.emergency.logHistory.find(inc => inc.id === id);
    if (incident && status === 'Resolved') {
      incident.status = 'Resolved';
      renderIncidentTimeline();
    }
  }
}

function drawEvacMapOutline() {
  const canvas = document.getElementById('evac-route-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i < w; i += 15) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
  }
  for (let j = 0; j < h; j += 15) {
    ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(w, j); ctx.stroke();
  }

  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(w / 2, h / 2, 140, 70, 0, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;

  ctx.beginPath(); ctx.arc(40, h / 2, 20, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'white'; ctx.font = '7px Inter'; ctx.fillText('SAFE ZONE A', 20, (h / 2) + 3);

  ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
  ctx.beginPath(); ctx.arc(w - 40, h / 2, 20, 0, 2 * Math.PI); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'white'; ctx.fillText('SAFE ZONE B', w - 60, (h / 2) + 3);

  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(w / 2 - 40, h / 2);
  ctx.lineTo(80, h / 2);
  ctx.stroke();
  drawArrowhead(ctx, 80, h / 2, Math.PI);

  ctx.beginPath();
  ctx.moveTo(w / 2 + 40, h / 2);
  ctx.lineTo(w - 80, h / 2);
  ctx.stroke();
  drawArrowhead(ctx, w - 80, h / 2, 0);
}

function drawArrowhead(ctx, x, y, angle) {
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 8 * Math.cos(angle - Math.PI / 6), y - 8 * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x - 8 * Math.cos(angle + Math.PI / 6), y - 8 * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
}
