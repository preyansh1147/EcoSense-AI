import { useState } from 'react';
import { Settings2, Lightbulb, Wind, Thermometer, Clock, Zap, Check, Play } from 'lucide-react';

const INITIAL_CONTROLS = {
  lights: 'auto',
  hvac: true,
  cooling: true,
  loadScheduling: false,
};

const RULES = [
  { id: 1, icon: '💡', title: 'Auto Lights Off', desc: 'Turn off lights if no motion for 10 min', active: true, savings: '₹2,400/mo' },
  { id: 2, icon: '☀️', title: 'Solar Priority Mode', desc: 'Use solar when available before grid', active: true, savings: '₹8,100/mo' },
  { id: 3, icon: '❄️', title: 'Night Cooling Reduction', desc: 'Reduce cooling to 70% between 10PM–6AM', active: false, savings: '₹4,500/mo' },
  { id: 4, icon: '⚡', title: 'Peak Load Shift', desc: 'Defer non-critical load during 2–5PM tariff peak', active: true, savings: '₹6,200/mo' },
  { id: 5, icon: '🔋', title: 'Battery Discharge Window', desc: 'Use battery storage during peak tariff hours', active: false, savings: '₹3,800/mo' },
];

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-all duration-300 ${checked ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${checked ? 'left-5' : 'left-0.5'}`} />
    </button>
  );
}

export default function Automation({ data }) {
  const [controls, setControls] = useState(INITIAL_CONTROLS);
  const [rules, setRules] = useState(RULES);
  const [lights, setLights] = useState('auto');
  const [runningRule, setRunningRule] = useState(null);

  const toggleRule = (id) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const triggerRule = async (id) => {
    setRunningRule(id);
    await new Promise(r => setTimeout(r, 1500));
    setRunningRule(null);
  };

  const activeSavings = rules
    .filter(r => r.active)
    .reduce((s, r) => s + parseInt(r.savings.replace(/[₹,/mo]/g, '')), 0);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Automation & Control Panel</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manual controls and intelligent automation rules</p>
      </div>

      {/* Savings banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl p-4 text-white shadow-lg shadow-emerald-500/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs opacity-80">Monthly savings from active rules</div>
            <div className="text-3xl font-bold mt-1">₹{activeSavings.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-xs opacity-80">Active rules</div>
            <div className="text-3xl font-bold">{rules.filter(r => r.active).length}/{rules.length}</div>
          </div>
        </div>
      </div>

      {/* Manual controls */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Settings2 size={16} className="text-emerald-500" />
          <div className="text-sm font-semibold text-gray-900 dark:text-white">Manual Controls</div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Lighting mode */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
              <Lightbulb size={14} className="text-amber-500" /> Lighting
            </div>
            <div className="flex gap-1">
              {['on', 'auto', 'off'].map(m => (
                <button key={m} onClick={() => setLights(m)}
                  className={`flex-1 py-1 rounded text-[10px] font-semibold capitalize transition-all ${lights === m ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* HVAC */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
              <Wind size={14} className="text-cyan-500" /> HVAC
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{controls.hvac ? 'Running' : 'Stopped'}</span>
              <Toggle checked={controls.hvac} onChange={v => setControls(p => ({ ...p, hvac: v }))} />
            </div>
          </div>

          {/* Cooling */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
              <Thermometer size={14} className="text-blue-500" /> Cooling
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{controls.cooling ? 'Active' : 'Off'}</span>
              <Toggle checked={controls.cooling} onChange={v => setControls(p => ({ ...p, cooling: v }))} />
            </div>
          </div>

          {/* Load scheduling */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
              <Clock size={14} className="text-purple-500" /> Scheduling
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{controls.loadScheduling ? 'On' : 'Off'}</span>
              <Toggle checked={controls.loadScheduling} onChange={v => setControls(p => ({ ...p, loadScheduling: v }))} />
            </div>
          </div>
        </div>
      </div>

      {/* Automation rules */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-emerald-500" />
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Automation Rules</div>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">Click rule to run manually</div>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {rules.map(rule => (
            <div key={rule.id} className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="text-xl flex-shrink-0">{rule.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{rule.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{rule.desc}</div>
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex-shrink-0 hidden sm:block">{rule.savings}</div>
              <button onClick={() => triggerRule(rule.id)}
                className={`p-1.5 rounded-lg flex-shrink-0 transition-all ${runningRule === rule.id ? 'bg-emerald-500 text-white animate-spin' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600'}`}>
                {runningRule === rule.id ? <Check size={14} /> : <Play size={14} />}
              </button>
              <Toggle checked={rule.active} onChange={() => toggleRule(rule.id)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
