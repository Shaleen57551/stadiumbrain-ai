// Circular Sustainability Dashboard View Module - StadiumBrain AI
import { triggerNotification } from '../app.js';

let appState = null;

export function init(state) {
  appState = state;

  // Charger status interactive click toggler
  const chargerList = document.getElementById('ev-charger-list');
  if (chargerList) {
    chargerList.addEventListener('click', (e) => {
      const card = e.target.closest('.ev-charger-card');
      if (card) {
        const chargerId = card.getAttribute('data-charger-id');
        handleCycleChargerStatus(chargerId);
      }
    });
  }
}

export function render(state) {
  appState = state;

  updateResourceGauges();
  renderCarbonFootprint();
  renderEvChargers();
}

function updateResourceGauges() {
  const circ = 251.2; // 2 * PI * 40 radius

  // 1. Solar Energy
  const energy = appState.sustainability.energy;
  const solarProgress = document.getElementById('solar-progress-bar');
  const solarPctText = document.getElementById('solar-percent-val');
  const solarGenText = document.getElementById('solar-generation-val');
  const gridIntakeText = document.getElementById('grid-intake-val');

  if (solarProgress && solarPctText && solarGenText && gridIntakeText) {
    const offset = circ * (1 - energy.solarPercent / 100);
    solarProgress.style.strokeDashoffset = offset;
    solarPctText.textContent = `${energy.solarPercent}%`;
    solarGenText.textContent = `${energy.solarGen} kWh`;
    gridIntakeText.textContent = `${energy.gridIntake} kWh`;
  }

  // 2. Water
  const water = appState.sustainability.water;
  const waterProgress = document.getElementById('water-progress-bar');
  const waterPctText = document.getElementById('water-percent-val');
  const rainwaterText = document.getElementById('rainwater-val');
  const potableText = document.getElementById('potable-val');

  if (waterProgress && waterPctText && rainwaterText && potableText) {
    const offset = circ * (1 - water.recycledPercent / 100);
    waterProgress.style.strokeDashoffset = offset;
    waterPctText.textContent = `${water.recycledPercent}%`;
    rainwaterText.textContent = `${water.rainwater.toLocaleString()} L`;
    potableText.textContent = `${water.potable.toLocaleString()} L`;
  }

  // 3. Waste
  const waste = appState.sustainability.waste;
  const wasteProgress = document.getElementById('waste-progress-bar');
  const wastePctText = document.getElementById('waste-percent-val');
  const recycledWasteText = document.getElementById('recycled-waste-val');
  const landfillWasteText = document.getElementById('landfill-waste-val');

  if (wasteProgress && wastePctText && recycledWasteText && landfillWasteText) {
    const offset = circ * (1 - waste.recyclingRate / 100);
    wasteProgress.style.strokeDashoffset = offset;
    wastePctText.textContent = `${waste.recyclingRate}%`;
    recycledWasteText.textContent = `${waste.recycled} tons`;
    landfillWasteText.textContent = `${waste.landfill} tons`;
  }
}

function renderCarbonFootprint() {
  const carbon = appState.sustainability.carbon;
  const fpText = document.getElementById('carbon-footprint-val');
  const netText = document.getElementById('net-carbon-val');

  if (!fpText || !netText) return;

  fpText.textContent = `${carbon.gross} tCO₂e`;
  
  const netBalance = carbon.gross + carbon.reforestation + carbon.solarOffset;
  if (netBalance <= 0) {
    netText.textContent = `${netBalance.toFixed(1)} tCO₂e (Net Carbon Negative)`;
    netText.className = 'offset-amount font-semibold text-emerald-green';
  } else {
    netText.textContent = `+${netBalance.toFixed(1)} tCO₂e (Net Carbon Positive)`;
    netText.className = 'offset-amount font-semibold text-danger';
  }
}

function renderEvChargers() {
  const chargerList = document.getElementById('ev-charger-list');
  if (!chargerList) return;

  chargerList.innerHTML = appState.sustainability.chargers.map(c => {
    let statusClass = 'available';
    if (c.status === 'Charging') statusClass = 'charging';
    if (c.status === 'Offline') statusClass = 'offline';

    return `
      <div class="ev-charger-card clickable" data-charger-id="${c.id}">
        <div class="charger-info">
          <span class="charger-name">${c.name}</span>
          <span class="charger-power">${c.power}</span>
        </div>
        <span class="charger-status-pill ${statusClass}">${c.status}</span>
      </div>
    `;
  }).join('');
}

function handleCycleChargerStatus(id) {
  const charger = appState.sustainability.chargers.find(c => c.id === id);
  if (!charger) return;

  // Cycle states: Available -> Charging -> Offline -> Available
  const statesMap = {
    'Available': 'Charging',
    'Charging': 'Offline',
    'Offline': 'Available'
  };

  charger.status = statesMap[charger.status];

  triggerNotification({
    id: Date.now(),
    severity: charger.status === 'Offline' ? 'warning' : 'info',
    title: 'EV Charger Toggled',
    desc: `${charger.name} status changed to ${charger.status}.`,
    time: 'Just now'
  });

  renderEvChargers();
}
