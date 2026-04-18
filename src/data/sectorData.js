// Static datasets per sector — swapped on button clicks

export const SECTOR_DATA = {
  enterprise: {
    label: 'EcoSense Enterprise Portfolio',
    live: { energy: 8640, co2: 3456, cost: 1280000, renewable: 35 },
    forecast: {
      '24h': [
        { t: '00:00', co2: 280, budget: 350 }, { t: '03:00', co2: 260, budget: 350 },
        { t: '06:00', co2: 290, budget: 350 }, { t: '09:00', co2: 380, budget: 350 },
        { t: '12:00', co2: 420, budget: 350 }, { t: '15:00', co2: 410, budget: 350 },
        { t: '18:00', co2: 360, budget: 350 }, { t: '21:00', co2: 310, budget: 350 },
      ],
      '7d': [
        { t: 'Mon', co2: 3200, budget: 3500 }, { t: 'Tue', co2: 3450, budget: 3500 },
        { t: 'Wed', co2: 3800, budget: 3500 }, { t: 'Thu', co2: 3600, budget: 3500 },
        { t: 'Fri', co2: 4100, budget: 3500 }, { t: 'Sat', co2: 2800, budget: 3500 },
        { t: 'Sun', co2: 2500, budget: 3500 },
      ],
      '30d': [
        { t: 'W1', co2: 22000, budget: 24000 }, { t: 'W2', co2: 25000, budget: 24000 },
        { t: 'W3', co2: 23500, budget: 24000 }, { t: 'W4', co2: 26000, budget: 24000 },
      ],
    },
    sectorDNA: {
      peakHour: '11 AM – 3 PM',
      baseLoad: '3200 kWh',
      coolingDep: '52%',
      comparison: 5,
      energyBreakdown: [
        { name: 'Cooling', value: 52 }, { name: 'Lighting', value: 18 },
        { name: 'Servers', value: 22 }, { name: 'Other', value: 8 },
      ],
      recommendations: [
        'Deploy demand-response automation across all 3 sites — save ₹85,000/month',
        'Consolidate night-shift operations to 1 building — save ₹40,000/month',
        'Smart metering with anomaly detection can flag ₹12,000 monthly waste',
        'Cross-site renewable trading between buildings can save 8% grid cost',
      ],
    },
    energyFlow: {
      solar: 2400, battery: 1200, grid: 5040, building: 8640,
      cooling: 4493, lighting: 1555, servers: 1901, other: 691,
    },
    coolant: {
      actual: 4493, required: 3800, temp: [[0,21],[4,21],[8,23],[12,28],[16,31],[20,28],[24,23]],
      efficiency: 68,
    },
    passive: {
      solarGen: 2400, solarEff: 82, heatRecovered: 310, motionSaved: 24, occupancyPct: 62,
    },
    carbonCredit: {
      totalSaved: 1240, credits: 1240, valueINR: 1860000,
      monthly: [
        { m: 'Nov', saved: 168 }, { m: 'Dec', saved: 195 }, { m: 'Jan', saved: 220 },
        { m: 'Feb', saved: 188 }, { m: 'Mar', saved: 242 }, { m: 'Apr', saved: 227 },
      ],
      esgScore: 78,
    },
    alerts: [
      { id: 1, level: 'critical', msg: 'Site 2 exceeding monthly carbon budget — immediate action needed', time: '1 min ago' },
      { id: 2, level: 'warning', msg: 'Combined cooling load 18% above benchmark this week', time: '22 min ago' },
      { id: 3, level: 'info', msg: 'AI automation saved ₹14,200 yesterday via load scheduling', time: '5 hr ago' },
      { id: 4, level: 'success', msg: 'Q1 ESG targets met — carbon credits generated: 412 tCO₂e', time: '1 day ago' },
    ],
    buildings: [
      { name: 'HQ Tower, Mumbai', score: 78, energy: 3200, co2: 1280 },
      { name: 'Tech Park, Bangalore', score: 82, energy: 2800, co2: 1120 },
      { name: 'Campus, Hyderabad', score: 62, energy: 2640, co2: 1056 },
    ],
  },

  school: {
    label: 'Delhi Public School, Noida',
    live: { energy: 420, co2: 168, cost: 62000, renewable: 52 },
    forecast: {
      '24h': [
        { t: '00:00', co2: 5, budget: 20 }, { t: '03:00', co2: 4, budget: 20 },
        { t: '06:00', co2: 8, budget: 20 }, { t: '09:00', co2: 22, budget: 20 },
        { t: '12:00', co2: 28, budget: 20 }, { t: '15:00', co2: 25, budget: 20 },
        { t: '18:00', co2: 14, budget: 20 }, { t: '21:00', co2: 6, budget: 20 },
      ],
      '7d': [
        { t: 'Mon', co2: 155, budget: 180 }, { t: 'Tue', co2: 162, budget: 180 },
        { t: 'Wed', co2: 148, budget: 180 }, { t: 'Thu', co2: 170, budget: 180 },
        { t: 'Fri', co2: 158, budget: 180 }, { t: 'Sat', co2: 42, budget: 180 },
        { t: 'Sun', co2: 18, budget: 180 },
      ],
      '30d': [
        { t: 'W1', co2: 820, budget: 900 }, { t: 'W2', co2: 760, budget: 900 },
        { t: 'W3', co2: 880, budget: 900 }, { t: 'W4', co2: 740, budget: 900 },
      ],
    },
    sectorDNA: {
      peakHour: '9 AM – 1 PM',
      baseLoad: '85 kWh',
      coolingDep: '38%',
      comparison: -12,
      energyBreakdown: [
        { name: 'Cooling', value: 38 }, { name: 'Lighting', value: 34 },
        { name: 'Computer Lab', value: 18 }, { name: 'Other', value: 10 },
      ],
      recommendations: [
        'Install solar panels on rooftop — 40 kWp can cover 55% of school energy needs',
        'Switch to LED lighting in all classrooms — saves ₹8,000/month',
        'Schedule computer labs shutdown 30 mins before closing — saves ₹2,400/month',
        'Install motion sensors in toilets and corridors for automatic lighting',
      ],
    },
    energyFlow: {
      solar: 180, battery: 60, grid: 180, building: 420,
      cooling: 160, lighting: 143, computers: 76, other: 41,
    },
    coolant: {
      actual: 160, required: 130, temp: [[0,24],[4,23],[8,26],[12,32],[16,34],[20,28],[24,25]],
      efficiency: 76,
    },
    passive: {
      solarGen: 180, solarEff: 81, heatRecovered: 12, motionSaved: 28, occupancyPct: 72,
    },
    carbonCredit: {
      totalSaved: 48, credits: 48, valueINR: 72000,
      monthly: [
        { m: 'Nov', saved: 6 }, { m: 'Dec', saved: 5 }, { m: 'Jan', saved: 7 },
        { m: 'Feb', saved: 8 }, { m: 'Mar', saved: 10 }, { m: 'Apr', saved: 12 },
      ],
      esgScore: 81,
    },
    alerts: [
      { id: 1, level: 'warning', msg: 'Computer lab AC running all night — no occupancy detected', time: '6 min ago' },
      { id: 2, level: 'info', msg: 'Solar generation at 92% efficiency today — optimal weather', time: '45 min ago' },
      { id: 3, level: 'info', msg: 'Weekend shutdown saved 18 kWh — keep up the habit!', time: '2 hr ago' },
      { id: 4, level: 'success', msg: 'Carbon footprint reduced 12% vs last month — great progress!', time: '1 day ago' },
    ],
    buildings: [
      { name: 'Main Block', score: 82, energy: 180, co2: 72 },
      { name: 'Science Wing', score: 74, energy: 140, co2: 56 },
      { name: 'Sports Complex', score: 65, energy: 100, co2: 40 },
    ],
  },

  college: {
    label: 'IIT Bombay, Mumbai',
    live: { energy: 1280, co2: 512, cost: 192000, renewable: 48 },
    forecast: {
      '24h': [
        { t: '00:00', co2: 32, budget: 55 }, { t: '03:00', co2: 28, budget: 55 },
        { t: '06:00', co2: 35, budget: 55 }, { t: '09:00', co2: 68, budget: 55 },
        { t: '12:00', co2: 78, budget: 55 }, { t: '15:00', co2: 72, budget: 55 },
        { t: '18:00', co2: 58, budget: 55 }, { t: '21:00', co2: 42, budget: 55 },
      ],
      '7d': [
        { t: 'Mon', co2: 480, budget: 520 }, { t: 'Tue', co2: 510, budget: 520 },
        { t: 'Wed', co2: 490, budget: 520 }, { t: 'Thu', co2: 540, budget: 520 },
        { t: 'Fri', co2: 520, budget: 520 }, { t: 'Sat', co2: 280, budget: 520 },
        { t: 'Sun', co2: 180, budget: 520 },
      ],
      '30d': [
        { t: 'W1', co2: 3000, budget: 3500 }, { t: 'W2', co2: 3200, budget: 3500 },
        { t: 'W3', co2: 2800, budget: 3500 }, { t: 'W4', co2: 3400, budget: 3500 },
      ],
    },
    sectorDNA: {
      peakHour: '10 AM – 2 PM',
      baseLoad: '320 kWh',
      coolingDep: '44%',
      comparison: -5,
      energyBreakdown: [
        { name: 'Cooling', value: 44 }, { name: 'Lighting', value: 22 },
        { name: 'Research Labs', value: 24 }, { name: 'Other', value: 10 },
      ],
      recommendations: [
        'Install 200 kWp rooftop solar across hostels — covers 40% of residential load',
        'Replace old lab equipment with BEE 5-star rated alternatives — save ₹28,000/month',
        'Optimize hostel AC scheduling — enforce 26°C setpoint policy',
        'Smart metering in each department — creates awareness and peer benchmarking',
      ],
    },
    energyFlow: {
      solar: 480, battery: 220, grid: 580, building: 1280,
      cooling: 563, lighting: 282, labs: 307, other: 128,
    },
    coolant: {
      actual: 563, required: 480, temp: [[0,23],[4,22],[8,25],[12,30],[16,33],[20,29],[24,24]],
      efficiency: 78,
    },
    passive: {
      solarGen: 480, solarEff: 84, heatRecovered: 62, motionSaved: 22, occupancyPct: 58,
    },
    carbonCredit: {
      totalSaved: 168, credits: 168, valueINR: 252000,
      monthly: [
        { m: 'Nov', saved: 22 }, { m: 'Dec', saved: 25 }, { m: 'Jan', saved: 28 },
        { m: 'Feb', saved: 24 }, { m: 'Mar', saved: 32 }, { m: 'Apr', saved: 37 },
      ],
      esgScore: 79,
    },
    alerts: [
      { id: 1, level: 'critical', msg: 'Research lab HVAC fault — energy spiking 35% above normal', time: '3 min ago' },
      { id: 2, level: 'warning', msg: 'Hostel D energy consumption above monthly average', time: '25 min ago' },
      { id: 3, level: 'info', msg: 'Solar generation exceeds forecast by 12% this week', time: '1 hr ago' },
      { id: 4, level: 'success', msg: 'Green campus certification renewed — ESG score: 79', time: '2 days ago' },
    ],
    buildings: [
      { name: 'Main Academic Block', score: 80, energy: 480, co2: 192 },
      { name: 'Research Quad', score: 72, energy: 420, co2: 168 },
      { name: 'Hostel Complex', score: 68, energy: 380, co2: 152 },
    ],
  },

  factory: {
    label: 'Patil Industries, Pune',
    live: { energy: 3840, co2: 1728, cost: 580000, renewable: 28 },
    forecast: {
      '24h': [
        { t: '00:00', co2: 120, budget: 160 }, { t: '03:00', co2: 115, budget: 160 },
        { t: '06:00', co2: 138, budget: 160 }, { t: '09:00', co2: 195, budget: 160 },
        { t: '12:00', co2: 220, budget: 160 }, { t: '15:00', co2: 210, budget: 160 },
        { t: '18:00', co2: 182, budget: 160 }, { t: '21:00', co2: 145, budget: 160 },
      ],
      '7d': [
        { t: 'Mon', co2: 1620, budget: 1500 }, { t: 'Tue', co2: 1580, budget: 1500 },
        { t: 'Wed', co2: 1750, budget: 1500 }, { t: 'Thu', co2: 1690, budget: 1500 },
        { t: 'Fri', co2: 1920, budget: 1500 }, { t: 'Sat', co2: 980, budget: 1500 },
        { t: 'Sun', co2: 320, budget: 1500 },
      ],
      '30d': [
        { t: 'W1', co2: 9800, budget: 9000 }, { t: 'W2', co2: 10500, budget: 9000 },
        { t: 'W3', co2: 9200, budget: 9000 }, { t: 'W4', co2: 11200, budget: 9000 },
      ],
    },
    sectorDNA: {
      peakHour: '9 AM – 5 PM',
      baseLoad: '1400 kWh',
      coolingDep: '58%',
      comparison: 22,
      energyBreakdown: [
        { name: 'Machinery', value: 42 }, { name: 'Cooling', value: 28 },
        { name: 'Lighting', value: 16 }, { name: 'HVAC', value: 14 },
      ],
      recommendations: [
        'Install variable frequency drives (VFDs) on motors — reduce motor energy by 20-30%',
        'Implement waste heat recovery from furnaces — estimated savings ₹45,000/month',
        'Switch to solar for daytime shift lighting — 150 kWp can save ₹22,000/month',
        'Carbon trading: excess weekend carbon budget can be sold on marketplace',
      ],
    },
    energyFlow: {
      solar: 800, battery: 400, grid: 2640, building: 3840,
      machinery: 1613, cooling: 1075, lighting: 614, hvac: 538,
    },
    coolant: {
      actual: 1075, required: 850, temp: [[0,26],[4,25],[8,29],[12,36],[16,38],[20,34],[24,28]],
      efficiency: 65,
    },
    passive: {
      solarGen: 800, solarEff: 74, heatRecovered: 280, motionSaved: 14, occupancyPct: 80,
    },
    carbonCredit: {
      totalSaved: 320, credits: 320, valueINR: 480000,
      monthly: [
        { m: 'Nov', saved: 38 }, { m: 'Dec', saved: 45 }, { m: 'Jan', saved: 52 },
        { m: 'Feb', saved: 48 }, { m: 'Mar', saved: 62 }, { m: 'Apr', saved: 75 },
      ],
      esgScore: 61,
    },
    alerts: [
      { id: 1, level: 'critical', msg: 'Production floor energy 28% over shift target — check Line 3', time: '2 min ago' },
      { id: 2, level: 'critical', msg: 'Monthly carbon budget exceeded by 18% — intervention required', time: '10 min ago' },
      { id: 3, level: 'warning', msg: 'Compressor efficiency dropped to 65% — scheduled maintenance due', time: '1 hr ago' },
      { id: 4, level: 'info', msg: 'Weekend shutdown plan active — estimated ₹48,000 savings', time: '3 hr ago' },
    ],
    buildings: [
      { name: 'Production Floor A', score: 58, energy: 1600, co2: 720 },
      { name: 'Production Floor B', score: 62, energy: 1400, co2: 630 },
      { name: 'Admin & Utility Block', score: 74, energy: 840, co2: 378 },
    ],
  },

  corporate: {
    label: 'TechCorp India HQ, Gurugram',
    live: { energy: 1640, co2: 656, cost: 248000, renewable: 44 },
    forecast: {
      '24h': [
        { t: '00:00', co2: 22, budget: 70 }, { t: '03:00', co2: 18, budget: 70 },
        { t: '06:00', co2: 28, budget: 70 }, { t: '09:00', co2: 82, budget: 70 },
        { t: '12:00', co2: 96, budget: 70 }, { t: '15:00', co2: 88, budget: 70 },
        { t: '18:00', co2: 72, budget: 70 }, { t: '21:00', co2: 38, budget: 70 },
      ],
      '7d': [
        { t: 'Mon', co2: 620, budget: 680 }, { t: 'Tue', co2: 645, budget: 680 },
        { t: 'Wed', co2: 598, budget: 680 }, { t: 'Thu', co2: 672, budget: 680 },
        { t: 'Fri', co2: 658, budget: 680 }, { t: 'Sat', co2: 210, budget: 680 },
        { t: 'Sun', co2: 88, budget: 680 },
      ],
      '30d': [
        { t: 'W1', co2: 3800, budget: 4200 }, { t: 'W2', co2: 4050, budget: 4200 },
        { t: 'W3', co2: 3700, budget: 4200 }, { t: 'W4', co2: 4300, budget: 4200 },
      ],
    },
    sectorDNA: {
      peakHour: '10 AM – 3 PM',
      baseLoad: '380 kWh',
      coolingDep: '46%',
      comparison: -6,
      energyBreakdown: [
        { name: 'Cooling', value: 46 }, { name: 'Lighting', value: 24 },
        { name: 'IT Equipment', value: 22 }, { name: 'Other', value: 8 },
      ],
      recommendations: [
        'Enable smart occupancy-based HVAC zones — saves 18% cooling cost',
        'Upgrade to LED smart lighting with daylight harvesting — ₹15,000/month saving',
        'Schedule IT server power-down for non-peak hours (8PM–7AM)',
        'Add 100 kWp rooftop solar — 3.4-year ROI, reduces grid dependency by 30%',
      ],
    },
    energyFlow: {
      solar: 560, battery: 280, grid: 800, building: 1640,
      cooling: 754, lighting: 394, it: 361, other: 131,
    },
    coolant: {
      actual: 754, required: 620, temp: [[0,23],[4,22],[8,25],[12,30],[16,32],[20,28],[24,24]],
      efficiency: 80,
    },
    passive: {
      solarGen: 560, solarEff: 83, heatRecovered: 72, motionSaved: 32, occupancyPct: 65,
    },
    carbonCredit: {
      totalSaved: 224, credits: 224, valueINR: 336000,
      monthly: [
        { m: 'Nov', saved: 30 }, { m: 'Dec', saved: 34 }, { m: 'Jan', saved: 38 },
        { m: 'Feb', saved: 36 }, { m: 'Mar', saved: 42 }, { m: 'Apr', saved: 44 },
      ],
      esgScore: 83,
    },
    alerts: [
      { id: 1, level: 'warning', msg: 'Floor 5 HVAC running at 110% capacity — check thermostat settings', time: '8 min ago' },
      { id: 2, level: 'warning', msg: 'Carbon budget 78% utilized — 3 weeks remaining in month', time: '35 min ago' },
      { id: 3, level: 'info', msg: 'Weekend power-down mode saved ₹22,000 this month', time: '2 hr ago' },
      { id: 4, level: 'success', msg: 'ESG score improved to 83 — top 15% in corporate benchmark', time: '1 day ago' },
    ],
    buildings: [
      { name: 'Tower A – Offices', score: 84, energy: 720, co2: 288 },
      { name: 'Tower B – Labs', score: 78, energy: 580, co2: 232 },
      { name: 'Common Area & Cafeteria', score: 72, energy: 340, co2: 136 },
    ],
  },
};
