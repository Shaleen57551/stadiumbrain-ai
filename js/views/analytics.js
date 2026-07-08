// Analytics Dashboard View Module - StadiumBrain AI
let appState = null;
const chartInstances = {};

export function init(state) {
  appState = state;

  // Add click listeners to filter buttons
  const filterContainer = document.querySelector('.analytics-filter-options');
  if (filterContainer) {
    filterContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (btn) {
        // Toggle active styling
        filterContainer.querySelectorAll('button').forEach(b => {
          b.className = 'btn btn-sm btn-outline';
        });
        btn.className = 'btn btn-sm btn-accent';

        const filterVal = btn.getAttribute('data-filter');
        updateAnalyticsData(filterVal);
      }
    });
  }
}

export function render(state) {
  appState = state;
  
  // Render charts on dynamic load
  setTimeout(() => {
    initCharts();
  }, 100);
}

function initCharts() {
  const chartConfigs = getChartDataConfigs('7days');

  // Destroy existing charts to avoid overlap glitches
  Object.keys(chartInstances).forEach(key => {
    if (chartInstances[key]) {
      chartInstances[key].destroy();
    }
  });

  // 1. Attendance Trend Line Chart
  const ctxAttendance = document.getElementById('attendance-trend-chart');
  if (ctxAttendance) {
    chartInstances.attendance = new Chart(ctxAttendance, {
      type: 'line',
      data: chartConfigs.attendance.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 2. Revenue Doughnut Chart
  const ctxRevenue = document.getElementById('revenue-split-chart');
  if (ctxRevenue) {
    chartInstances.revenue = new Chart(ctxRevenue, {
      type: 'doughnut',
      data: chartConfigs.revenue.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right' }
        }
      }
    });
  }

  // 3. Hourly Turnstiles Peak Bar Chart
  const ctxTurnstiles = document.getElementById('gate-turnstile-chart');
  if (ctxTurnstiles) {
    chartInstances.turnstiles = new Chart(ctxTurnstiles, {
      type: 'bar',
      data: chartConfigs.turnstiles.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 4. Transit Capacity Line/Radar Chart
  const ctxTransit = document.getElementById('transit-load-chart');
  if (ctxTransit) {
    chartInstances.transit = new Chart(ctxTransit, {
      type: 'line',
      data: chartConfigs.transit.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }
}

function updateAnalyticsData(filter) {
  const configs = getChartDataConfigs(filter);

  if (chartInstances.attendance) {
    chartInstances.attendance.data = configs.attendance.data;
    chartInstances.attendance.update();
  }
  if (chartInstances.revenue) {
    chartInstances.revenue.data = configs.revenue.data;
    chartInstances.revenue.update();
  }
  if (chartInstances.turnstiles) {
    chartInstances.turnstiles.data = configs.turnstiles.data;
    chartInstances.turnstiles.update();
  }
  if (chartInstances.transit) {
    chartInstances.transit.data = configs.transit.data;
    chartInstances.transit.update();
  }
}

function getChartDataConfigs(filter) {
  // Return different dataset arrays depending on selected filters
  const dataStore = {
    '7days': {
      attendance: {
        labels: ['Jul 02', 'Jul 03', 'Jul 04', 'Jul 05', 'Jul 06', 'Jul 07', 'Jul 08'],
        values: [48000, 52000, 68000, 71000, 45000, 65000, 68420]
      },
      revenue: {
        labels: ['Tickets Sold', 'Food Concessions', 'Merchandise', 'VIP Plazas'],
        values: [62, 21, 12, 5]
      },
      turnstiles: {
        labels: ['Gate A', 'Gate B', 'Gate C', 'Gate D', 'Gate E', 'Gate F'],
        values: [420, 580, 310, 290, 890, 120]
      },
      transit: {
        labels: ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
        railVal: [25, 45, 80, 95, 40, 30],
        busVal: [10, 30, 65, 85, 55, 20]
      }
    },
    'today': {
      attendance: {
        labels: ['14:00', '15:00', '16:00', '17:00', '18:00', 'Live'],
        values: [5000, 15000, 35000, 58000, 68000, 68420]
      },
      revenue: {
        labels: ['Tickets Sold', 'Food Concessions', 'Merchandise', 'VIP Plazas'],
        values: [55, 30, 10, 5]
      },
      turnstiles: {
        labels: ['Gate A', 'Gate B', 'Gate C', 'Gate D', 'Gate E', 'Gate F'],
        values: [120, 320, 180, 150, 480, 0]
      },
      transit: {
        labels: ['14:00', '15:00', '16:00', '17:00', '18:00', 'Live'],
        railVal: [15, 35, 75, 98, 30, 10],
        busVal: [5, 20, 50, 80, 40, 5]
      }
    },
    'alltime': {
      attendance: {
        labels: ['Match 1', 'Match 2', 'Match 3', 'Match 4', 'Match 5', 'Match 6', 'Match 7'],
        values: [65000, 72000, 60000, 61000, 72000, 69000, 68420]
      },
      revenue: {
        labels: ['Tickets Sold', 'Food Concessions', 'Merchandise', 'VIP Plazas'],
        values: [70, 18, 8, 4]
      },
      turnstiles: {
        labels: ['Gate A', 'Gate B', 'Gate C', 'Gate D', 'Gate E', 'Gate F'],
        values: [2800, 3900, 2400, 2100, 4500, 950]
      },
      transit: {
        labels: ['Match 1', 'Match 2', 'Match 3', 'Match 4', 'Match 5', 'Match 6', 'Match 7'],
        railVal: [60, 85, 55, 70, 90, 80, 95],
        busVal: [45, 68, 40, 50, 80, 70, 85]
      }
    }
  };

  const selectedData = dataStore[filter];

  return {
    attendance: {
      data: {
        labels: selectedData.attendance.labels,
        datasets: [{
          label: 'Total Attendance',
          data: selectedData.attendance.values,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.3
        }]
      }
    },
    revenue: {
      data: {
        labels: selectedData.revenue.labels,
        datasets: [{
          data: selectedData.revenue.values,
          backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'],
          borderWidth: 1
        }]
      }
    },
    turnstiles: {
      data: {
        labels: selectedData.turnstiles.labels,
        datasets: [{
          data: selectedData.turnstiles.values,
          backgroundColor: 'rgba(37, 99, 235, 0.85)',
          borderRadius: 4
        }]
      }
    },
    transit: {
      data: {
        labels: selectedData.transit.labels,
        datasets: [
          {
            label: 'Light Rail Transit',
            data: selectedData.transit.railVal,
            borderColor: '#2563eb',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3
          },
          {
            label: 'Shuttle Bus Plazas',
            data: selectedData.transit.busVal,
            borderColor: '#10b981',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3
          }
        ]
      }
    }
  };
}
