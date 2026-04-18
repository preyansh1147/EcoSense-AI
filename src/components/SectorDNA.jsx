import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import { Cpu, TrendingUp, TrendingDown } from 'lucide-react';

const COLORS = ['#10b981', '#06b6d4', '#14b8a6', '#6ee7b7'];

export default function SectorDNA({ data }) {
  const { sectorDNA } = data;
  const { energyBreakdown, comparison, recommendations, peakHour, baseLoad, coolingDep } = sectorDNA;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sector DNA Insights</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Your unique energy behavior fingerprint</p>
      </div>

      {/* Comparison badge */}
      <div className={`flex items-center gap-3 p-4 rounded-xl border ${comparison > 0 ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800/30' : 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/30'}`}>
        {comparison > 0 ? <TrendingUp size={20} className="text-red-500 flex-shrink-0" /> : <TrendingDown size={20} className="text-emerald-500 flex-shrink-0" />}
        <div>
          <div className={`text-sm font-semibold ${comparison > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            You use {Math.abs(comparison)}% {comparison > 0 ? 'more' : 'less'} cooling than similar facilities in your sector
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Based on sector benchmark analysis of 120+ comparable sites</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie chart */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Energy Usage Distribution</div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={energyBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%"
                  innerRadius={45} outerRadius={75} paddingAngle={3}>
                  {energyBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f9fafb', fontSize: 12 }} formatter={v => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {energyBreakdown.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <div className="flex-1 text-xs text-gray-600 dark:text-gray-400">{item.name}</div>
                  <div className="text-xs font-semibold text-gray-900 dark:text-white">{item.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Behavior profile */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Energy Behavior Profile</div>
          <div className="space-y-4">
            {[
              { label: 'Peak Hours', value: peakHour, icon: '⚡', desc: 'Highest energy demand window' },
              { label: 'Base Load', value: baseLoad, icon: '📊', desc: 'Constant minimum consumption' },
              { label: 'Cooling Dependency', value: coolingDep, icon: '❄️', desc: 'Share of cooling in total load' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-lg flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">{item.label} — {item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Cpu size={16} className="text-emerald-500" />
          <div className="text-sm font-semibold text-gray-900 dark:text-white">AI-Powered Recommendations</div>
          <div className="ml-auto text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">Sector-Specific</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{rec}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
