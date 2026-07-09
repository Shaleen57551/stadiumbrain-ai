// AI Operations Center View Module (Multi-Agent Platform) - StadiumBrain AI
import { aiModesResponses } from '../data.js';
import { sanitizeHtml } from '../app.js';

let appState = null;

export function init(state) {
  appState = state;

  const sendBtn = document.getElementById('send-chat-btn');
  const chatInput = document.getElementById('chat-input');
  const clearBtn = document.getElementById('clear-chat-btn');
  const chipsContainer = document.getElementById('ops-mode-chips');

  if (sendBtn && chatInput) {
    sendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      appState.chatHistory = [];
      renderChatMessages();
    });
  }

  if (chipsContainer) {
    chipsContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (chip) {
        const mode = chip.getAttribute('data-mode');
        triggerModePrompt(mode);
      }
    });
  }
}

export function render(state) {
  appState = state;

  renderRoster();
  renderChatMessages();
  renderChatHistory();
}

function triggerModePrompt(mode) {
  const chatInput = document.getElementById('chat-input');
  if (!chatInput) return;

  chatInput.value = `${mode} Mode: Requesting multi-agent operational assessment for ${appState.tournament.name}.`;
  chatInput.focus();
  
  handleSendMessage();
}

function handleSendMessage() {
  const chatInput = document.getElementById('chat-input');
  if (!chatInput || !chatInput.value.trim()) return;

  const userText = chatInput.value.trim();
  chatInput.value = '';

  const now = new Date();
  const timeStr = now.toTimeString().substring(0, 5);
  
  // Log User Query
  appState.chatHistory.push({
    id: Date.now(),
    sender: 'user',
    timestamp: timeStr,
    text: userText
  });

  renderChatMessages();

  // Detect mode
  let matchedMode = 'General';
  const modesList = ['Emergency', 'Crowd', 'Schedule', 'Finance', 'Media', 'Sustainability', 'Accessibility'];
  for (const m of modesList) {
    if (userText.toLowerCase().includes(m.toLowerCase())) {
      matchedMode = m;
      break;
    }
  }

  // Set chat mode indicator
  const chatModeIndicator = document.getElementById('chat-mode-indicator');
  if (chatModeIndicator) {
    chatModeIndicator.textContent = `Mode: Multi-Agent ${matchedMode}`;
  }

  // Simulate Multi-Agent Collaboration Stream
  simulateAgentCollaboration(matchedMode, () => {
    let aiResponse = null;
    if (matchedMode !== 'General' && aiModesResponses[matchedMode]) {
      aiResponse = aiModesResponses[matchedMode];
    } else {
      aiResponse = {
        situation: `General Operations Query concerning ${appState.tournament.name}.`,
        assessment: "Overall system status checks green. Crowd densities distributed across active stadium perimeter zones.",
        actions: "1. **Priority 1**: Continue turnstile throughput monitoring.\n2. **Priority 2**: Sync broadcast media feed logs.\n3. **Priority 3**: Verify emergency responder standbys.",
        risks: "Weather indices are stable, but transit schedules show minor peak crowding trends.",
        optimizations: "Ready to run targeted ML model routing calculations on command.",
        impact: "Operational latency remains minimized, fan throughput is clear.",
        summary: "Platform operating at optimal metrics. Select a specialized analysis mode chip for deep audits."
      };
    }

    // Append Tournament Director combined response
    appState.chatHistory.push({
      id: Date.now() + 1,
      sender: 'system',
      timestamp: new Date().toTimeString().substring(0, 5),
      structuredData: aiResponse,
      agentSource: 'Tournament Director AI'
    });

    renderChatMessages();
    renderChatHistory();
  });
}

