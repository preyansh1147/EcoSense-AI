import { useState, useEffect, useRef } from 'react';
import {
  Zap, Cloud, DollarSign, Leaf, TrendingDown, TrendingUp,
  AlertTriangle, CheckCircle2, Upload, FileText, Download,
  ToggleLeft, ToggleRight, Sparkles, Activity, Award,
} from 'lucide-react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine,
} from 'recharts';

/* ─── animated counter ──────────────────────────────────────────────── */
function useCount(target, duration = 1100) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const n = typeof target === 'number' ? target : parseFloat(target) || 0;
    let cur = 0;
    const step = n / (duration / 16);
    const t = setInterval(() => {
      cur += step;
      if (cur >= n) { setVal(n); clearInterval(t); } else setVal(Math.floor(cur));
    }, 16);
    return () => clearInterval(t);
  }, [target, duration]);
  return val;
}

/* ─── KPI chip inside Energy Usage card ─────────────────────────────── */
function KpiChip({ icon: Icon, label, value, unit, color }) {
  const num = useCount(typeof value === 'number' ? value : parseFloat(value) || 0);
  const colorCls = {
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    cyan: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    teal: 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
  };
  const iconCls = { emerald: 'bg-emerald-500', cyan: 'bg-cyan-500', amber: 'bg-amber-500', teal: 'bg-teal-500' };
  return (
    <div className={`rounded-xl p-3 border ${colorCls[color]} flex items-start gap-2.5`}>
      <div className={`w-7 h-7 rounded-lg ${iconCls[color]} flex items-center justify-center flex-shrink-0`}>
        <Icon size={13} className="text-white" />
      </div>
      <div>
        <div className="text-[11px] opacity-70 mb-0.5">{label}</div>
        <div className="text-sm font-bold leading-none">
          {typeof value === 'number' ? num.toLocaleString() : value}
          <span className="text-[11px] font-normal ml-1 opacity-70">{unit}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Row 1 · Card A: Energy Usage ──────────────────────────────────── */
function EnergyUsageCard({ data }) {
  const { live, carbonCredit, alerts } = data;
  const critAlert = alerts.find(a => a.level === 'critical') || alerts.find(a => a.level === 'warning');
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Energy Usage Today</h3>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Live building performance</p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-500 font-medium">
          <div className="relative w-2 h-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-60" />
          </div>
          Live
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <KpiChip icon={Zap} label="Energy Consumed" value={live.energy} unit="kWh" color="cyan" />
        <KpiChip icon={Cloud} label="Carbon Emissions" value={live.co2} unit="kg CO₂e" color="emerald" />
        <KpiChip icon={DollarSign} label="Cost Savings Est." value={Math.round(live.cost * 0.12)} unit="₹" color="amber" />
        <KpiChip icon={Leaf} label="Credits Earned" value={carbonCredit.credits} unit="tCO₂e" color="teal" />
      </div>
      {critAlert && (
        <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/40 rounded-xl p-3">
          <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="flex-1 text-[11px] text-red-700 dark:text-red-400 leading-snug">{critAlert.msg}</p>
          <button className="text-[10px] font-semibold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-lg hover:bg-red-200 transition-colors flex-shrink-0">
            Fix
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Row 1 · Card B: Connect Your Building ─────────────────────────── */
function ConnectBuildingCard() {
  const [dragging, setDragging] = useState(false);
  const [uploaded, setUploaded] = useState(null);
  const [buildingType, setBuildingType] = useState('Office');
  const inputRef = useRef(null);
  const TYPES = ['Office', 'School', 'Factory'];

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploaded(file.name);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Connect Your Building</h3>
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Upload energy data to get started</p>
      </div>
      <div>
        <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Building Type</label>
        <div className="flex flex-wrap gap-1.5">
          {TYPES.map(t => (
            <button key={t} onClick={() => setBuildingType(t)}
              className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all ${
                buildingType === t
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-emerald-400 hover:text-emerald-600'
              }`}>{t}</button>
          ))}
        </div>
      </div>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
          dragging ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10'
            : 'border-gray-200 dark:border-gray-700 hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/5'
        }`}>
        <input ref={inputRef} type="file" accept=".csv,.xlsx" className="hidden"
          onChange={e => { const f = e.target.files[0]; if (f) setUploaded(f.name); }} />
        {uploaded ? (
          <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={18} /><span className="text-xs font-medium">{uploaded} uploaded!</span>
          </div>
        ) : (
          <>
            <Upload size={22} className="mx-auto mb-2 text-gray-400" />
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Drag &amp; drop CSV / XLSX</p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">or click to browse</p>
          </>
        )}
      </div>
      <button className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2">
        <FileText size={13} />Analyze {buildingType} Data
      </button>
    </div>
  );
}

/* ─── Row 1 · Card C: Carbon Forecast ───────────────────────────────── */
function CarbonForecastCard({ data }) {
  const chart30 = data.forecast['30d'];
  const [optimized, setOptimized] = useState(false);
  const [running, setRunning] = useState(false);
  const displayData = optimized ? chart30.map(d => ({ ...d, co2: Math.round(d.co2 * 0.78) })) : chart30;
  const budgetVal = chart30[0]?.budget ?? 0;
  const breachWeeks = displayData.filter(d => d.co2 > d.budget).length;

  const runOpt = () => {
    setRunning(true);
    setTimeout(() => { setRunning(false); setOptimized(true); }, 1600);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Carbon Forecast</h3>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">30-day projection vs budget</p>
        </div>
        {!optimized && breachWeeks > 0 ? (
          <div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-800/40">
            <AlertTriangle size={11} />Breach in {breachWeeks * 7 > 5 ? '5 days' : `${breachWeeks * 7}d`}
          </div>
        ) : optimized ? (
          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
            <CheckCircle2 size={11} />Optimized!
          </div>
        ) : null}
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={displayData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-800" />
          <XAxis dataKey="t" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#f9fafb', fontSize: 11 }} />
          <ReferenceLine y={budgetVal} stroke="#f59e0b" strokeDasharray="4 3" strokeWidth={1.5}
            label={{ value: 'Budget', position: 'right', fontSize: 10, fill: '#f59e0b' }} />
          <Line type="monotone" dataKey="co2" stroke={optimized ? '#10b981' : '#f87171'}
            strokeWidth={2} dot={{ r: 3, fill: optimized ? '#10b981' : '#f87171' }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
      <button onClick={runOpt} disabled={running || optimized}
        className={`w-full py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
          optimized ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 cursor-default'
            : 'bg-blue-600 hover:bg-blue-500 text-white'
        }`}>
        {running ? <><span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />Analyzing…</>
          : optimized ? <><CheckCircle2 size={13} />Optimization Applied</>
          : <><Sparkles size={13} />Run Optimization</>}
      </button>
    </div>
  );
}

/* ─── Row 2 · Card D: Recommended Actions ───────────────────────────── */
function RecommendedActionsCard() {
  const [toggles, setToggles] = useState([
    { id: 'lighting', label: 'Dim Idle Lighting', saving: '8%', color: 'amber', on: false },
    { id: 'cooling', label: 'Optimize Cooling', saving: '14%', color: 'cyan', on: false },
    { id: 'solar', label: 'Shift to Solar Power', saving: '18%', color: 'emerald', on: false },
    { id: 'hvac', label: 'Smart HVAC Scheduling', saving: '10%', color: 'teal', on: false },
  ]);
  const [applied, setApplied] = useState(false);
  const flip = (id) => setToggles(prev => prev.map(t => t.id === id ? { ...t, on: !t.on } : t));
  const applyAll = () => { setToggles(prev => prev.map(t => ({ ...t, on: true }))); setApplied(true); };
  const activeCount = toggles.filter(t => t.on).length;

  const badgeCls = { amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300', cyan: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300', emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300', teal: 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300' };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Recommended Actions</h3>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{activeCount} of {toggles.length} active</p>
        </div>
        {applied && <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><CheckCircle2 size={11} /> All applied</div>}
      </div>
      <div className="space-y-2">
        {toggles.map(t => (
          <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
            <button onClick={() => flip(t.id)} className="flex-shrink-0">
              {t.on ? <ToggleRight size={24} className={`text-${t.color}-500`} /> : <ToggleLeft size={24} className="text-gray-300 dark:text-gray-600" />}
            </button>
            <p className="flex-1 text-xs font-medium text-gray-800 dark:text-gray-200">{t.label}</p>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeCls[t.color]}`}>-{t.saving}</span>
          </div>
        ))}
      </div>
      <button onClick={applyAll}
        className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20">
        <Sparkles size={13} />Apply All Fixes
      </button>
    </div>
  );
}

/* ─── Row 2 · Card E: Impact After Optimization ─────────────────────── */
function ImpactCard({ data }) {
  const base = data.forecast['7d'];
  const [showOptimized, setShowOptimized] = useState(false);
  const optimizedData = base.map(d => ({ ...d, optimized: Math.round(d.co2 * 0.74) }));
  const totalBase = base.reduce((s, d) => s + d.co2, 0);
  const totalOpt = optimizedData.reduce((s, d) => s + d.optimized, 0);
  const reduction = Math.round(((totalBase - totalOpt) / totalBase) * 100);
  const costSaving = Math.round(totalBase * 0.26 * 42);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Impact After Optimization</h3>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">Projected 7-day benefit</p>
        </div>
        <button onClick={() => setShowOptimized(p => !p)}
          className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all ${
            showOptimized ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-emerald-400'
          }`}>{showOptimized ? 'Optimized' : 'Compare'}</button>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={optimizedData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} /><stop offset="95%" stopColor="#f87171" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="optGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-800" />
          <XAxis dataKey="t" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#f9fafb', fontSize: 11 }} />
          <Area type="monotone" dataKey="co2" stroke="#f87171" strokeWidth={1.5} fill="url(#baseGrad)" dot={false} name="Before" />
          {showOptimized && <Area type="monotone" dataKey="optimized" stroke="#10b981" strokeWidth={2} fill="url(#optGrad)" dot={false} name="After" />}
        </AreaChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Energy Use', value: `-${Math.round(reduction * 0.9)}%`, color: 'text-cyan-600 dark:text-cyan-400' },
          { label: 'Carbon Emit.', value: `-${reduction}%`, color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Cost Saved', value: `₹${costSaving.toLocaleString()}`, color: 'text-amber-600 dark:text-amber-400' },
        ].map(m => (
          <div key={m.label} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-2.5 text-center border border-gray-100 dark:border-gray-800">
            <div className={`text-sm font-bold ${m.color}`}>{m.value}</div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Row 2 · Card F: Carbon Credits ────────────────────────────────── */
function CarbonCreditsCard({ data }) {
  const { carbonCredit } = data;
  const [downloading, setDownloading] = useState(false);
  const totalReduced = useCount(carbonCredit.totalSaved);
  const totalValue = useCount(carbonCredit.valueINR);
  const monthly = carbonCredit.monthly ?? [];
  const maxSaved = Math.max(...monthly.map(m => m.saved));

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Carbon Credits Generated</h3>
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">ESG performance summary</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 border border-emerald-100 dark:border-emerald-800/40">
          <Leaf size={16} className="text-emerald-600 dark:text-emerald-400 mb-1" />
          <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{totalReduced.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600/70 dark:text-emerald-400/70">Tons CO₂ Reduced</div>
        </div>
        <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-3 border border-teal-100 dark:border-teal-800/40">
          <Award size={16} className="text-teal-600 dark:text-teal-400 mb-1" />
          <div className="text-lg font-bold text-teal-700 dark:text-teal-300">₹{totalValue.toLocaleString()}</div>
          <div className="text-[11px] text-teal-600/70 dark:text-teal-400/70">Market Value (INR)</div>
        </div>
      </div>
      <div>
        <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">Monthly credit generation</div>
        <div className="flex items-end gap-1.5 h-12">
          {monthly.map(m => (
            <div key={m.m} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full rounded-t bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all duration-700"
                style={{ height: `${Math.max(8, (m.saved / maxSaved) * 44)}px` }} />
              <span className="text-[9px] text-gray-400">{m.m}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-800">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20">
          <span className="text-white text-xs font-bold">{carbonCredit.esgScore}</span>
        </div>
        <div>
          <div className="text-xs font-semibold text-gray-800 dark:text-gray-200">ESG Score</div>
          <div className="text-[11px] text-gray-500 dark:text-gray-400">
            {carbonCredit.esgScore >= 80 ? '🟢 Top tier performer' : carbonCredit.esgScore >= 70 ? '🟡 Above average' : '🔴 Needs improvement'}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => { setDownloading(true); setTimeout(() => setDownloading(false), 1800); }}
          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5">
          <FileText size={12} />{downloading ? 'Generating…' : 'Generate ESG Report'}
        </button>
        <button onClick={() => { setDownloading(true); setTimeout(() => setDownloading(false), 1800); }}
          className="py-2 px-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs transition-colors flex items-center gap-1.5">
          <Download size={12} />PDF
        </button>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────────────── */
export default function Dashboard({ data }) {
  return (
    <div className="p-4 md:p-6 space-y-5">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          EcoSense AI — Predictive Carbon Intelligence Platform
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {data.label} · Real-time command center
        </p>
      </div>

      {/* Row 1: Energy · Connect · Forecast */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <EnergyUsageCard data={data} />
        <ConnectBuildingCard />
        <CarbonForecastCard data={data} />
      </div>

      {/* Row 2: Actions · Impact · Credits */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <RecommendedActionsCard />
        <ImpactCard data={data} />
        <CarbonCreditsCard data={data} />
      </div>
    </div>
  );
}

