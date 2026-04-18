import { Sun, Flame, Activity, TrendingUp } from 'lucide-react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';

export default function PassiveEnergy({ data }) {
  const { passive } = data;
  const { solarGen, solarEff, heatRecovered, motionSaved, occupancyPct } = passive;

  const solarData = [
    { h: '6AM', kwh: 20 }, { h: '8AM', kwh: 65 }, { h: '10AM', kwh: 110 },
    { h: '12PM', kwh: solarGen * 0.28 }, { h: '2PM', kwh: solarGen * 0.25 },
    { h: '4PM', kwh: solarGen * 0.18 }, { h: '6PM', kwh: 40 }, { h: '8PM', kwh: 0 },
  ].map(d => ({ ...d, kwh: Math.round(d.kwh) }));

  const occupancyHeatmap = [
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    [75, 82, 88, 85, 90, 45, 30],
    [65, 78, 80, 76, 88, 38, 25],
    [80, 85, 92, 89, 95, 50, 35],
  ];

  const getHeatColor = (v) => {
    if (v > 80) return 'bg-emerald-500';
    if (v > 60) return 'bg-emerald-300 dark:bg-emerald-700';
    if (v > 40) return 'bg-emerald-100 dark:bg-emerald-900';
    return 'bg-gray-100 dark:bg-gray-800';
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Passive Energy Module</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Solar generation, heat recovery & motion sensors</p>
      </div>

      {/* Solar stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-100 dark:border-amber-800/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sun size={20} className="text-amber-500" />
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Solar Generation</div>
          </div>
          <div className="flex items-end gap-3 mb-4">
            <div className="text-4xl font-bold text-amber-600 dark:text-amber-400">{solarGen}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">kWh today</div>
            <div className="ml-auto text-sm font-bold text-emerald-600 dark:text-emerald-400">{solarEff}% eff.</div>
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={solarData}>
              <defs>
                <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="h" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f9fafb', fontSize: 11 }} formatter={v => [`${v} kWh`]} />
              <Area type="monotone" dataKey="kwh" stroke="#f59e0b" strokeWidth={2} fill="url(#solarGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>

          {/* Efficiency bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Panel Efficiency</span><span>{solarEff}%</span>
            </div>
            <div className="w-full bg-amber-100 dark:bg-amber-900/30 rounded-full h-2">
              <div className="bg-amber-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${solarEff}%` }} />
            </div>
          </div>
        </div>

        {/* Heat recovery + Motion */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 border border-red-100 dark:border-red-800/30 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Flame size={18} className="text-red-500" />
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Heat Recovery</div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-red-500">{heatRecovered} kWh</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Waste heat captured & reused</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">₹{(heatRecovered * 8).toLocaleString()}</div>
                <div className="text-xs text-gray-400">Saved today</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 border border-purple-100 dark:border-purple-800/30 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={18} className="text-purple-500" />
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Motion Sensor Savings</div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-500">{motionSaved}%</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Energy saved via occupancy automation</div>
              </div>
              <div className="w-14 h-14 relative">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="3.5" className="dark:stroke-gray-700" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#a855f7" strokeWidth="3.5"
                    strokeDasharray={`${motionSaved} ${100 - motionSaved}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-purple-500">{motionSaved}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Occupancy heatmap */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">Occupancy Heatmap (Weekly)</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Avg: <span className="text-emerald-500 font-semibold">{occupancyPct}%</span></div>
        </div>
        <div className="flex items-center gap-1 mb-2">
          {occupancyHeatmap[0].map(day => (
            <div key={day} className="flex-1 text-center text-[10px] text-gray-500 dark:text-gray-400 font-medium">{day}</div>
          ))}
        </div>
        {['Morning', 'Afternoon', 'Evening'].map((period, ri) => (
          <div key={period} className="flex items-center gap-1 mb-1">
            {occupancyHeatmap[ri + 1].map((val, ci) => (
              <div key={ci} title={`${period}: ${val}%`}
                className={`flex-1 h-8 rounded ${getHeatColor(val)} transition-all duration-500 flex items-center justify-center cursor-default hover:opacity-80`}>
                <span className="text-[9px] font-medium text-gray-600 dark:text-gray-300 opacity-0 hover:opacity-100">{val}</span>
              </div>
            ))}
          </div>
        ))}
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-gray-100 dark:bg-gray-800" />Low</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-emerald-300 dark:bg-emerald-700" />Medium</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-emerald-500" />High</div>
        </div>
      </div>
    </div>
  );
}