function simulateAgentCollaboration(mode, callback) {
  const feed = document.getElementById('ai-collaboration-feed');
  if (!feed) {
    callback();
    return;
  }

  feed.innerHTML = '';
  const agents = appState.simulation.agents;
  
  // Custom dialog log depending on active mode
  let sequence = [];
  if (mode === 'Emergency') {
    sequence = [
      { sender: 'emergency', text: 'Active emergency triage request. Analyzing reported incident reports.', status: 'Processing' },
      { sender: 'security', text: 'Zone B Concourse camera 205 online. Supporters crowd localized. Dispatching squad 4.', status: 'Processing' },
      { sender: 'fanExperience', text: 'Rerouting wheelchair accessibility pathways around Zone B elevator.', status: 'Processing' },
      { sender: 'director', text: 'Consolidating emergency routes. Safety scores adjusted. Evacuation zones active.', status: 'Processing' }
    ];
  } else if (mode === 'Crowd') {
    sequence = [
      { sender: 'crowd', text: 'Turnstiles wait times at Gate E at 28m. Queue COMPACTING.', status: 'Processing' },
      { sender: 'transportation', text: 'Parking South Lot full. Bus shuttle queues backup detected. Rerouting Plazas.', status: 'Processing' },
      { sender: 'fanExperience', text: 'Wait times exceeding service benchmarks. Flagging accessibility assistance alert.', status: 'Processing' },
      { sender: 'director', text: 'Consolidating flow: Recommending transit shuttle vector diversion to Gate C.', status: 'Processing' }
    ];
  } else if (mode === 'Schedule') {
    sequence = [
      { sender: 'scheduler', text: 'Scanning fixtures for overlaps. Referee clash detected: Szymon Marciniak scheduled twice.', status: 'Processing' },
      { sender: 'director', text: 'Consulting fixture calendar. Running schedule optimization scripts.', status: 'Processing' }
    ];
  } else if (mode === 'Sustainability') {
    sequence = [
      { sender: 'sustainability', text: 'Peak solar generation (340 kWh). Solar offset net -1.0 tCO2e active.', status: 'Processing' },
      { sender: 'director', text: 'Diverting battery storage grid reserves to matchday floodlight arrays.', status: 'Processing' }
    ];
  } else {
    // General / Finance / Media / Accessibility
    sequence = [
      { sender: 'scheduler', text: 'Checking team travel schedules. No overlaps.', status: 'Processing' },
      { sender: 'crowd', text: 'Gate entry rates normal. Inflow speed clear.', status: 'Processing' },
      { sender: 'director', text: 'All operations indicators green. Summary report compiled.', status: 'Processing' }
    ];
  }

  // Sequentially execute logs with delay
  let index = 0;
  
  function runStep() {
    if (index >= sequence.length) {
      // Restore all statuses
      Object.keys(agents).forEach(k => {
        agents[k].status = (k === 'director') ? 'Active' : 'Monitoring';
      });
      renderRoster();
      callback();
      return;
    }

    const step = sequence[index];
    
    // Set all monitoring, set current to processing
    Object.keys(agents).forEach(k => {
      agents[k].status = (k === step.sender) ? 'Processing' : 'Monitoring';
    });
    renderRoster();

    // Log console message
    const msgEl = document.createElement('div');
    msgEl.className = 'collab-message';
    msgEl.innerHTML = `<span class="collab-agent-header">[${agents[step.sender].name}]:</span> ${step.text}`;
    feed.appendChild(msgEl);
    feed.scrollTop = feed.scrollHeight;

    index++;
    setTimeout(runStep, 600);
  }

  // Set Director as Active at start
  runStep();
}

