// Rich Mock Data Module - StadiumBrain AI

export const tournamentsData = {
  world_cup_2026: {
    name: "FIFA World Cup 2026",
    venues: [
      { id: "metlife", name: "MetLife Stadium", city: "New York/New Jersey", capacity: 82500, status: "Active" },
      { id: "sofi", name: "SoFi Stadium", city: "Los Angeles", capacity: 70240, status: "Active" },
      { id: "azteca", name: "Estadio Azteca", city: "Mexico City", capacity: 87523, status: "Active" },
      { id: "bcplace", name: "BC Place", city: "Vancouver", capacity: 54500, status: "Maintenance" }
    ],
    referees: ["Szymon Marciniak (POL)", "Daniele Orsato (ITA)", "Clement Turpin (FRA)", "Wilton Sampaio (BRA)", "Yoshimi Yamashita (JPN)"],
    teams: [
      { id: "FRA", name: "France", badge: "🇫🇷", rank: 2 },
      { id: "ARG", name: "Argentina", badge: "🇦🇷", rank: 1 },
      { id: "BRA", name: "Brazil", badge: "🇧🇷", rank: 5 },
      { id: "ENG", name: "England", badge: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", rank: 4 },
      { id: "GER", name: "Germany", badge: "🇩🇪", rank: 16 },
      { id: "ESP", name: "Spain", badge: "🇪🇸", rank: 8 },
      { id: "USA", name: "United States", badge: "🇺🇸", rank: 11 },
      { id: "MEX", name: "Mexico", badge: "🇲🇽", rank: 14 }
    ],
    matches: [
      { id: 1, teamA: "FRA", teamB: "ARG", date: "2026-07-08", time: "18:00", venue: "MetLife Stadium", referee: "Szymon Marciniak (POL)", status: "Live", score: "2 - 1" },
      { id: 2, teamA: "BRA", teamB: "ENG", date: "2026-07-08", time: "21:00", venue: "SoFi Stadium", referee: "Daniele Orsato (ITA)", status: "Scheduled", score: "- : -" },
      { id: 3, teamA: "GER", teamB: "ESP", date: "2026-07-09", time: "17:00", venue: "Estadio Azteca", referee: "Clement Turpin (FRA)", status: "Scheduled", score: "- : -" },
      { id: 4, teamA: "USA", teamB: "MEX", date: "2026-07-07", time: "19:00", venue: "MetLife Stadium", referee: "Wilton Sampaio (BRA)", status: "Completed", score: "3 - 2" },
      { id: 5, teamA: "FRA", teamB: "BRA", date: "2026-07-08", time: "18:00", venue: "MetLife Stadium", referee: "Szymon Marciniak (POL)", status: "Scheduled", score: "- : -" }
    ]
  },
  olympics_2028: {
    name: "Summer Olympics 2028",
    venues: [
      { id: "la_coliseum", name: "LA Memorial Coliseum", city: "Los Angeles", capacity: 77500, status: "Active" },
      { id: "rose_bowl", name: "Rose Bowl", city: "Pasadena", capacity: 89702, status: "Active" }
    ],
    referees: ["Mark Clattenburg (GBR)", "Howard Webb (GBR)", "Nestor Pitana (ARG)"],
    teams: [
      { id: "USA", name: "United States", badge: "🇺🇸", rank: 1 },
      { id: "CHN", name: "China", badge: "🇨🇳", rank: 2 },
      { id: "JPN", name: "Japan", badge: "🇯🇵", rank: 3 },
      { id: "AUS", name: "Australia", badge: "🇦🇺", rank: 4 }
    ],
    matches: [
      { id: 101, teamA: "USA", teamB: "CHN", date: "2028-07-22", time: "16:00", venue: "LA Memorial Coliseum", referee: "Howard Webb (GBR)", status: "Scheduled", score: "- : -" },
      { id: 102, teamA: "JPN", teamB: "AUS", date: "2028-07-22", time: "19:00", venue: "Rose Bowl", referee: "Nestor Pitana (ARG)", status: "Scheduled", score: "- : -" }
    ]
  },
  champions_league: {
    name: "UEFA Champions League Finals",
    venues: [
      { id: "wembley", name: "Wembley Stadium", city: "London", capacity: 90000, status: "Active" }
    ],
    referees: ["Anthony Taylor (ENG)", "Felix Brych (GER)"],
    teams: [
      { id: "RMA", name: "Real Madrid", badge: "🇪🇸", rank: 1 },
      { id: "MCY", name: "Manchester City", badge: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", rank: 2 },
      { id: "BAY", name: "Bayern Munich", badge: "🇩🇪", rank: 3 },
      { id: "PSG", name: "Paris Saint-Germain", badge: "🇫🇷", rank: 4 }
    ],
    matches: [
      { id: 201, teamA: "RMA", teamB: "MCY", date: "2026-05-30", time: "20:45", venue: "Wembley Stadium", referee: "Felix Brych (GER)", status: "Completed", score: "2 - 1" }
    ]
  }
};

export const crowdInitialData = {
  gates: [
    { name: "Gate A", queueSize: 120, estWait: "4 min", status: "Open" },
    { name: "Gate B", queueSize: 450, estWait: "18 min", status: "Congested" },
    { name: "Gate C", queueSize: 90, estWait: "3 min", status: "Open" },
    { name: "Gate D", queueSize: 75, estWait: "2 min", status: "Open" },
    { name: "Gate E", queueSize: 680, estWait: "28 min", status: "Congested" },
    { name: "Gate F", queueSize: 0, estWait: "0 min", status: "Closed" }
  ],
  parking: [
    { name: "Parking Lot North (A)", occupancy: 820, capacity: 1000 },
    { name: "Parking Lot South (B)", occupancy: 990, capacity: 1000 },
    { name: "Transit Hub East", occupancy: 420, capacity: 600 },
    { name: "VIP Valet Lot", occupancy: 120, capacity: 300 }
  ],
  alerts: [
    { id: 1, gate: "Gate E", severity: "High", message: "Turnstile sensor jam. Queue bottlenecking, transit dispatch recommended.", active: true },
    { id: 2, gate: "Gate B", severity: "Medium", message: "Shuttle drop-off arrival causing localized surge.", active: true }
  ]
};

export const emergencyInitialData = {
  activeIncidents: [
    { id: 301, type: "Medical", location: "Gate E - Plaza Outer", severity: "High", description: "Heat exhaustion and syncopal episode. Awaiting dispatch.", time: "16:40", status: "Awaiting Dispatch" },
    { id: 302, type: "Security", location: "Zone B - Concourse Level 2", severity: "Medium", description: "Minor altercations between supporters. Security team on route.", time: "16:48", status: "Responding" }
  ],
  logHistory: [
    { id: 303, type: "Infrastructure", location: "Zone D - Restrooms", severity: "Low", description: "Water pressure drop in restroom block 4. Solved.", time: "15:20", status: "Resolved" }
  ]
};

export const sustainabilityInitialData = {
  energy: { solarPercent: 75, solarGen: 340, gridIntake: 113 },
  water: { recycledPercent: 60, rainwater: 45000, potable: 30000 },
  waste: { recyclingRate: 82, recycled: 8.2, landfill: 1.8 },
  carbon: { gross: 42.5, reforestation: -25.0, solarOffset: -18.5 },
  chargers: [
    { id: "EV-01", name: "Plaza North Charger 1", power: "150 kW DC", status: "Charging" },
    { id: "EV-02", name: "Plaza North Charger 2", power: "50 kW AC", status: "Available" },
    { id: "EV-03", name: "VIP Deck Charger 3", power: "150 kW DC", status: "Charging" },
    { id: "EV-04", name: "Transit Lot Charger 4", power: "11 kW AC", status: "Offline" }
  ]
};

// AI Response Database matching prompt modes
export const aiModesResponses = {
  Emergency: {
    situation: "Simulation Drill Activated. Simulated medical emergency at Gate E. Minor support brawls in Zone B.",
    assessment: "High risk of queue compaction at Gate E causing delay in emergency dispatch vehicle arrival. Low risk of riot escalation.",
    actions: `1. **Priority 1**: Dispatch paramedics from East Medical station to Gate E (estimated arrival: 3m 45s).\n2. **Priority 2**: Redirect security squad 4 from Stadium inner perimeter to Concourse Level 2.\n3. **Priority 3**: Toggle Gate E digital signage to broadcast standby routing instructions.`,
    risks: "Potential delays in ambulance arrival due to heavy pedestrian crowd density in Parking Lot South.",
    optimizations: "Automate emergency lane gate opening as soon as medical GPS sensors are within 2km of Stadium Outer Ring.",
    impact: "Evacuation route clear, dispatch time reduced by 2.5 minutes.",
    summary: "Simulated dispatch coordinates executed. Awaiting paramedic telemetry from Gate E.",
    why: "Paramedic units require clear transit corridors to keep dispatch arrival times under 4 minutes. Security containment must be deployed immediately to isolate minor stands arguments.",
    confidence: 98
  },
  Crowd: {
    situation: "High queue congestion at Gate E (wait time: 28 mins) and Gate B (wait time: 18 mins). Gates C & D remain underutilized.",
    assessment: "Transit buses dropping off spectators exclusively at Gate E, creating localized bottlenecks. Turning away fans to clear queues.",
    actions: `1. **Priority 1**: Redirect incoming transit shuttle buses to drop off at Transit Plaza West (closer to Gate C).\n2. **Priority 2**: Deploy mobile security stewards to Gate E queue line to physically filter fans to Gate D.\n3. **Priority 3**: Trigger push notification on Stadium app for attendees recommending Gate C.`,
    risks: "If buses are not rerouted within 10 minutes, turnstile crowding will spill into primary municipal highway pedestrian pathways.",
    optimizations: "Integrate bus GPS trackers with turnstile ticket scan rates to forecast load surges 15 minutes in advance.",
    impact: "Gate E wait time reduced to under 10 minutes; crowd density distributed symmetrically across all open gates.",
    summary: "Crowd flow rerouted. Spectators balanced across Gates C, D, and E.",
    why: "Gate E queues have exceeded safe containment limits on the outer concourse. Rerouting incoming shuttle transit vectors balances turnstile loads symmetrically.",
    confidence: 94
  },
  Schedule: {
    situation: "Matches scheduled across 3 major venues. Next match (FRA vs ARG) starts in 1h 45m.",
    assessment: "MetLife Stadium is at 95% capacity. High scheduling efficiency, no venue or referee conflicts detected for current block.",
    actions: `1. **Priority 1**: Align VAR technicians for post-briefing broadcast sync.\n2. **Priority 2**: Monitor travel fatigue indicators for visiting teams in tomorrow's fixture.\n3. **Priority 3**: Verify referee Szymon Marciniak stands ready for kickoff.`,
    risks: "Heavy broadcast vehicle traffic on Main ring road might delay second team's coach bus arrival.",
    optimizations: "Run machine learning schedules to automatically factor in transit delays based on historical highway traffic trends.",
    impact: "Zero scheduling delay. Broadcast sync complete.",
    summary: "Schedule optimal. Awaiting player arrival confirmations.",
    why: "Schedule configurations must synchronize venue capacities with referee bookings to prevent travel fatigue and broadcast slots conflicts.",
    confidence: 96
  },
  Finance: {
    situation: "Budget optimization for stadium staffing and food concessions vendors.",
    assessment: "Hourly concession stand transaction rate peaking. VIP valet services overstaffed by 15%.",
    actions: `1. **Priority 1**: Reallocate 6 valet staff units to General concessions stands to process high checkout lines.\n2. **Priority 2**: Renegotiate dynamic pricing incentives with drink vendors.\n3. **Priority 3**: Optimize cleanup staff rosters for post-match operations.`,
    risks: "Understaffing concessions causes revenue leaks due to cart abandonment.",
    optimizations: "Integrate POS transaction volume trackers to automatically trigger labor dispatch suggestions.",
    impact: "Estimated labor cost reduction: $4,500/match. Revenue increased by 8.5% due to reduced queue abandonment.",
    summary: "Labor optimization complete. Dynamic staffing reallocated.",
    why: "Dynamic staffing reallocations optimize resource utilisation matching peak spectator checkout volumes at food concourses.",
    confidence: 91
  },
  Media: {
    situation: "Media reporting for FRA vs ARG match preview.",
    assessment: "High global broadcast attention. Social media traction up 45% compared to group stage.",
    actions: `1. **Priority 1**: Issue Match Day press release to accredited journalists.\n2. **Priority 2**: Sync live commentary feed to Stadium App broadcast engine.\n3. **Priority 3**: Push match preview graphics across official social handles.`,
    risks: "Press room Wi-Fi bandwidth congestion limits live photo uploads.",
    optimizations: "Setup dedicated 5G broadcast cell networks for media work areas.",
    impact: "Media satisfaction rate increased. Social engagement optimized.",
    summary: "Match preview packages distributed. Press room operational check complete.",
    why: "Press packages must distribute exactly 90 minutes before kickoff to fulfill TV media rights holder agreements and social synchronization.",
    confidence: 89
  },
  Sustainability: {
    situation: "Sustainability metrics: Solar energy output is at 75% total supply. Recycling rate at 82%.",
    assessment: "High solar radiation enables net energy exports to local power grid. Potable water drawn remains higher than desired.",
    actions: `1. **Priority 1**: Divert solar battery storage reserves to stadium floodlight grids for tonight's game.\n2. **Priority 2**: Activate secondary rainwater recycling filters to supply field irrigation systems.\n3. **Priority 3**: Enforce zero-single-use-plastic compliance audit across East Stand concession booths.`,
    risks: "Battery storage degradation if overcharged during off-peak sunshine hours.",
    optimizations: "Deploy ML models to forecast solar generation alongside energy price curves for optimal grid arbitrage.",
    impact: "Carbon footprint reduced by 1.2 tCO2e per matchday. Water recycling efficiency increased to 70%.",
    summary: "Resource conservation parameters set. Solar grid priority activated.",
    why: "Battery grid storage routing reduces match-day peak energy grid demands, maximizing carbon offsets and dynamic pricing arb advantages.",
    confidence: 95
  },
  Accessibility: {
    situation: "Accessibility pathways and audio support compliance check.",
    assessment: "Elevator 2 in West Stand is currently undergoing preventative maintenance. Alternative wheelchair routes are required.",
    actions: `1. **Priority 1**: Station accessibility stewards at West Entrance to escort wheelchair users to Elevator 3.\n2. **Priority 2**: Activate closed-captioning feeds on Jumbotron screens for announcements.\n3. **Priority 3**: Broadcast audio descriptions for visually impaired spectators on FM band 88.5.`,
    risks: "Long queues at Elevator 3 due to temporary load consolidation.",
    optimizations: "Integrate wheelchair ticketing barcodes with elevators to reserve priority elevator dispatching.",
    impact: "Full accessibility compliance. Assistive pathways clear. Transit delay minimized.",
    summary: "Accessibility protocols updated. Alternative wheelchair routes mapped.",
    why: "West Stand elevator maintenance requires alternative wheelchair dispatch routing to prevent lobby crowding and ensure ADA compliance.",
    confidence: 97
  }
};
