import { useState, useEffect } from 'react';
import { ArrowRight, Zap, Sun, Battery, Building2, Thermometer, Lightbulb, Server } from 'lucide-react';

function FlowNode({ label, value, unit, icon: Icon, color, pulse }) {
  return (
    <div className={`flex flex-col items-center gap-2 group`}>
      <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${color} transition-transform duration-200 group-hover:scale-105`}>
        <Icon size={26} className="text-white" />
        {pulse && (
          <div className={`absolute inset-0 rounded-2xl ${color} opacity-30 animate-ping`} />
        )}
      </div>
      <div className="text-center">
        <div className="text-xs font-semibold text-gray-900 dark:text-white">{label}</div>
        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">{value} {unit}</div>
      </div>
    </div>
  );
}

function FlowArrow({ label, animated }) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div className={`relative flex items-center w-full justify-center`}>
        <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500 to-cyan-400 relative overflow-hidden rounded">
          {animated && (
            <div className="absolute inset-y-0 left-0 w-8 bg-white/60 rounded animate-[slide_1.5s_linear_infinite]"
              style={{ animation: 'flowAnim 1.5s linear infinite' }} />
          )}
        </div>
        <ArrowRight size={14} className="text-cyan-500 absolute right-0 -mr-1" />
      </div>
      {label && <div className="text-[10px] text-gray-400 dark:text-gray-500">{label}</div>}
    </div>
  );
}

export default function EnergyFlow({ data }) {
  const { energyFlow, live } = data;
  const [animating, setAnimating] = useState(true);

  const solar = energyFlow.solar || 0;
  const battery = energyFlow.battery || 0;
  const grid = energyFlow.grid || 0;
  const building = energyFlow.building || live.energy || 0;

  const outputs = [
    { key: 'cooling', label: 'Cooling', icon: Thermometer, value: energyFlow.cooling || energyFlow.cooling || 0 },
    { key: 'lighting', label: 'Lighting', icon: Lightbulb, value: energyFlow.lighting || 0 },
    { key: 'servers', label: 'Servers / Medical', icon: Server, value: energyFlow.servers || energyFlow.medical || 0 },
    { key: 'other', label: 'Other', icon: Zap, value: energyFlow.other || energyFlow.hvac || 0 },
  ];

  const totalOut = outputs.reduce((s, o) => s + o.value, 0);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Energy Flow Visualizer</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Real-time energy movement across your facility</p>
        </div>
        <button onClick={() => setAnimating(p => !p)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${animating ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400' : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'}`}>
          {animating ? '⚡ Live Flow' : '⏸ Paused'}
        </button>
      </div>

      {/* Main flow diagram */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm overflow-x-auto">
        <style>{`
          @keyframes flowAnim {
            0% { left: -2rem; }
            100% { left: 100%; }
          }
        `}</style>

        {/* Sources → Building */}
        <div className="min-w-[600px]">
          <div className="text-xs font-semibold text-gray-400 dark:text-gray-600 mb-4 uppercase tracking-wider">Energy Sources → Building</div>
          <div className="flex items-end gap-2 mb-8">
            {/* Sources */}
            <div className="flex flex-col gap-6">
              <FlowNode label="Solar" value={solar} unit="kWh" icon={Sun} color="bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-400/30" pulse={animating} />
              <FlowNode label="Battery" value={battery} unit="kWh" icon={Battery} color="bg-gradient-to-br from-cyan-400 to-blue-500 shadow-cyan-400/30" pulse={animating} />
              <FlowNode label="Grid" value={grid} unit="kWh" icon={Zap} color="bg-gradient-to-br from-gray-500 to-gray-700 shadow-gray-500/30" pulse={false} />
            </div>

            {/* Arrows to building */}
            <div className="flex-1 flex flex-col gap-6 px-4">
              {[solar, battery, grid].map((v, i) => (
                <FlowArrow key={i} label={`${v} kWh`} animated={animating && v > 0} />
              ))}
            </div>

            {/* Building */}
            <FlowNode label="Building" value={building} unit="kWh" icon={Building2} color="bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30" pulse={animating} />

            {/* Arrows to consumers */}
            <div className="flex-1 flex flex-col gap-3 px-4">
              {outputs.map((o, i) => (
                <FlowArrow key={i} label={`${o.value} kWh`} animated={animating && o.value > 0} />
              ))}
            </div>

            {/* Consumers */}
            <div className="flex flex-col gap-3">
              {outputs.map(o => (
                <FlowNode key={o.key} label={o.label} value={o.value} unit="kWh" icon={o.icon}
                  color={o.value > building * 0.4 ? 'bg-gradient-to-br from-red-400 to-red-600 shadow-red-400/20' : 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-400/20'}
                  pulse={false} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Waste analysis */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-xl p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Renewable Share</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{live.renewable}%</div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
            <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${live.renewable}%` }} />
          </div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-xl p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Grid Dependency</div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{((grid / building) * 100).toFixed(0)}%</div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
            <div className="bg-amber-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${((grid / building) * 100).toFixed(0)}%` }} />
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 rounded-xl p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Cooling Waste</div>
          <div className="text-2xl font-bold text-red-500 dark:text-red-400">~{((energyFlow.cooling / building - 0.35) * 100 > 0 ? (energyFlow.cooling / building - 0.35) * 100 : 3).toFixed(0)}%</div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">Excess above optimal baseline</div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-red-400" />High load consumers</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-emerald-500" />Normal consumers</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-1 bg-gradient-to-r from-emerald-500 to-cyan-400 rounded" />Active energy flow</div>
      </div>
    </div>
  );
}
