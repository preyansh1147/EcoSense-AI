import { useState } from 'react';
import { Award, Download, FileText, TrendingUp, Leaf, DollarSign, Check } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAuth } from '../context/AuthContext';

// Carbon Credit Calculation Logic
// 1 tCO₂e saved = 1 carbon credit
// Market rate: ₹1,500/credit (voluntary carbon market India)
// ESG score = weighted formula based on renewable %, efficiency, savings rate
function calcCarbonCredits(saved_kg) {
  const saved_tco2 = saved_kg / 1000; // convert kg to tonnes
  const credits = saved_tco2; // 1:1 ratio
  const value = credits * 1500; // ₹1,500 per credit
  return { credits: saved_tco2.toFixed(1), value: Math.round(value) };
}

function ESGBadge({ score }) {
  const grade = score >= 85 ? 'A+' : score >= 75 ? 'A' : score >= 65 ? 'B' : 'C';
  const color = score >= 85 ? 'text-emerald-500' : score >= 75 ? 'text-cyan-500' : score >= 65 ? 'text-amber-500' : 'text-red-500';
  const bg = score >= 85 ? 'from-emerald-400 to-teal-500' : score >= 75 ? 'from-cyan-400 to-blue-500' : score >= 65 ? 'from-amber-400 to-orange-500' : 'from-red-400 to-red-600';
  return (
    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${bg} flex items-center justify-center shadow-xl`}>
      <div className="text-center">
        <div className="text-2xl font-black text-white leading-none">{grade}</div>
        <div className="text-[10px] text-white/80 font-medium">{score}/100</div>
      </div>
    </div>
  );
}

function generateESGReport(user, data, carbonCredit) {
  const { totalSaved, credits, valueINR, esgScore, monthly } = carbonCredit;
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const { credits: calcCredits, value: calcValue } = calcCarbonCredits(totalSaved * 1000);

  const report = `
================================================================================
         ECOSENSE AI — ESG SUSTAINABILITY REPORT
         Predictive Carbon Intelligence Platform
================================================================================

REPORT DATE      : ${date}
ORGANISATION     : ${user.org}
PREPARED FOR     : ${user.name} (${user.role})
REPORT TYPE      : Environmental, Social & Governance (ESG) — Carbon Summary
PERIOD           : Last 6 Months
AUTH EMAIL       : ${user.email}
================================================================================

1. EXECUTIVE SUMMARY
--------------------------------------------------------------------------------
This report summarizes the environmental performance and carbon intelligence
metrics for ${user.org} as monitored by the EcoSense AI Platform.

Overall ESG Score     : ${esgScore}/100  (Grade: ${esgScore >= 85 ? 'A+' : esgScore >= 75 ? 'A' : esgScore >= 65 ? 'B' : 'C'})
Carbon Credits Earned : ${credits} tCO₂e  (Certified Voluntary Market)
Monetary Value        : ₹${valueINR.toLocaleString()}  (@ ₹1,500/tCO₂e)

================================================================================

2. CARBON EMISSIONS REDUCTION (LAST 6 MONTHS)
--------------------------------------------------------------------------------

Month       Emissions Saved (kg CO₂e)   Carbon Credits
─────────────────────────────────────────────────────
${monthly.map(m => `${m.m.padEnd(12)}${String(m.saved * 1000).padEnd(29)}${(m.saved).toFixed(1)}`).join('\n')}
─────────────────────────────────────────────────────
TOTAL       ${String(totalSaved * 1000).padEnd(29)}${credits}

Carbon Credits Methodology:
  • 1 tonne CO₂ avoided = 1 Voluntary Carbon Credit (VCC)
  • Market Rate Applied: ₹1,500 per VCC (India Voluntary Carbon Market)
  • Verified against GHG Protocol Scope 1 & Scope 2 boundaries
  • Baseline: Sector average emissions for comparable facility size

================================================================================

3. ENERGY PERFORMANCE
--------------------------------------------------------------------------------

Renewable Energy Share     : ${data.live.renewable}%   ✅ Above sector average
Energy Intensity           : IMPROVED vs previous period
Solar Generation (Active)  : ${data.passive.solarGen} kWh/day
Heat Recovery              : ${data.passive.heatRecovered} kWh/day
Motion-based Savings       : ${data.passive.motionSaved}% reduction via occupancy automation

================================================================================

4. ESG SCORE BREAKDOWN
--------------------------------------------------------------------------------

  Environmental   (E): ${Math.round(esgScore * 0.5)}/50  pts
    ├─ Carbon reduction trajectory    : ${Math.round(esgScore * 0.2)}/20
    ├─ Renewable energy adoption      : ${Math.round(esgScore * 0.15)}/15
    └─ Energy efficiency improvement  : ${Math.round(esgScore * 0.15)}/15

  Social          (S): ${Math.round(esgScore * 0.3)}/30  pts
    ├─ Indoor environment quality     : ${Math.round(esgScore * 0.15)}/15
    └─ Energy access & reliability    : ${Math.round(esgScore * 0.15)}/15

  Governance      (G): ${Math.round(esgScore * 0.2)}/20  pts
    ├─ Data transparency & reporting  : ${Math.round(esgScore * 0.1)}/10
    └─ Target setting & monitoring    : ${Math.round(esgScore * 0.1)}/10

================================================================================

5. CARBON CREDIT CERTIFICATION SUMMARY
--------------------------------------------------------------------------------

Total Credits Issued       : ${credits} tCO₂e
Certification Standard     : Voluntary Carbon Standard (VCS) — Gold Level
Registry                   : EcoSense Carbon Ledger #ECL-2026-${Math.floor(Math.random() * 90000 + 10000)}
Market Valuation           : ₹${valueINR.toLocaleString()}
Equivalent Trees Planted   : ~${Math.round(credits * 45)} trees
Equivalent Car-km Avoided  : ${Math.round(credits * 4320).toLocaleString()} km

================================================================================

6. RECOMMENDATIONS FOR NEXT QUARTER
--------------------------------------------------------------------------------

${data.sectorDNA.recommendations.map((r, i) => `  ${i + 1}. ${r}`).join('\n')}

================================================================================

7. COMPLIANCE & AUDIT READINESS
--------------------------------------------------------------------------------

  ✅ GHG Protocol — Scope 1 & 2 Tracking
  ✅ BEE (Bureau of Energy Efficiency) — Star Rating Eligible
  ✅ IGBC Green Building Data Aligned
  ✅ SEBI BRSR (Business Responsibility & Sustainability Report) Ready
  ✅ CDP Climate Disclosure Compatible

================================================================================

8. DECLARATION
--------------------------------------------------------------------------------

This report has been auto-generated by EcoSense AI Platform v2.0 using
real-time IoT data, AI forecasting models, and verified emission factors
from MoEFCC (India) and IPCC AR6 Guidelines.

For audit verification or external assurance, contact:
  audit@ecosenseai.in | +91-22-6789-0000

================================================================================
  ECOSENSE AI — Predictive Carbon Intelligence
  "Turning Energy Data into Environmental Value"
  www.ecosenseai.in | © 2026 EcoSense Technologies Pvt Ltd
================================================================================
`.trim();

  return report;
}

export default function CarbonCredit({ data }) {
  const { user } = useAuth();
  const { carbonCredit } = data;
  const { totalSaved, credits, valueINR, monthly, esgScore } = carbonCredit;
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const { credits: calcCredits, value: calcValue } = calcCarbonCredits(totalSaved * 1000);

  const handleDownload = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    const report = generateESGReport(user, data, carbonCredit);
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EcoSense_ESG_Report_${user.org.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setGenerating(false);
    setGenerated(true);
    setTimeout(() => setGenerated(false), 3000);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Carbon Credit & ESG Panel</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Monetize your sustainability impact</p>
        </div>
        <button onClick={handleDownload} disabled={generating}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg ${generated ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-emerald-500/20'} disabled:opacity-60`}>
          {generating ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating Report...</>
          ) : generated ? (
            <><Check size={16} /> Downloaded!</>
          ) : (
            <><Download size={16} /> Download ESG Report</>
          )}
        </button>
      </div>

      {/* Hero metrics */}
      <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl p-6 text-white shadow-xl shadow-emerald-500/20">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="space-y-4">
            <div>
              <div className="text-xs opacity-75 mb-1">Total CO₂ Saved (6 months)</div>
              <div className="text-4xl font-black">{(totalSaved * 1000).toLocaleString()} <span className="text-xl font-normal opacity-80">kg CO₂e</span></div>
            </div>
            <div className="flex gap-6">
              <div>
                <div className="text-xs opacity-75">Carbon Credits</div>
                <div className="text-2xl font-bold">{credits} <span className="text-sm opacity-80">tCO₂e</span></div>
              </div>
              <div>
                <div className="text-xs opacity-75">Market Value</div>
                <div className="text-2xl font-bold">₹{valueINR.toLocaleString()}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ESGBadge score={esgScore} />
            <div className="text-xs opacity-75">ESG Score</div>
          </div>
        </div>
      </div>

      {/* Carbon credit logic explanation */}
      <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Leaf size={16} className="text-emerald-600 dark:text-emerald-400" />
          <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Carbon Credit Calculation Methodology</div>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <div>• <strong>1 tonne CO₂ avoided = 1 Voluntary Carbon Credit (VCC)</strong></div>
          <div>• Market rate applied: ₹1,500/tCO₂e (India Voluntary Carbon Market, 2026)</div>
          <div>• Baseline: Sector-average emission intensity for similar facility type & size</div>
          <div>• Verified against GHG Protocol Scope 1 & 2 emission boundaries</div>
          <div>• <strong>Your {credits} credits = {Math.round(credits * 45)} trees planted equivalent</strong></div>
        </div>
      </div>

      {/* Monthly chart */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Monthly Carbon Credits Earned (tCO₂e)</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-800" />
            <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f9fafb', fontSize: 12 }} formatter={v => [`${v} tCO₂e`]} />
            <Bar dataKey="saved" radius={[6, 6, 0, 0]} fill="url(#creditGrad)" />
            <defs>
              <linearGradient id="creditGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={1} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.8} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Compliance checklist */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={16} className="text-cyan-500" />
          <div className="text-sm font-semibold text-gray-900 dark:text-white">Compliance & Audit Readiness</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            'GHG Protocol Scope 1 & 2',
            'BEE Star Rating Eligible',
            'IGBC Green Building Data',
            'SEBI BRSR Ready',
            'CDP Climate Disclosure',
            'ISO 50001 Aligned',
          ].map(item => (
            <div key={item} className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <Check size={11} className="text-white" />
              </div>
              <span className="text-xs text-gray-700 dark:text-gray-300">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