function renderRoster() {
  const rosterList = document.getElementById('agent-roster-list');
  if (!rosterList) return;

  const agents = appState.simulation.agents;
  rosterList.innerHTML = Object.keys(agents).map(key => {
    const a = agents[key];
    let statusClass = 'monitoring';
    if (a.status === 'Processing') statusClass = 'processing';
    if (a.status === 'Active') statusClass = 'active';

    return `
      <div class="agent-status-row">
        <div class="agent-avatar-icon">
          <i data-lucide="${a.icon}" style="width:14px;height:14px;"></i>
        </div>
        <div class="agent-name-role">
          <span>${a.name}</span>
          <span>${a.role}</span>
        </div>
        <div class="agent-status-badge-container">
          <span class="agent-status-pill-roster ${statusClass}">${a.status}</span>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function renderChatMessages() {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  if (appState.chatHistory.length === 0) {
    container.innerHTML = '<div class="text-muted text-center py-8">Chat history is empty. Input a command above to begin.</div>';
    return;
  }

  container.innerHTML = appState.chatHistory.map(msg => {
    if (msg.sender === 'user') {
      return `
        <div class="chat-message user">
          <div class="msg-avatar">OPS</div>
          <div class="msg-bubble">${sanitizeHtml(msg.text)}</div>
        </div>
      `;
    } else {
      if (msg.structuredData) {
        return `
          <div class="chat-message system" style="max-width: 95%;">
            <div class="msg-avatar"><i data-lucide="bot" style="width:16px;height:16px;"></i></div>
            <div class="msg-bubble" style="width: 100%;">
              <div class="stadium-exec-response">
                
                <!-- Explainable AI reasoning card -->
                <div class="exec-section-block explainability-reasoning" style="background: rgba(37, 99, 235, 0.04); border: 1px solid rgba(37, 99, 235, 0.15); padding: 12px; border-radius: var(--radius-md); margin-bottom: 16px;">
                  <div class="exec-section-header" style="color: var(--primary); font-weight:800; font-size:0.75rem; margin-bottom:6px;"><i data-lucide="info"></i> Explainable AI: Recommendation Rationale</div>
                  <div class="exec-section-body" style="font-size:0.75rem; line-height: 1.4; color: var(--text-main);">
                    <strong>Why this recommendation?</strong> ${msg.structuredData.why || "To ensure tournament security operations and crowd alignment based on sensor indicators."}
                  </div>
                  <div style="font-size:0.65rem; color:var(--text-muted); margin-top:8px; border-top:1px dashed rgba(37, 99, 235, 0.15); padding-top:6px; display:flex; justify-content:space-between; align-items:center;">
                    <span><strong>Contributors:</strong> Central Multi-Agent Decision Grid</span>
                    <span class="badge badge-accent" style="font-weight:700; font-family:'JetBrains Mono',monospace;">${msg.structuredData.confidence || 95}% Confidence</span>
                  </div>
                </div>

                <div class="exec-section-block">
                  <div class="exec-section-header situation"><i data-lucide="map-pin"></i> 🏟 Situation Overview</div>
                  <div class="exec-section-body">
                    ${msg.structuredData.situation}
                    <div style="font-size:0.65rem;color:var(--text-muted);margin-top:6px;border-top:1px dashed var(--border-color);padding-top:4px;">
                      <strong>Source:</strong> Tournament Director AI / Crowd Intelligence AI
                    </div>
                  </div>
                </div>

                <div class="exec-section-block">
                  <div class="exec-section-header assessment"><i data-lucide="activity"></i> 📊 Operational Assessment</div>
                  <div class="exec-section-body">
                    ${msg.structuredData.assessment}
                    <div style="font-size:0.65rem;color:var(--text-muted);margin-top:6px;border-top:1px dashed var(--border-color);padding-top:4px;">
                      <strong>Source:</strong> Fan Experience AI / Transportation AI
                    </div>
                  </div>
                </div>

                <div class="exec-section-block">
                  <div class="exec-section-header actions"><i data-lucide="check-circle"></i> 🎯 Recommended Actions</div>
                  <div class="exec-section-body">
                    ${formatMarkdownList(msg.structuredData.actions)}
                    <div style="font-size:0.65rem;color:var(--text-muted);margin-top:6px;border-top:1px dashed var(--border-color);padding-top:4px;">
                      <strong>Source:</strong> Combined Agent Collaboration Recommendation
                    </div>
                  </div>
                </div>

                <div class="exec-section-block">
                  <div class="exec-section-header risks"><i data-lucide="alert-triangle"></i> ⚠ Risk Forecast</div>
                  <div class="exec-section-body">
                    ${msg.structuredData.risks}
                    <div style="font-size:0.65rem;color:var(--text-muted);margin-top:6px;border-top:1px dashed var(--border-color);padding-top:4px;">
                      <strong>Source:</strong> Security AI / Emergency AI
                    </div>
                  </div>
                </div>

                <div class="exec-section-block">
                  <div class="exec-section-header optimizations"><i data-lucide="cpu"></i> 🤖 AI Optimizations</div>
                  <div class="exec-section-body">
                    ${msg.structuredData.optimizations}
                    <div style="font-size:0.65rem;color:var(--text-muted);margin-top:6px;border-top:1px dashed var(--border-color);padding-top:4px;">
                      <strong>Source:</strong> Sustainability AI / Scheduling AI
                    </div>
                  </div>
                </div>

                <div class="exec-section-block">
                  <div class="exec-section-header impact"><i data-lucide="trending-up"></i> 📈 Expected Impact</div>
                  <div class="exec-section-body">
                    ${msg.structuredData.impact}
                  </div>
                </div>

                <div class="exec-section-block">
                  <div class="exec-section-header summary"><i data-lucide="file-text"></i> 📋 Executive Summary</div>
                  <div class="exec-section-body font-semibold">
                    ${msg.structuredData.summary}
                    <div style="font-size:0.65rem;color:var(--text-muted);margin-top:6px;border-top:1px dashed var(--border-color);padding-top:4px;">
                      <strong>Consolidated Recommendation by:</strong> Tournament Director AI
                    </div>
                  </div>
                </div>

              </div>
              <div class="chat-bubble-actions">
                <button class="bubble-action-btn copy-btn" data-clipboard-id="${msg.id}">
                  <i data-lucide="copy" style="width:12px;height:12px;"></i> Copy Response
                </button>
              </div>
            </div>
          </div>
        `;
      } else {
        return `
          <div class="chat-message system">
            <div class="msg-avatar"><i data-lucide="bot" style="width:16px;height:16px;"></i></div>
            <div class="msg-bubble">${msg.text}</div>
          </div>
        `;
      }
    }
  }).join('');

  // Copy clipboards
  const copyBtns = container.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const msgId = parseInt(btn.getAttribute('data-clipboard-id'));
      const msgObj = appState.chatHistory.find(m => m.id === msgId);
      if (msgObj && msgObj.structuredData) {
        copyStructuredDataToClipboard(msgObj.structuredData);
        btn.innerHTML = '<i data-lucide="check" style="width:12px;height:12px;"></i> Copied!';
        setTimeout(() => {
          btn.innerHTML = '<i data-lucide="copy" style="width:12px;height:12px;"></i> Copy Response';
          lucide.createIcons();
        }, 2000);
        lucide.createIcons();
      }
    });
  });

  container.scrollTop = container.scrollHeight;
  lucide.createIcons();
}

function renderChatHistory() {
  const historyList = document.getElementById('chat-history-list');
  if (!historyList) return;

  const userMessages = appState.chatHistory.filter(m => msgIsChipPrompt(m.text));
  if (userMessages.length === 0) {
    historyList.innerHTML = '<li class="text-muted" style="font-size:0.7rem;padding:6px 10px;">No operational runs</li>';
    return;
  }

  const historyItems = [...new Set(userMessages.map(m => m.text))].slice(-5);

  historyList.innerHTML = historyItems.map(txt => {
    const displayLabel = txt.split(':')[0] || txt;
    return `<li class="chat-history-item" title="${txt}">${displayLabel}</li>`;
  }).join('');

  const items = historyList.querySelectorAll('.chat-history-item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      const fullText = item.getAttribute('title');
      const chatInput = document.getElementById('chat-input');
      if (chatInput) {
        chatInput.value = fullText;
        handleSendMessage();
      }
    });
  });
}

function msgIsChipPrompt(text) {
  if (!text) return false;
  return text.includes('Mode:');
}

function copyStructuredDataToClipboard(sd) {
  const textContent = `========================
🏟 Situation Overview
${sd.situation}
========================
📊 Operational Assessment
${sd.assessment}
========================
🎯 Recommended Actions
${sd.actions}
========================
⚠ Risk Forecast
${sd.risks}
========================
🤖 AI Optimizations
${sd.optimizations}
========================
📈 Expected Impact
${sd.impact}
========================
📋 Executive Summary
${sd.summary}
========================`;

  navigator.clipboard.writeText(textContent).catch(err => {
    console.error("Clipboard copy failed: ", err);
  });
}

function formatMarkdownList(txt) {
  if (!txt) return '';
  return txt
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\"/g, '<strong>$1</strong>')
    .replace(/\* (.*?)/g, '• $1');
}


