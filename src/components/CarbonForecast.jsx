import { useState } from 'react';
import { TrendingUp, AlertTriangle, Calendar } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function CarbonForecast({ data }) {
  const [range, setRange] = useState('24h');
  const chartData = data.forecast[range];

  const maxCo2 = Math.max(...chartData.map(d => d.co2));
  const budget = chartData[0].budget;
  const willExceed = maxCo2 > budget;
  const exceedDays = range === '7d' ? chartData.filter(d => d.co2 > d.budget).length : null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Carbon Forecast Engine</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">AI-predicted emissions vs your carbon budget</p>
        </div>
        {/* Range selector */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {['24h', '7d', '30d'].map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${range === r ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Alert banner */}
      {willExceed && (
        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800/40 rounded-xl px-4 py-3 animate-pulse-slow">
          <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
          <div>
            <div className="text-sm font-semibold text-red-600 dark:text-red-400">
              {range === '24h' ? 'Carbon budget will be exceeded today' :
               range === '7d' ? `Carbon budget exceeded on ${exceedDays} day(s) this week` :
               'Monthly carbon budget at risk — Week 2 & 4 projected to exceed limit'}
            </div>
            <div className="text-xs text-red-500/80 dark:text-red-400/70 mt-0.5">Immediate action recommended to avoid penalties</div>
          </div>
        </div>
      )}

      {/* Main chart */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5"><div className="w-3 h-1 bg-emerald-500 rounded" /><span>Predicted CO₂ (kg)</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-1 bg-red-400 rounded border-dashed border border-red-400" /><span>Carbon Budget</span></div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-800" />
            <XAxis dataKey="t" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f9fafb', fontSize: 12 }}
              formatter={(v, n) => [v, n === 'co2' ? 'CO₂ (kg)' : 'Budget (kg)']}
            />
            <ReferenceLine y={budget} stroke="#ef4444" strokeDasharray="6 3" strokeWidth={1.5} />
            <Area type="monotone" dataKey="co2" stroke="#10b981" strokeWidth={2.5} fill="url(#forecastGrad)" dot={false}
              activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
            <Area type="monotone" dataKey="budget" stroke="transparent" fill="none" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: TrendingUp, label: 'Peak Predicted', value: `${maxCo2.toLocaleString()} kg`,
            sub: 'CO₂e', color: willExceed ? 'text-red-500' : 'text-emerald-500',
            bg: willExceed ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800/30' : 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/30',
          },
          {
            icon: Calendar, label: 'Carbon Budget', value: `${budget.toLocaleString()} kg`,
            sub: `Per ${range === '24h' ? 'day' : range === '7d' ? 'day' : 'week'}`, color: 'text-cyan-500',
            bg: 'bg-cyan-50 dark:bg-cyan-900/10 border-cyan-100 dark:border-cyan-800/30',
          },
          {
            icon: AlertTriangle, label: 'Budget Variance', value: `${maxCo2 > budget ? '+' : ''}${((maxCo2 - budget) / budget * 100).toFixed(1)}%`,
            sub: maxCo2 > budget ? 'Over budget' : 'Under budget', color: maxCo2 > budget ? 'text-red-500' : 'text-emerald-500',
            bg: maxCo2 > budget ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800/30' : 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/30',
          },
        ].map(c => (
          <div key={c.label} className={`rounded-xl p-4 border ${c.bg}`}>
            <c.icon size={20} className={`${c.color} mb-2`} />
            <div className={`text-xl font-bold ${c.color}`}>{c.value}</div>
            <div className="text-xs font-medium text-gray-600 dark:text-gray-300 mt-0.5">{c.label}</div>
            <div className="text-xs text-gray-400 dark:text-gray-500">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* AI Forecast insights */}
      <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/10 dark:to-cyan-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-xl p-4">
        <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-2">🤖 AI Forecast Insights</div>
        <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
          {willExceed
            ? <>
                <li>• Emissions will exceed budget by {((maxCo2 - budget) / budget * 100).toFixed(0)}% — consider load shifting</li>
                <li>• Activating 2-hour solar priority mode could reduce peak by 12%</li>
                <li>• Pre-cooling during off-peak can reduce {range === '24h' ? 'today\'s' : 'weekly'} peak by an estimated 8-15%</li>
              </>
            : <>
                <li>• Emissions are within budget — system operating efficiently</li>
                <li>• Renewable contribution is optimal for this period</li>
                <li>• Maintaining current automation rules will keep budget on track</li>
              </>
          }
        </ul>
      </div>
    </div>
  );
}
