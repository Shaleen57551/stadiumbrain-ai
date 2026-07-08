// Crowd Intelligence View Module - StadiumBrain AI
import { triggerNotification, recalculateScores } from '../app.js';

let appState = null;
let animationFrameId = null;
let heatmapPoints = [];

export function init(state) {
  appState = state;

  const btnRegen = document.getElementById('btn-toggle-heatmap');
  if (btnRegen) {
    btnRegen.addEventListener('click', () => {
      generateRandomHeatmapPoints();
    });
  }

  const tableBody = document.getElementById('gates-control-tbody');
  if (tableBody) {
    tableBody.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('.toggle-gate-btn');
      if (toggleBtn) {
        const gateName = toggleBtn.getAttribute('data-gate-name');
        handleToggleGate(gateName);
      }
    });
  }

  // Handle reroute alert click
  const alertsList = document.getElementById('crowd-alerts-list');
  if (alertsList) {
    alertsList.addEventListener('click', (e) => {
      const actionBtn = e.target.closest('.crowd-alert-action-btn');
      if (actionBtn) {
        const alertId = parseInt(actionBtn.getAttribute('data-alert-id'));
        handleResolveAlert(alertId);
      }
    });
  }

  // AI Crowd Redistribution Button
  const btnRedistribute = document.getElementById('btn-run-crowd-redistribution');
  if (btnRedistribute) {
    btnRedistribute.addEventListener('click', () => {
      handleRunCrowdRedistribution();
    });
  }
}

export function render(state) {
  appState = state;

  renderAlerts();
  renderGatesTable();
  renderParkingStatus();

  // Setup heatmap
  if (heatmapPoints.length === 0) {
    generateRandomHeatmapPoints();
  }
  startHeatmapAnimation();
}

function generateRandomHeatmapPoints() {
  heatmapPoints = [];
  const canvas = document.getElementById('crowd-heatmap-canvas');
  if (!canvas) return;

  const width = canvas.width || 600;
  const height = canvas.height || 400;
  const centerX = width / 2;
  const centerY = height / 2;

  const gateZones = [
    { name: 'Gate A', angle: -Math.PI / 2, severity: getGateSeverity('Gate A') }, // North
    { name: 'Gate B', angle: 0, severity: getGateSeverity('Gate B') },          // East
    { name: 'Gate C', angle: Math.PI / 4, severity: getGateSeverity('Gate C') },
    { name: 'Gate D', angle: 3 * Math.PI / 4, severity: getGateSeverity('Gate D') },
    { name: 'Gate E', angle: Math.PI, severity: getGateSeverity('Gate E') },     // West
    { name: 'Gate F', angle: -3 * Math.PI / 4, severity: getGateSeverity('Gate F') }
  ];

  gateZones.forEach(gate => {
    const rx = 200;
    const ry = 130;
    const x = centerX + rx * Math.cos(gate.angle);
    const y = centerY + ry * Math.sin(gate.angle);

    let intensity = 0.3;
    let color = 'rgba(16, 185, 129, '; // Green
    let pulseSpeed = 0.05;

    if (gate.severity === 'Congested') {
      intensity = 0.9;
      color = 'rgba(239, 68, 68, '; // Red
      pulseSpeed = 0.08;
    } else if (gate.severity === 'Closed') {
      intensity = 0.1;
      color = 'rgba(148, 163, 184, '; // Grey
      pulseSpeed = 0.02;
    } else {
      intensity = 0.5;
      color = 'rgba(245, 158, 11, '; // Yellow/Amber
      pulseSpeed = 0.04;
    }

    heatmapPoints.push({
      x, y,
      baseRadius: 30 + intensity * 40,
      radius: 30 + intensity * 40,
      color,
      intensity,
      pulseSpeed,
      pulseDir: 1,
      gateName: gate.name
    });

    for (let i = 0; i < 5; i++) {
      const scatterX = x + (Math.random() - 0.5) * 50;
      const scatterY = y + (Math.random() - 0.5) * 50;
      heatmapPoints.push({
        x: scatterX,
        y: scatterY,
        baseRadius: 15 + Math.random() * 20,
        radius: 15 + Math.random() * 20,
        color,
        intensity: intensity * 0.5,
        pulseSpeed: pulseSpeed * (0.5 + Math.random()),
        pulseDir: 1,
        gateName: null
      });
    }
  });
}

