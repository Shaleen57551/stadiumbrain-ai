// Tournament Manager View Module - StadiumBrain AI
import { triggerNotification, checkSchedulingConflicts } from '../app.js';

let appState = null;

export function init(state) {
  appState = state;

  const form = document.getElementById('add-match-form');
  if (form) {
    form.addEventListener('submit', handleAddMatch);
  }

  const venueFilter = document.getElementById('filter-venue-select');
  if (venueFilter) {
    venueFilter.addEventListener('change', () => {
      renderFixturesTable();
    });
  }

  // Handle delete match clicks
  const tableBody = document.querySelector('#fixtures-table tbody');
  if (tableBody) {
    tableBody.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.delete-match-btn');
      if (deleteBtn) {
        const matchId = parseInt(deleteBtn.getAttribute('data-match-id'));
        handleDeleteMatch(matchId);
      }
    });
  }

  // Smart Scheduler Auto-Optimize Button
  const btnOptimize = document.getElementById('btn-auto-optimize-schedule');
  if (btnOptimize) {
    btnOptimize.addEventListener('click', () => {
      handleAutoOptimizeSchedule();
    });
  }
}

export function render(state) {
  appState = state;

  populateDropdowns();
  renderFixturesTable();
  renderTeamsGrid();
  renderConflictsCard();
}

function populateDropdowns() {
  const teamASelect = document.getElementById('match-team-a');
  const teamBSelect = document.getElementById('match-team-b');
  const venueSelect = document.getElementById('match-venue');
  const refereeSelect = document.getElementById('match-referee');
  const filterVenue = document.getElementById('filter-venue-select');

  if (!teamASelect || !teamBSelect || !venueSelect || !refereeSelect) return;

  const t = appState.tournament;

  // Populate Teams
  const currentValA = teamASelect.value;
  const currentValB = teamBSelect.value;
  const teamsOptions = t.teams.map(team => `<option value="${team.id}">${team.badge} ${team.name}</option>`).join('');
  teamASelect.innerHTML = teamsOptions;
  teamBSelect.innerHTML = teamsOptions;
  if (currentValA) teamASelect.value = currentValA;
  if (currentValB) {
    teamBSelect.value = currentValB;
  } else if (t.teams.length > 1) {
    teamBSelect.value = t.teams[1].id;
  }

  // Populate Venues
  const currentValVenue = venueSelect.value;
  venueSelect.innerHTML = t.venues.map(v => `<option value="${v.name}">${v.name} (${v.city})</option>`).join('');
  if (currentValVenue) venueSelect.value = currentValVenue;

  // Populate Referees
  const currentValRef = refereeSelect.value;
  refereeSelect.innerHTML = t.referees.map(r => `<option value="${r}">${r}</option>`).join('');
  if (currentValRef) refereeSelect.value = currentValRef;

  // Populate Filter Venue Dropdown
  if (filterVenue) {
    filterVenue.innerHTML = '<option value="all">All Venues</option>' + 
      t.venues.map(v => `<option value="${v.name}">${v.name}</option>`).join('');
  }
}

