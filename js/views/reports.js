// Executive Reports View Module - StadiumBrain AI
import { triggerNotification, runSystemDiagnostics } from '../app.js';

let appState = null;
let currentReportText = '';

export function init(state) {
  appState = state;

  const form = document.getElementById('report-generator-form');
  if (form) {
    form.addEventListener('submit', handleGenerateReport);
  }

  const btnCopy = document.getElementById('btn-copy-report-text');
  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      if (currentReportText) {
        navigator.clipboard.writeText(currentReportText).then(() => {
          btnCopy.innerHTML = '<i data-lucide="check"></i> Copied!';
          setTimeout(() => {
            btnCopy.innerHTML = '<i data-lucide="copy"></i> Copy Text';
            lucide.createIcons();
          }, 2000);
          lucide.createIcons();
        }).catch(err => {
          console.error("Clipboard copy failed:", err);
          alert("Could not copy report text. Copying blocked by browser policy.");
        });
      }
    });
  }

  const btnDownload = document.getElementById('btn-download-report-txt');
  if (btnDownload) {
    btnDownload.addEventListener('click', handleDownloadReport);
  }

  const btnRerun = document.getElementById('btn-rerun-diagnostics');
  if (btnRerun) {
    btnRerun.addEventListener('click', () => {
      runSystemDiagnostics();
    });
  }
}

export function render(state) {
  appState = state;
  generateDefaultReport();
}

function generateDefaultReport() {
  const preview = document.getElementById('report-document-body');
  if (!preview) return;

  const tournamentName = appState.tournament.name;
  const timePeriod = "Current Matchday (2026-07-08)";
  const incCount = appState.emergency.activeIncidents.length;
  
  // Calculate average gate queue size
  const totalQueue = appState.crowd.gates.reduce((sum, g) => sum + g.queueSize, 0);
  const avgQueue = Math.round(totalQueue / appState.crowd.gates.length);

  // Carbon Balance
  const carbon = appState.sustainability.carbon;
  const netCarbon = carbon.gross + carbon.reforestation + carbon.solarOffset;

  // Build HTML for UI preview
  let html = `
    <div class="document-report">
      <div class="doc-header-top">
        <div class="doc-logo-brand">
          <h1>STADIUMBRAIN</h1>
          <span>AI Operations Report</span>
        </div>
        <div class="doc-meta-right">
          <div>Report Ref: SB-8205</div>
          <div>Date: 2026-07-08</div>
          <div>Security: Confidential</div>
        </div>
      </div>

      <div class="doc-title-section">
        <h2>EXECUTIVE AUDIT SUMMARY</h2>
        <p>Operational Audit for ${tournamentName} | Period: ${timePeriod}</p>
      </div>

      <div class="doc-section">
        <div class="doc-section-title">Key Performance Indicators</div>
        <div class="doc-grid-kpis">
          <div class="doc-kpi-box">
            <div class="doc-kpi-label">Active Stadium Crowd</div>
            <div class="doc-kpi-val">68,420 / 72,000</div>
          </div>
          <div class="doc-kpi-box">
            <div class="doc-kpi-label">Avg Turnstile Queue</div>
            <div class="doc-kpi-val">${avgQueue} fans</div>
          </div>
          <div class="doc-kpi-box">
            <div class="doc-kpi-label">Net Carbon footprint</div>
            <div class="doc-kpi-val">${netCarbon.toFixed(1)} tCO₂e</div>
          </div>
        </div>
        <p class="doc-p">
          All turnstile gates are checked. Total attendance is currently stable, representing approximately 95% capacity load. Grid solar reserves provide sustainable battery pre-charging during peak solar radiation.
        </p>
      </div>

      <div class="doc-section">
        <div class="doc-section-title">Active Incident Log Dispatches</div>
        <p class="doc-p">Total active emergency dispatch events: <strong>${incCount}</strong></p>
        <table class="doc-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Incident Type</th>
              <th>Location</th>
              <th>Severity</th>
              <th>Current Status</th>
            </tr>
          </thead>
          <tbody>
  `;

  if (appState.emergency.activeIncidents.length === 0) {
    html += `<tr><td colspan="5" style="text-align:center;color:#64748b;">No active dispatches. All operations cleared.</td></tr>`;
  } else {
    appState.emergency.activeIncidents.forEach(inc => {
      html += `
        <tr>
          <td style="font-family:monospace;">${inc.time}</td>
          <td>${inc.type}</td>
          <td>${inc.location}</td>
          <td><strong>${inc.severity}</strong></td>
          <td>${inc.status}</td>
        </tr>
      `;
    });
  }

  html += `
          </tbody>
        </table>
      </div>

      <div class="doc-section">
        <div class="doc-section-title">Circular Resource Audit</div>
        <table class="doc-table">
          <thead>
            <tr>
              <th>Utility Resource</th>
              <th>Recycled / Solar Output</th>
              <th>Baseline Intake</th>
              <th>Net Efficiency</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Solar Power Grid</td>
              <td>${appState.sustainability.energy.solarGen} kWh</td>
              <td>${appState.sustainability.energy.gridIntake} kWh</td>
              <td><strong>${appState.sustainability.energy.solarPercent}% Renewable</strong></td>
            </tr>
            <tr>
              <td>Water & Irrigation</td>
              <td>${appState.sustainability.water.rainwater.toLocaleString()} L</td>
              <td>${appState.sustainability.water.potable.toLocaleString()} L</td>
              <td><strong>${appState.sustainability.water.recycledPercent}% Recycled</strong></td>
            </tr>
            <tr>
              <td>Solid Waste Sorting</td>
              <td>${appState.sustainability.waste.recycled} tons</td>
              <td>${appState.sustainability.waste.landfill} tons</td>
              <td><strong>${appState.sustainability.waste.recyclingRate}% Circular</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="doc-section">
        <div class="doc-section-title">AI Interventions & Ticker Feed</div>
        <p class="doc-p">
          1. Automated crowd routing suggestion: Diverted shuttle drop-offs from Gate E to decrease wait time to 3 mins.<br>
          2. Solar power optimization: Pre-charged stadium battery grid using solar peak generation (340 kWh).
        </p>
      </div>

      <div class="doc-footer">
        Generated by StadiumBrain AI Platform • Confidential Tournament Documentation
      </div>
    </div>
  `;

  preview.innerHTML = html;
  updateTextBuffer();
}