function getGateSeverity(gateName) {
  const gate = appState.crowd.gates.find(g => g.name === gateName);
  return gate ? gate.status : 'Closed';
}

function startHeatmapAnimation() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  const canvas = document.getElementById('crowd-heatmap-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, canvas.height / 2, 220, 150, 0, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, canvas.height / 2, 100, 60, 0, 0, 2 * Math.PI);
    ctx.stroke();

    heatmapPoints.forEach(p => {
      p.radius += p.pulseDir * p.pulseSpeed;
      if (p.radius > p.baseRadius * 1.3 || p.radius < p.baseRadius * 0.8) {
        p.pulseDir *= -1;
      }

      const gradient = ctx.createRadialGradient(p.x, p.y, 2, p.x, p.y, p.radius);
      gradient.addColorStop(0, p.color + '0.7)');
      gradient.addColorStop(0.5, p.color + '0.3)');
      gradient.addColorStop(1, p.color + '0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
      ctx.fill();
    });

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();
}

function renderAlerts() {
  const alertsList = document.getElementById('crowd-alerts-list');
  const alertBox = document.getElementById('congestion-alerts-box');
  if (!alertsList || !alertBox) return;

  const activeAlerts = appState.crowd.alerts.filter(a => a.active);

  if (activeAlerts.length === 0) {
    alertBox.style.display = 'none';
    return;
  }

  alertBox.style.display = 'block';
  alertsList.innerHTML = activeAlerts.map(a => `
    <div class="crowd-alert">
      <div class="crowd-alert-info">
        <i data-lucide="alert-circle"></i>
        <div>
          <strong>${a.gate} Warning:</strong> ${a.message}
        </div>
      </div>
      <button class="crowd-alert-action-btn" data-alert-id="${a.id}">Reroute Flow</button>
    </div>
  `).join('');

  lucide.createIcons();
}

function renderGatesTable() {
  const tbody = document.getElementById('gates-control-tbody');
  if (!tbody) return;

  tbody.innerHTML = appState.crowd.gates.map(gate => {
    // Calculate Predicted Wait Time and Risk Levels
    let waitMin = parseInt(gate.estWait) || 0;
    let predMin = waitMin;
    let risk = 'Low';
    let riskClass = 'badge-accent';

    if (gate.status === 'Congested') {
      predMin = waitMin + 12;
    } else if (gate.status === 'Open') {
      predMin = waitMin + 2;
    } else {
      predMin = 0;
    }

    if (predMin >= 15) {
      risk = 'Critical';
      riskClass = 'badge-danger';
    } else if (predMin >= 6) {
      risk = 'Medium';
      riskClass = 'badge-amber';
    }

    const predictedText = gate.status === 'Closed' ? '--' : `${predMin} min`;

    let statusClass = 'scheduled';
    if (gate.status === 'Congested') statusClass = 'live';
    if (gate.status === 'Closed') statusClass = 'completed';

    return `
      <tr>
        <td><strong>${gate.name}</strong></td>
        <td class="font-mono">${gate.queueSize}</td>
        <td class="font-mono">${gate.estWait}</td>
        <td class="font-mono text-accent"><strong>${predictedText}</strong></td>
        <td><span class="badge ${riskClass}">${risk}</span></td>
        <td><span class="match-status-pill ${statusClass}">${gate.status}</span></td>
        <td>
          <button class="btn btn-outline btn-sm toggle-gate-btn" data-gate-name="${gate.name}">
            Cycle Status
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderParkingStatus() {
  const parkingList = document.getElementById('parking-list');
  if (!parkingList) return;

  parkingList.innerHTML = appState.crowd.parking.map(p => {
    const percent = Math.round((p.occupancy / p.capacity) * 100);
    
    let colorClass = '';
    if (percent >= 90) colorClass = 'full';
    else if (percent >= 70) colorClass = 'warning';

    return `
      <div class="parking-item">
        <div class="parking-meta">
          <span class="parking-name">${p.name}</span>
          <span class="parking-occupancy font-mono">${p.occupancy} / ${p.capacity} cars (${percent}%)</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill ${colorClass}" style="width: ${percent}%;"></div>
        </div>
      </div>
    `;
  }).join('');
}

function handleToggleGate(gateName) {
  const gate = appState.crowd.gates.find(g => g.name === gateName);
  if (!gate) return;

  const statusCycle = {
    'Open': { next: 'Congested', q: 450, wait: '18 min' },
    'Congested': { next: 'Closed', q: 0, wait: '0 min' },
    'Closed': { next: 'Open', q: 80, wait: '3 min' }
  };

  const current = statusCycle[gate.status];
  gate.status = current.next;
  gate.queueSize = current.q;
  gate.estWait = current.wait;

  triggerNotification({
    id: Date.now(),
    severity: gate.status === 'Congested' ? 'danger' : 'info',
    title: `Gate Operations Toggled`,
    desc: `${gateName} turnstiles toggled to ${gate.status}.`,
    time: 'Just now'
  });

  if (gate.status === 'Congested') {
    appState.crowd.alerts.push({
      id: Date.now(),
      gate: gateName,
      severity: 'High',
      message: `Turnstile congestion surge. Wait times elevated.`,
      active: true
    });
  } else {
    appState.crowd.alerts.forEach(a => {
      if (a.gate === gateName) a.active = false;
    });
  }

  recalculateScores();
  generateRandomHeatmapPoints();
  renderGatesTable();
  renderAlerts();
}

function handleResolveAlert(id) {
  const alertIdx = appState.crowd.alerts.findIndex(a => a.id === id);
  if (alertIdx !== -1) {
    const alertObj = appState.crowd.alerts[alertIdx];
    alertObj.active = false;

    const gate = appState.crowd.gates.find(g => g.name === alertObj.gate);
    if (gate) {
      gate.status = 'Open';
      gate.queueSize = 80;
      gate.estWait = '3 min';
    }

    triggerNotification({
      id: Date.now(),
      severity: 'success',
      title: 'Alert Resolved',
      desc: `Crowd flow rerouted. ${alertObj.gate} queue cleared.`,
      time: 'Just now'
    });

    recalculateScores();
    generateRandomHeatmapPoints();
    renderGatesTable();
    renderAlerts();
  }
}

function handleRunCrowdRedistribution() {
  // AI redistribution algorithm: balance crowd from congested gates to underutilized ones
  appState.crowd.gates.forEach(g => {
    if (g.status === 'Congested') {
      g.status = 'Open';
      g.queueSize = 110;
      g.estWait = '4 min';
    }
  });

  // Clear all alerts
  appState.crowd.alerts.forEach(a => a.active = false);

  // Clear gate failure scenario in simulator
  appState.simulation.activeScenarios = appState.simulation.activeScenarios.filter(s => s !== 'transit_delay');

  triggerNotification({
    id: Date.now(),
    severity: 'success',
    title: 'AI Redistribution Complete',
    desc: 'Spectator queues balanced symmetrically across all operational gates.',
    time: 'Just now'
  });

  recalculateScores();
  generateRandomHeatmapPoints();
  renderGatesTable();
  renderAlerts();
  alert("AI Crowd Intelligence: Spectators successfully rerouted to underutilized turnstiles. Gate congestion cleared.");
}