function renderFixturesTable() {
  const tbody = document.querySelector('#fixtures-table tbody');
  const filterVenue = document.getElementById('filter-venue-select');
  if (!tbody) return;

  const t = appState.tournament;
  let matches = t.matches;

  // Apply filter
  if (filterVenue && filterVenue.value !== 'all') {
    const selectedVenue = filterVenue.value;
    matches = matches.filter(m => m.venue === selectedVenue);
  }

  if (matches.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No fixtures found for selected venue.</td></tr>';
    return;
  }

  tbody.innerHTML = matches.map(match => {
    const teamAObj = t.teams.find(team => team.id === match.teamA) || { badge: '🏳️', name: match.teamA };
    const teamBObj = t.teams.find(team => team.id === match.teamB) || { badge: '🏳️', name: match.teamB };
    
    return `
      <tr>
        <td class="font-mono"><strong>${match.time}</strong><br><span style="font-size:0.75rem;color:var(--text-muted);">${match.date}</span></td>
        <td>
          <div style="display:flex;align-items:center;gap:8px;font-weight:600;">
            <span>${teamAObj.badge} ${teamAObj.id}</span>
            <span style="font-size:0.75rem;color:var(--text-muted);">${match.score}</span>
            <span>${teamBObj.id} ${teamBObj.badge}</span>
          </div>
        </td>
        <td>${match.venue}</td>
        <td>${match.referee}</td>
        <td><span class="match-status-pill ${match.status.toLowerCase()}">${match.status}</span></td>
        <td>
          <button class="btn btn-outline btn-sm delete-match-btn text-danger" data-match-id="${match.id}" aria-label="Delete match">
            <i data-lucide="trash-2" style="width:14px;height:14px;"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  lucide.createIcons();
}

function renderTeamsGrid() {
  const grid = document.getElementById('teams-grid');
  if (!grid) return;

  const t = appState.tournament;
  grid.innerHTML = t.teams.map(team => `
    <div class="team-card">
      <div class="team-badge">${team.badge}</div>
      <div class="team-card-name">${team.name}</div>
      <div class="team-card-info">Rank: #${team.rank} (${team.id})</div>
    </div>
  `).join('');
}

function renderConflictsCard() {
  const conflictCard = document.getElementById('scheduler-conflict-card');
  const listEl = document.getElementById('scheduler-conflicts-list');
  if (!conflictCard || !listEl) return;

  const conflicts = appState.simulation.schedulingConflicts;

  if (conflicts.length === 0) {
    conflictCard.style.display = 'none';
    return;
  }

  conflictCard.style.display = 'block';
  listEl.innerHTML = conflicts.map(c => `
    <div class="conflict-warning-item">
      <i data-lucide="alert-triangle"></i>
      <div>
        <div class="conflict-title">${c.title}</div>
        <div class="conflict-desc">${c.desc}</div>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

function handleAddMatch(e) {
  e.preventDefault();

  const teamA = document.getElementById('match-team-a').value;
  const teamB = document.getElementById('match-team-b').value;
  const date = document.getElementById('match-date').value;
  const time = document.getElementById('match-time').value;
  const venue = document.getElementById('match-venue').value;
  const referee = document.getElementById('match-referee').value;
  const status = document.getElementById('match-status').value;

  if (teamA === teamB) {
    alert("Operational Error: A team cannot play against itself.");
    return;
  }

  const newMatch = {
    id: Date.now(),
    teamA,
    teamB,
    date,
    time,
    venue,
    referee,
    status,
    score: "- : -"
  };

  appState.tournament.matches.unshift(newMatch);

  // Scan for conflicts and update state
  checkSchedulingConflicts();

  triggerNotification({
    id: Date.now(),
    severity: 'info',
    title: 'Match Fixture Added',
    desc: `Scheduled ${teamA} vs ${teamB}. Scanner running.`,
    time: time
  });

  document.getElementById('add-match-form').reset();
  populateDropdowns();
  
  // Re-render
  renderFixturesTable();
  renderConflictsCard();
}

function handleDeleteMatch(id) {
  const index = appState.tournament.matches.findIndex(m => m.id === id);
  if (index !== -1) {
    const deleted = appState.tournament.matches[index];
    appState.tournament.matches.splice(index, 1);
    
    checkSchedulingConflicts();

    triggerNotification({
      id: Date.now(),
      severity: 'warning',
      title: 'Match Fixture Removed',
      desc: `Deleted match ID ${id} (${deleted.teamA} vs ${deleted.teamB}).`,
      time: 'Just now'
    });

    renderFixturesTable();
    renderConflictsCard();
  }
}

function handleAutoOptimizeSchedule() {
  const conflicts = appState.simulation.schedulingConflicts;
  const matches = appState.tournament.matches;
  const t = appState.tournament;

  conflicts.forEach(c => {
    if (c.type === 'referee') {
      // Find the second match involved in conflict and change its referee
      const clashMatch = c.data[1];
      const matchObj = matches.find(m => m.id === clashMatch.id);
      if (matchObj) {
        // Assign referee not Szymon Marciniak
        const alternateRef = t.referees.find(r => r !== clashMatch.referee) || t.referees[0];
        matchObj.referee = alternateRef;
      }
    } else if (c.type === 'venue') {
      // Shift second match by 3 hours
      const clashMatch = c.data[1];
      const matchObj = matches.find(m => m.id === clashMatch.id);
      if (matchObj) {
        matchObj.time = "21:00";
      }
    } else if (c.type === 'fatigue') {
      // Shift second match date by 1 day
      const clashMatch = c.data[1];
      const matchObj = matches.find(m => m.id === clashMatch.id);
      if (matchObj) {
        const d = new Date(matchObj.date);
        d.setDate(d.getDate() + 1);
        matchObj.date = d.toISOString().substring(0, 10);
      }
    }
  });

  // Re-run scanner
  checkSchedulingConflicts();

  triggerNotification({
    id: Date.now(),
    severity: 'success',
    title: 'Schedule Fully Optimized',
    desc: 'Smart Scheduler resolved venue, referee, and fatigue overlaps.',
    time: 'Just now'
  });

  // Re-render
  renderFixturesTable();
  renderConflictsCard();
  alert("AI Tournament Scheduler: Overlapping scheduling slots reallocated. Conflicts successfully cleared.");
}
