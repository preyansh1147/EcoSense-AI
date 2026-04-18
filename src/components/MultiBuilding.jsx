import { Building2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

function ScoreBar({ score }) {
  const color = score >= 80 ? 'bg-emerald-500' : score >= 65 ? 'bg-cyan-500' : 'bg-amber-500';
  return (
    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mt-1">
      <div className={`h-2 rounded-full transition-all duration-1000 ${color}`} style={{ width: `${score}%` }} />
    </div>
  );
}

export default function MultiBuilding({ data }) {
  const { buildings, live } = data;

  const sorted = [...buildings].sort((a, b) => b.score - a.score);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  const radarData = buildings.map(b => ({
    building: b.name.split(',')[0].split(' ').slice(0, 2).join(' '),
    energy: Math.round((1 - b.energy / Math.max(...buildings.map(x => x.energy))) * 100),
    co2: Math.round((1 - b.co2 / Math.max(...buildings.map(x => x.co2))) * 100),
    score: b.score,
  }));

  const BENCHMARKS = [
    { metric: 'Energy Intensity', yours: `${(live.energy / buildings.length).toFixed(0)} kWh/day/bldg`, sector: '2,800 kWh', status: 'better' },
    { metric: 'CO₂ per sq.ft', yours: '0.08 kg', sector: '0.12 kg', status: 'better' },
    { metric: 'Renewable %', yours: `${live.renewable}%`, sector: '22%', status: live.renewable > 22 ? 'better' : 'worse' },
    { metric: 'Cooling Efficiency', yours: `${data.coolant.efficiency}%`, sector: '71%', status: data.coolant.efficiency > 71 ? 'better' : 'worse' },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Multi-Building Overview</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Portfolio performance comparison & sector benchmarks</p>
      </div>

      {/* Best/Worst */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-emerald-500" />
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Best Performing</div>
          </div>
          <div className="text-sm font-bold text-gray-900 dark:text-white">{best.name}</div>
          <div className="text-2xl font-black text-emerald-500 mt-1">{best.score}<span className="text-sm font-normal text-gray-400">/100</span></div>
          <ScoreBar score={best.score} />
        </div>
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={16} className="text-red-500" />
            <div className="text-xs font-semibold text-red-600 dark:text-red-400">Needs Attention</div>
          </div>
          <div className="text-sm font-bold text-gray-900 dark:text-white">{worst.name}</div>
          <div className="text-2xl font-black text-red-500 mt-1">{worst.score}<span className="text-sm font-normal text-gray-400">/100</span></div>
          <ScoreBar score={worst.score} />
        </div>
      </div>

      {/* Building cards */}
      <div className="space-y-3">
        {sorted.map((b, i) => (
          <div key={b.name} className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm card-hover">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                #{i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{b.name}</div>
                <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  <span>⚡ {b.energy.toLocaleString()} kWh</span>
                  <span>☁ {b.co2.toLocaleString()} kg CO₂</span>
                </div>
                <ScoreBar score={b.score} />
              </div>
              <div className={`text-2xl font-black flex-shrink-0 ${b.score >= 80 ? 'text-emerald-500' : b.score >= 65 ? 'text-cyan-500' : 'text-amber-500'}`}>
                {b.score}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bar comparison */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Energy vs CO₂ by Building</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={buildings} margin={{ left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-800" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false}
              tickFormatter={v => v.split(',')[0].split(' ').slice(0, 2).join(' ')} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f9fafb', fontSize: 12 }} />
            <Bar dataKey="energy" name="Energy (kWh)" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="co2" name="CO₂ (kg)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sector benchmarks */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Sector Benchmarks</div>
        <div className="space-y-2">
          {BENCHMARKS.map(b => (
            <div key={b.metric} className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
              <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">{b.metric}</div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">{b.yours}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500">vs {b.sector} avg</div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${b.status === 'better' ? 'text-emerald-500' : 'text-red-500'}`}>
                {b.status === 'better' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {b.status === 'better' ? 'Better' : 'Below'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