function handleGenerateReport(e) {
  e.preventDefault();

  const template = document.getElementById('rep-template').value;
  const period = document.getElementById('rep-period').value;
  
  const showKpi = document.getElementById('rep-sec-kpis').checked;
  const showIncidents = document.getElementById('rep-sec-incidents').checked;
  const showCarbon = document.getElementById('rep-sec-carbon').checked;
  const showAi = document.getElementById('rep-sec-ai-recs').checked;

  const preview = document.getElementById('report-document-body');
  if (!preview) return;

  const t = appState.tournament;
  const now = new Date();

  let html = `
    <div class="document-report">
      <div class="doc-header-top">
        <div class="doc-logo-brand">
          <h1>STADIUMBRAIN</h1>
          <span>AI Operations Report</span>
        </div>
        <div class="doc-meta-right">
          <div>Report Ref: SB-${Math.floor(1000 + Math.random() * 9000)}</div>
          <div>Date: 2026-07-08</div>
          <div>Security: Confidential</div>
        </div>
      </div>

      <div class="doc-title-section">
        <h2>${template.toUpperCase().replace(/_/g, ' ')}</h2>
        <p>Operational Audit for ${t.name} | Period: ${period.toUpperCase()}</p>
      </div>
  `;

  if (showKpi) {
    const totalQueue = appState.crowd.gates.reduce((sum, g) => sum + g.queueSize, 0);
    const avgQueue = Math.round(totalQueue / appState.crowd.gates.length);
    html += `
      <div class="doc-section">
        <div class="doc-section-title">Operations Status KPIs</div>
        <div class="doc-grid-kpis">
          <div class="doc-kpi-box">
            <div class="doc-kpi-label">Attendance Load</div>
            <div class="doc-kpi-val">68,420 / 72,000</div>
          </div>
          <div class="doc-kpi-box">
            <div class="doc-kpi-label">Average Queue</div>
            <div class="doc-kpi-val">${avgQueue} Spectators</div>
          </div>
          <div class="doc-kpi-box">
            <div class="doc-kpi-label">Security Readiness</div>
            <div class="doc-kpi-val">${appState.drillActive ? 'DRILL SIM' : '100% SECURE'}</div>
          </div>
        </div>
      </div>
    `;
  }

  if (showIncidents) {
    html += `
      <div class="doc-section">
        <div class="doc-section-title">Emergency Command Incidents</div>
        <table class="doc-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Incident Type</th>
              <th>Location</th>
              <th>Severity</th>
              <th>Current Status</th>
            </tr>
          </thead>
          <tbody>
    `;

    if (appState.emergency.activeIncidents.length === 0) {
      html += `<tr><td colspan="5" style="text-align:center;color:#64748b;">No active dispatch calls logged.</td></tr>`;
    } else {
      appState.emergency.activeIncidents.forEach(inc => {
        html += `
          <tr>
            <td style="font-family:monospace;">${inc.time}</td>
            <td>${inc.type}</td>
            <td>${inc.location}</td>
            <td><strong>${inc.severity}</strong></td>
            <td>${inc.status}</td>
          </tr>
        `;
      });
    }

    html += `
          </tbody>
        </table>
      </div>
    `;
  }

  if (showCarbon) {
    const carbon = appState.sustainability.carbon;
    const net = carbon.gross + carbon.reforestation + carbon.solarOffset;
    html += `
      <div class="doc-section">
        <div class="doc-section-title">Circular Resource Audit</div>
        <p class="doc-p">
          Gross Carbon Footprint: <strong>${carbon.gross} tCO₂e</strong>. Net Carbon Offset Balance: <strong>${net.toFixed(1)} tCO₂e</strong>.
        </p>
        <p class="doc-p">
          Solar Grid Power Intake represents ${appState.sustainability.energy.solarPercent}% renewable usage. Rainwater harvesting capacity processed ${appState.sustainability.water.rainwater.toLocaleString()} L of greywater recycling.
        </p>
      </div>
    `;
  }

  if (showAi) {
    html += `
      <div class="doc-section">
        <div class="doc-section-title">AI Optimization Operations Feed</div>
        <p class="doc-p">
          * Dynamic Turnstile Balance: AI algorithm detected Gate E queuing surge, recommended Shuttle redirection to Gate C. Wait time decreased by 75%.<br>
          * Energy Grid arbitrage: ML models scheduled storage battery discharge during match hours to prevent utility high-tier pricing.
        </p>
      </div>
    `;
  }

  html += `
      <div class="doc-footer">
        Generated by StadiumBrain AI Platform • Confidential Report Output
      </div>
    </div>
  `;

  preview.innerHTML = html;
  updateTextBuffer();

  triggerNotification({
    id: Date.now(),
    severity: 'success',
    title: 'Report Generated',
    desc: `Generated ${template.replace(/_/g, ' ')}. Ready for download.`,
    time: 'Just now'
  });
}

function updateTextBuffer() {
  const container = document.getElementById('report-document-body');
  if (!container) return;

  // Convert preview text into a clean printable formatted document string
  const lines = [];
  const textContent = container.innerText;
  
  currentReportText = `STADIUMBRAIN AI OPERATIONS PLATFORM REPORT
======================================================
${textContent.replace(/\n\n/g, '\n')}
======================================================
CONFIDENTIAL • FOR EVENT ORGANIZERS ONLY`;
}

function handleDownloadReport() {
  if (!currentReportText) return;

  const element = document.createElement('a');
  const file = new Blob([currentReportText], { type: 'text/plain;charset=utf-8' });
  element.href = URL.createObjectURL(file);
  element.download = `StadiumBrain_ExecutiveReport_${new Date().toISOString().substring(0, 10)}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);

  triggerNotification({
    id: Date.now(),
    severity: 'info',
    title: 'Report Downloaded',
    desc: 'Document successfully compiled and saved to local disk.',
    time: 'Just now'
  });
}
