import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Thermometer, Gauge, Wind, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useState } from 'react';

export default function CoolantIntelligence({ data }) {
  const { coolant } = data;
  const { actual, required, temp, efficiency } = coolant;
  const [targetTemp, setTargetTemp] = useState(22);

  const excess = actual - required;
  const excessPct = ((excess / required) * 100).toFixed(1);
  const tempData = temp.map(([h, t]) => ({ h: `${h}:00`, temp: t, ideal: 22 }));

  const zoneTemps = [
    { zone: 'Zone A', temp: 23.5, status: 'optimal' },
    { zone: 'Zone B', temp: 27.8, status: 'high' },
    { zone: 'Zone C', temp: 21.2, status: 'optimal' },
    { zone: 'Zone D', temp: 19.4, status: 'low' },
    { zone: 'Zone E', temp: 25.1, status: 'warning' },
    { zone: 'Zone F', temp: 22.0, status: 'optimal' },
  ];

  const statusColor = { optimal: 'bg-emerald-500', high: 'bg-red-500', warning: 'bg-amber-500', low: 'bg-cyan-500' };
  const statusBg = { optimal: 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/30', high: 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800/30', warning: 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800/30', low: 'bg-cyan-50 dark:bg-cyan-900/10 border-cyan-100 dark:border-cyan-800/30' };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Coolant Intelligence Panel</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Advanced cooling optimization for data centers &amp; hospitals</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm text-center">
          <Thermometer size={20} className="text-red-500 mx-auto mb-2" />
          <div className="text-xl font-bold text-red-500">{actual.toLocaleString()}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Actual Cooling Load</div>
          <div className="text-[10px] text-gray-400">kWh/day</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm text-center">
          <Gauge size={20} className="text-emerald-500 mx-auto mb-2" />
          <div className="text-xl font-bold text-emerald-500">{required.toLocaleString()}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Required Load</div>
          <div className="text-[10px] text-gray-400">kWh/day</div>
        </div>
        <div className={`rounded-xl p-4 border shadow-sm text-center ${excess > 0 ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800/30' : 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/30'}`}>
          <Wind size={20} className={`${excess > 0 ? 'text-red-500' : 'text-emerald-500'} mx-auto mb-2`} />
          <div className={`text-xl font-bold ${excess > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{excessPct > 0 ? `+${excessPct}` : excessPct}%</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Load Variance</div>
          <div className="text-[10px] text-gray-400">{excess > 0 ? 'Over-cooling' : 'Optimal'}</div>
        </div>
      </div>

      {/* Efficiency gauge */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">Cooling Efficiency Score</div>
          <div className={`text-2xl font-bold ${efficiency >= 80 ? 'text-emerald-500' : efficiency >= 65 ? 'text-amber-500' : 'text-red-500'}`}>
            {efficiency}%
          </div>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-4 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ${efficiency >= 80 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : efficiency >= 65 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-red-400 to-red-500'}`}
            style={{ width: `${efficiency}%` }} />
        </div>
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
          <span>Poor</span><span>Average</span><span>Excellent</span>
        </div>
      </div>

      {/* Temperature chart */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Temperature Profile (24h)</div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={tempData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-800" />
            <XAxis dataKey="h" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} unit="°C" />
            <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f9fafb', fontSize: 12 }} />
            <ReferenceLine y={22} stroke="#10b981" strokeDasharray="6 3" label={{ value: 'Ideal 22°C', fill: '#10b981', fontSize: 11 }} />
            <Line type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Zone map */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">Zone Temperature Map</div>
          <div className="flex gap-3 text-xs text-gray-400">
            {Object.entries(statusColor).map(([s, c]) => (
              <div key={s} className="flex items-center gap-1.5 capitalize"><div className={`w-2.5 h-2.5 rounded-full ${c}`} />{s}</div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {zoneTemps.map(z => (
            <div key={z.zone} className={`p-3 rounded-xl border card-hover ${statusBg[z.status]}`}>
              <div className="flex justify-between items-start">
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">{z.zone}</div>
                <div className={`w-2 h-2 rounded-full ${statusColor[z.status]}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{z.temp}°C</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-0.5">{z.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-medium transition-all shadow-lg shadow-cyan-500/20 hover:scale-105">
          <ArrowDownCircle size={16} /> Reduce Coolant Flow 10%
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium transition-all shadow-lg shadow-emerald-500/20 hover:scale-105">
          <Wind size={16} /> Auto-Optimize Cooling
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
          <ArrowUpCircle size={16} /> Increase to {targetTemp + 1}°C
        </button>
      </div>
    </div>
  );
}
